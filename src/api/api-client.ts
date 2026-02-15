import { useAuthStore } from "../common/stores/authStore";
import { config } from "../config";

let refreshPromise: Promise<boolean> | null = null;

export const tryRefreshToken = async (): Promise<boolean> => {
  // Si ya hay un refresh en progreso, esperar ese resultado
  if (refreshPromise) {
    console.log("⏳ Ya hay un refresh en progreso, esperando...");
    return refreshPromise;
  }

  const authStore = useAuthStore();
  refreshPromise = (async () => {
    try {
      console.log("🔄 Iniciando refresh de token...");
      const res = await fetch(`${config.apiBaseUrl}/api/v1/auth/refresh-tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        console.error("❌ Refresh falló con status:", res.status);
        return false;
      }

      const json = await res.json().catch(() => null);

      if (!json || !json.data?.accessToken) {
        console.error("❌ Respuesta inválida del refresh");
        return false;
      }

      authStore.setAccessToken(json.data.accessToken);
      console.log("✅ Token refrescado exitosamente");
      return true;
    } catch (err) {
      console.error("❌ Error al refrescar token:", err);
      return false;
    } finally {
      // 🆕 Limpiar la promesa después de completar
      refreshPromise = null;
    }
  })();
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
  const headers: Record<string, string> = {
    ...rawHeaders,
  };

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

    // Si hay expiración de token y se puede intentar refrescar
    if (res.status === 401 && retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return apiFetch(url, options, true, false);
      } else {
        authStore.clearAccesstoken();

        return {
          success: false,
          statusCode: 401,
          error: { message: "Sesión expirada" },
        };
      }
    }

    // Devuelve exactamente lo que responde tu backend
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

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
}
