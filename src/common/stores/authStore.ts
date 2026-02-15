import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref<string | null>(null);
    const hydrated = ref(false);

    const setAccessToken = (token: string) => {
      accessToken.value = token;
    };

    const clearAccesstoken = () => {
      accessToken.value = null;
    };

    const isAuthenticated = computed(() => !!accessToken.value);

    return {
      /* properties */
      accessToken,
      isAuthenticated,
      hydrated,
      /* methods */
      setAccessToken,
      clearAccesstoken,
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["accessToken"],
      afterHydrate: (ctx) => {
        ctx.store.hydrated = true;
      },
    },
  },
);
