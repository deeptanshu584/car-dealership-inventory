export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export function createApiClient(getToken: () => string | null, onUnauthorized: () => void, baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api') {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${baseUrl}${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (response.status === 204) return undefined as T;
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      throw new ApiError(response.status, payload.error?.message ?? 'Request failed');
    }
    return payload as T;
  }
  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
    delete: (path: string) => request<void>('DELETE', path),
  };
}
