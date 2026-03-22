import { useRouter } from "vue-router";
import { apiFetch } from "../../api/api-client";
import { useAlert } from "../../common/alerts/useMyAlert";
import { useAuthStore } from "../../common/stores/authStore";
import { useUserStore } from "../../common/stores/userStore";
import { usePermissionStore } from "../../common/stores/permissionsStore";

export const useLogin = () => {
  const { showAlert } = useAlert();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const router = useRouter();

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

      // Limpiar permisos anteriores para recargarlos del nuevo usuario
      permissionStore.clear();

      const myResult = await apiFetch(`/user/me`, { method: "GET" });

      if (!myResult.success) {
        showAlert(
          myResult.error?.message ||
            "Error al obtener información del usuario.",
          undefined,
          "error",
        );
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

  return { submitLogin };
};
