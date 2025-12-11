export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'void';

export interface RequestOptions<TBody = unknown> {
  query?: Record<string, unknown>;
  body?: TBody;
  headers?: HeadersInit;
  /** Передавать ли заголовок Authorization. По умолчанию true. */
  authenticate?: boolean;
  responseType?: ResponseType;
  signal?: AbortSignal;
}

export interface HttpClientOptions {
  baseUrl: string;
  /**
   * Возвращает JWT токен. Может быть синхронной или асинхронной функцией.
   * Если вернёт undefined/null/пустую строку, заголовок Authorization не добавляется.
   */
  getToken?: () => string | null | undefined | Promise<string | null | undefined>;
  /**
   * Переопределение fetch (например, для тестов или SSR).
   */
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
    // Привязываем fetch к глобальному объекту window, чтобы не терять контекст
    if (options.fetchFn) {
      this.fetchFn = options.fetchFn.bind(globalThis);
    } else if (globalThis.fetch) {
      this.fetchFn = globalThis.fetch.bind(globalThis);
    } else {
      throw new Error('Глобальный fetch недоступен. Передайте fetchFn в HttpClientOptions.');
    }

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
        if (value === undefined || value === null || value === '') {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== undefined && item !== null) {
              url.searchParams.append(key, String(item));
            }
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
    this.applyHeaders(mergedHeaders, this.options.defaultHeaders);
    this.applyHeaders(mergedHeaders, headers);

    if (options?.authenticate !== false && this.options.getToken) {
      const token = await this.options.getToken();
      if (token) {
        mergedHeaders.set('Authorization', `Bearer ${token}`);
      }
    }

    let payload: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (this.isFormData(body)) {
        payload = body as FormData;
        // Content-Type для FormData устанавливается автоматически
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
        if (response.status === 204) {
          return undefined as TResponse;
        }
        return (await response.json()) as TResponse;
    }
  }

  private applyHeaders(target: Headers, source?: HeadersInit) {
    if (!source) {
      return;
    }

    if (source instanceof Headers) {
      source.forEach((value, key) => target.set(key, value));
      return;
    }

    if (Array.isArray(source)) {
      source.forEach(([key, value]) => target.set(key, value));
      return;
    }

    Object.entries(source).forEach(([key, value]) => {
      if (value !== undefined) {
        target.set(key, String(value));
      }
    });
  }
}

export const Client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});
