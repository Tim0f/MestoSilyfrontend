export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'void';

export interface RequestOptions<TBody = unknown> {
  query?: Record<string, unknown>;
  body?: TBody;
  headers?: HeadersInit;
  authenticate?: boolean;
  responseType?: ResponseType;
  signal?: AbortSignal;
}

export interface HttpClientOptions {
  baseUrl: string;
  getToken?: () => string | null | undefined | Promise<string | null | undefined>;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
}

export class HttpError<T = unknown> extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: T,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class HttpClient {
  private readonly fetchFn: typeof fetch;
  private readonly baseUrl: string;

  constructor(private readonly options: HttpClientOptions) {
    this.fetchFn = (options.fetchFn ?? globalThis.fetch).bind(globalThis);
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
  }

  get<TResponse = unknown>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>('GET', path, options);
  }

  post<TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>('POST', path, { ...options, body });
  }

  patch<TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>('PATCH', path, { ...options, body });
  }

  delete<TResponse = unknown>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>('DELETE', path, options);
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(path.replace(/^\//, ''), `${this.baseUrl}/`);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value == null || value === '') return;

        if (Array.isArray(value)) {
          value.forEach((item) => item != null && url.searchParams.append(key, String(item)));
          return;
        }

        url.searchParams.set(key, String(value));
      });
    }

    return url.toString();
  }

  private isFormData(value: unknown): value is FormData {
    return typeof FormData !== 'undefined' && value instanceof FormData;
  }

  private isBlob(value: unknown): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob;
  }

  private isArrayBufferLike(value: unknown): value is ArrayBuffer | ArrayBufferView {
    return (
      typeof ArrayBuffer !== 'undefined' &&
      (value instanceof ArrayBuffer ||
        (typeof ArrayBuffer.isView === 'function' && ArrayBuffer.isView(value)))
    );
  }

  private async request<TResponse>(
    method: HttpMethod,
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const { body, query, headers, responseType = 'json', signal } = options ?? {};
    const url = this.buildUrl(path, query);

    const mergedHeaders = new Headers();

    // default headers
    this.applyHeaders(mergedHeaders, this.options.defaultHeaders);

    // request headers
    this.applyHeaders(mergedHeaders, headers);

    // 🔥 Add auth header
    if (options?.authenticate !== false && this.options.getToken) {
      const token = await this.options.getToken();
      if (token) mergedHeaders.set('Authorization', `Bearer ${token}`);
    }

    let payload: BodyInit | undefined;

    // 🔥 Correct FormData handling
    if (body !== undefined && body !== null) {
      if (this.isFormData(body)) {
        payload = body as FormData;
        mergedHeaders.delete('Content-Type');
      } else if (
        typeof body === 'object' &&
        !this.isArrayBufferLike(body) &&
        !this.isBlob(body)
      ) {
        mergedHeaders.set('Content-Type', 'application/json');
        payload = JSON.stringify(body);
      } else {
        payload = body as BodyInit;
      }
    }

    const response = await this.fetchFn(url, {
      method,
      headers: mergedHeaders,
      body: payload,
      signal,
    });

    if (!response.ok) {
      let errorPayload: unknown;
      try {
        errorPayload = await response.clone().json();
      } catch {
        try {
          errorPayload = await response.clone().text();
        } catch {
          errorPayload = null;
        }
      }

      throw new HttpError(
        `Запрос ${method} ${url} завершился со статусом ${response.status}`,
        response.status,
        errorPayload,
      );
    }

    if (responseType === 'void' || response.status === 204) {
      return undefined as TResponse;
    }

    switch (responseType) {
      case 'text':
        return (await response.text()) as TResponse;
      case 'blob':
        return (await response.blob()) as TResponse;
      case 'arrayBuffer':
        return (await response.arrayBuffer()) as TResponse;
      case 'json':
      default:
        return (await response.json()) as TResponse;
    }
  }

  private applyHeaders(target: Headers, source?: HeadersInit) {
    if (!source) return;

    if (source instanceof Headers) {
      source.forEach((value, key) => target.set(key, value));
      return;
    }

    if (Array.isArray(source)) {
      source.forEach(([key, value]) => target.set(key, value));
      return;
    }

    Object.entries(source).forEach(([key, value]) => {
      if (value !== undefined) target.set(key, String(value));
    });
  }
}

export const Client = new HttpClient({
  baseUrl:
    import.meta.env.VITE_ADMIN_API_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

