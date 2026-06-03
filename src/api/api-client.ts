import { useAuthStore } from "../common/stores/authStore";
import { config } from "../config";

let refreshPromise: Promise<boolean> | null = null;

const doRefresh = async (): Promise<boolean> => {
  const authStore = useAuthStore();
  try {
    const res = await fetch(`${config.apiBaseUrl}/api/v1/auth/refresh-tokens`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const json = await res.json().catch(() => null);
    if (!json?.data?.accessToken) return false;   

    authStore.setAccessToken(json.data.accessToken);
    return true;
  } catch {
    return false;
  }
};

export const tryRefreshToken = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  auth: boolean = true,
  retry: boolean = true,
): Promise<any> => {
  const authStore = useAuthStore();
  const rawHeaders = normalizeHeaders(options.headers);
  const headers: Record<string, string> = { ...rawHeaders };

  if (auth) {
    headers["Authorization"] = `Bearer ${authStore.accessToken}`;
  }

  if (
    options.method !== "GET" &&
    !headers["Content-Type"] &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}/api/v1${url}`, {
      ...options,
      credentials: "include",
      headers,
    });

    const json = await res.json().catch(() => null);

    if (res.status === 401 && retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiFetch(url, options, true, false);
      } else {
        authStore.clearAccessToken();
        return {
          success: false,
          statusCode: 401,
          error: { message: "Sesión expirada" },
        };
      }
    }

    return json;
  } catch (error) {
    console.error("Error de red o conexión:", error);
    return {
      success: false,
      statusCode: 0,
      error: { message: "Error de red o servidor no disponible" },
    };
  }
};

function normalizeHeaders(
  headers: HeadersInit | undefined,
): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers as Record<string, string>;
}
