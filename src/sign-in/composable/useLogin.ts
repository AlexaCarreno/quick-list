import { useRouter } from "vue-router";
import { apiFetch } from "../../api/api-client";
import type { AlertType } from "../../common/alerts/useMyAlert";
import { useAuthStore } from "../../common/stores/authStore";
import { useUserStore } from "../../common/stores/userStore";

export const useLogin = (
  handleAlert: (title: string, msg?: string, type?: AlertType) => void,
) => {
  //----------- properties -----------//

  const authStore = useAuthStore();
  const userStore = useUserStore();

  const router = useRouter();

  //----------- methods -----------//

  const submitLogin = async (payload: { email: string; password: string }) => {
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!result.success) {
        const message = result.error?.message || "Credenciales inválidas.";
        handleAlert(`${message} ❌`);
        return;
      }

      const { accessToken } = result.data;
      authStore.setAccessToken(accessToken);

      const myResult = await apiFetch(`/user/me`, {
        method: "GET",
      });

      if (!myResult.success) {
        let message =
          myResult.error?.message ||
          "Ocurrio un error al obtener la informacion del usuario.";
        handleAlert(`${message} ❌`);
        return;
      }

      userStore.setUser(myResult.data.user);

      handleAlert("Bienvenido a QuickList ✅");

      await new Promise((resolve) => setTimeout(resolve, 700));

      router.push({ name: "groups" });
    } catch (error) {
      console.error("Error al hacer login:", error);
      handleAlert("Error inesperado, por favor intenta de nuevo. ❌");
    }
  };

  return {
    // properties

    // methods
    submitLogin,
  };
};
