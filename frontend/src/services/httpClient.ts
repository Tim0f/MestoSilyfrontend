// src/services/httpClient.ts
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
  constructor(message: string, public readonly status: number, public readonly details?: T) {
    super(message);
    this.name = 'HttpError';
  }
}

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

  get<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>('GET', path, options);
  }

  post<TResponse = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions<TBody>) {
    return this.request<TResponse>('POST', path, { ...options, body });
  }

  patch<TResponse = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions<TBody>) {
    return this.request<TResponse>('PATCH', path, { ...options, body });
  }

  delete<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>('DELETE', path, options);
  }

  private async request<TResponse>(
    method: HttpMethod,
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const { body, query, headers, responseType = 'json', signal, authenticate = true } = options ?? {};
    const url = this.buildUrl(path, query);

    const mergedHeaders = new Headers();
    this.applyHeaders(mergedHeaders, this.options.defaultHeaders);
    this.applyHeaders(mergedHeaders, headers);

    if (authenticate && this.options.getToken) {
      const token = await this.options.getToken();
      if (token) mergedHeaders.set('Authorization', `Bearer ${token}`);
    }

    let payload: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (body instanceof FormData) {
        payload = body;
        mergedHeaders.delete('Content-Type');
      } else if (typeof body === 'object' && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
        mergedHeaders.set('Content-Type', 'application/json');
        payload = JSON.stringify(body);
      } else {
        payload = body as BodyInit;
      }
    }

    const response = await this.fetchFn(url, { method, headers: mergedHeaders, body: payload, signal });

    if (!response.ok) {
      let errorDetails: unknown = null;
      try { errorDetails = await response.clone().json(); } catch { try { errorDetails = await response.clone().text(); } catch {} }
      throw new HttpError(`HTTP ${method} ${url} failed with status ${response.status}`, response.status, errorDetails);
    }

    if (responseType === 'void' || response.status === 204) return undefined as TResponse;

    switch (responseType) {
      case 'text': return (await response.text()) as TResponse;
      case 'blob': return (await response.blob()) as TResponse;
      case 'arrayBuffer': return (await response.arrayBuffer()) as TResponse;
      default: return (await response.json()) as TResponse;
    }
  }

private buildUrl(path: string, query?: Record<string, unknown>): string {
  let url: URL;

  // абсолютный URL — используем напрямую
  if (/^https?:\/\//i.test(path)) {
    url = new URL(path);
  } else {
    const cleanPath = path.replace(/^\//, '');
    url = new URL(
      cleanPath,
      this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/'
    );
  }

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value == null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach(v => v != null && url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}



  private applyHeaders(target: Headers, source?: HeadersInit) {
    if (!source) return;
    if (source instanceof Headers) { source.forEach((v, k) => target.set(k, v)); return; }
    if (Array.isArray(source)) { source.forEach(([k, v]) => target.set(k, v)); return; }
    Object.entries(source).forEach(([k, v]) => { if (v !== undefined) target.set(k, String(v)); });
  }
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is missing at build time');
}

export const Client = new HttpClient({
  baseUrl: API_URL,
  getToken: () => localStorage.getItem('token'),
});

