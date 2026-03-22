import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { apiFetch } from "../../api/api-client";
import { usePermissionStore } from "../stores/permissionsStore";

export const useLogout = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error en logout: ", error);
    } finally {
      authStore.clearAccessToken();
      localStorage.removeItem("auth");
      usePermissionStore().clear();

      // redirigir
      router.push({ name: "login" });
    }
  };

  return { logout };
};
