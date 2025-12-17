/* ====================== TYPES ====================== */

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
  getToken?: () =>
    | string
    | null
    | undefined
    | Promise<string | null | undefined>;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
}

/* ====================== ERROR ====================== */

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

/* ====================== CLIENT ====================== */

export class HttpClient {
  private readonly fetchFn: typeof fetch;
  private readonly baseUrl: string;

  constructor(private readonly options: HttpClientOptions) {
    if (!options.baseUrl || !/^https?:\/\//i.test(options.baseUrl)) {
      throw new Error(`HttpClient: invalid baseUrl "${options.baseUrl}"`);
    }

    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetchFn = (options.fetchFn ?? globalThis.fetch).bind(globalThis);
  }

  /* ====================== PUBLIC API ====================== */

  get<TResponse = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
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

  delete<TResponse = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>('DELETE', path, options);
  }

  /* ====================== INTERNAL ====================== */

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    // 🔥 если вдруг передали абсолютный URL — используем как есть
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const url = new URL(
      path.replace(/^\//, ''),
      `${this.baseUrl}/`,
    );

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value == null || value === '') return;

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v != null) url.searchParams.append(key, String(v));
          });
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

  private isArrayBufferLike(
    value: unknown,
  ): value is ArrayBuffer | ArrayBufferView {
    return (
      typeof ArrayBuffer !== 'undefined' &&
      (value instanceof ArrayBuffer ||
        (typeof ArrayBuffer.isView === 'function' &&
          ArrayBuffer.isView(value)))
    );
  }

  private async request<TResponse>(
    method: HttpMethod,
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const {
      body,
      query,
      headers,
      responseType = 'json',
      signal,
      authenticate = true,
    } = options ?? {};

    const url = this.buildUrl(path, query);

    const mergedHeaders = new Headers();

    // default headers
    this.applyHeaders(mergedHeaders, this.options.defaultHeaders);

    // request headers
    this.applyHeaders(mergedHeaders, headers);

    // 🔐 auth
    if (authenticate && this.options.getToken) {
      const token = await this.options.getToken();
      if (token) {
        mergedHeaders.set('Authorization', `Bearer ${token}`);
      }
    }

    let payload: BodyInit | undefined;

    if (body !== undefined && body !== null) {
      if (this.isFormData(body)) {
        payload = body;
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
      let errorDetails: unknown = null;

      try {
        errorDetails = await response.clone().json();
      } catch {
        try {
          errorDetails = await response.clone().text();
        } catch {
          errorDetails = null;
        }
      }

      throw new HttpError(
        `HTTP ${method} ${url} failed with status ${response.status}`,
        response.status,
        errorDetails,
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
      source.forEach((v, k) => target.set(k, v));
      return;
    }

    if (Array.isArray(source)) {
      source.forEach(([k, v]) => target.set(k, v));
      return;
    }

    Object.entries(source).forEach(([k, v]) => {
      if (v !== undefined) target.set(k, String(v));
    });
  }
}

/* ====================== SINGLETON ====================== */

export const Client = new HttpClient({
  baseUrl:
    import.meta.env.VITE_ADMIN_API_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api',

  getToken: () => localStorage.getItem('token'),
});
