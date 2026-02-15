import { defineStore } from "pinia";
import { ref } from "vue";
import { apiFetch } from "../../api/api-client";

export interface Permission {
  resource: string;
  action: string;
}

export const usePermissionStore = defineStore("permission", () => {
  // state
  const roles = ref<string[]>([]);
  const permissions = ref<Permission[]>([]);
  const loaded = ref(false);
  const isLoading = ref(false); // Flag de carga en progreso
  const loadAttempts = ref(0); // Contador de intentos
  const maxAttempts = 3; // Máximo de intentos

  // actions
  const setPermissions = (data: {
    roles: string[];
    permissions: Permission[];
  }) => {
    roles.value = data.roles;
    permissions.value = data.permissions;
    loaded.value = true;
    loadAttempts.value = 0;
  };

  const clear = () => {
    roles.value = [];
    permissions.value = [];
    loaded.value = false;
    isLoading.value = false;
    loadAttempts.value = 0;
  };

  const loadPermissions = async () => {
    if (loaded.value) {
      console.log("✅ Permisos ya cargados desde caché");
      return;
    }

    if (isLoading.value) {
      console.log("⏳ Ya se están cargando permisos, esperando...");
      let waitAttempts = 0;
      while (isLoading.value && waitAttempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        waitAttempts++;
      }
      // Si después de esperar está loaded, retornar
      if (loaded.value) return;
      // Si no, continuar (pero probablemente falló)
      if (isLoading.value) {
        throw new Error("Timeout esperando carga de permisos");
      }
    }

    if (loadAttempts.value >= maxAttempts) {
      console.error("❌ Máximo de intentos alcanzado");
      throw new Error(
        `No se pudieron cargar permisos después de ${maxAttempts} intentos`,
      );
    }

    isLoading.value = true;
    loadAttempts.value++;

    try {
      console.log(
        `🔄 Cargando permisos (intento ${loadAttempts.value}/${maxAttempts})...`,
      );

      const result = await apiFetch("/rbac/me", { method: "GET" });

      if (!result.success) {
        throw new Error(result.error?.message || "Error al cargar permisos");
      }

      setPermissions({
        roles: result.data.roles,
        permissions: result.data.permissions,
      });

      console.log("✅ Permisos cargados exitosamente:", {
        roles: result.data.roles,
        permissions: result.data.permissions,
      });
    } catch (error) {
      console.error(
        `❌ Error al cargar permisos (intento ${loadAttempts.value}):`,
        error,
      );
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // getters
  const hasRole = (role: string) => roles.value.includes(role);

  const can = (resource: string, action: string) => {
    return permissions.value.some(
      (p) =>
        p.resource === resource &&
        (p.action === action || p.action === "manage"),
    );
  };

  return {
    // state
    roles,
    permissions,
    loaded,

    // actions
    setPermissions,
    clear,
    loadPermissions,

    // getters
    hasRole,
    can,
  };
});
