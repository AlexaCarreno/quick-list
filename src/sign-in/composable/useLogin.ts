import { useRouter } from "vue-router";
import { apiFetch } from "../../api/api-client";
import { useAlert } from "../../common/alerts/useMyAlert";
import { useAuthStore } from "../../common/stores/authStore";
import { useUserStore } from "../../common/stores/userStore";

export const useLogin = () => {
  //----------- properties -----------//

  const { showAlert } = useAlert();

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
        showAlert(message, undefined, "error");
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
        showAlert(message, undefined, "error");
        return;
      }

      userStore.setUser(myResult.data.user);

      showAlert("Bienvenido a QuickList", undefined, "success");

      await new Promise((resolve) => setTimeout(resolve, 700));

      router.push({ name: "root" });
    } catch (error) {
      console.error("Error al hacer login:", error);
      showAlert("Error inesperado, intenta nuevamente", undefined, "error");
    }
  };

  return {
    // properties

    // methods
    submitLogin,
  };
};
