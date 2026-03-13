import { ref } from "vue";
import {
  createAdmin,
  getAdmins,
  toggleAdminState,
  updateAdmin,
  type GetAdminsQuery,
} from "../api/adminsApi";

import { useAlert } from "../../common/alerts/useMyAlert";
import type { Admin } from "../user.interfaces";

export const useAdmins = () => {
  const { showAlert } = useAlert();

  const admins = ref<Admin[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref(false);
  const toggling = ref(false);

  const fetchAdmins = async (query: GetAdminsQuery) => {
    loading.value = true;
    const res = await getAdmins(query);
    if (res.success) {
      admins.value = res.data.admins;
      total.value = res.data.metadata.total;
    }
    loading.value = false;
  };

  const addAdmin = async (formData: FormData) => {
    creating.value = true;
    try {
      const res = await createAdmin(formData);
      if (!res.success) {
        const message =
          res.error?.message || "No se pudo crear el administrador.";
        showAlert(message, undefined, "error");
        return res;
      }
      showAlert("Administrador creado", undefined, "success");
      return res;
    } finally {
      creating.value = false;
    }
  };

  const editAdmin = async (id: string, formData: FormData) => {
    updating.value = true;
    try {
      const res = await updateAdmin(id, formData);
      if (!res.success) {
        const message =
          res.error?.message || "No se pudo actualizar el administrador.";
        showAlert(message, undefined, "error");
        return res;
      }
      showAlert("Administrador actualizado", undefined, "success");
      return res;
    } finally {
      updating.value = false;
    }
  };

  const toggleState = async (id: string) => {
    toggling.value = true;
    try {
      const res = await toggleAdminState(id);
      if (!res.success) {
        showAlert(
          res.error?.message || "No se pudo cambiar el estado.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert(
        res.data.state ? "Administrador activado" : "Administrador desactivado",
        undefined,
        "success",
      );
      return res;
    } finally {
      toggling.value = false;
    }
  };

  return {
    admins,
    total,
    loading,
    creating,
    updating,
    toggling,
    fetchAdmins,
    addAdmin,
    editAdmin,
    toggleState,
  };
};
