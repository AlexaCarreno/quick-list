import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { config } from "../../config";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(null);
  const isInitialized = ref(false);

  const setAccessToken = (token: string) => {
    accessToken.value = token;
  };

  const clearAccessToken = () => {
    accessToken.value = null;
  };

  const isAuthenticated = computed(() => !!accessToken.value);

  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;
    try {
      const res = await fetch(
        `${config.apiBaseUrl}/api/v1/auth/refresh-tokens`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.data?.accessToken) {
          accessToken.value = json.data.accessToken;
        }
      }
    } catch {
      // no autenticado
    } finally {
      isInitialized.value = true;
    }
  };

  return {
    accessToken,
    isAuthenticated,
    isInitialized,
    setAccessToken,
    clearAccessToken,
    initialize,
  };
});
