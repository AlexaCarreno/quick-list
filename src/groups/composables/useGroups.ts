import { ref } from "vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import type { Group } from "../interfaces/groups.interfaces";
import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  toggleGroupStatus,
  updateGroup,
  type CreateGroupPayload,
  type GetGroupsQuery,
  type UpdateGroupPayload,
} from "../api/groupsApi";

export const useGroups = () => {
  const { showAlert } = useAlert();

  const groups = ref<Group[]>([]);
  const group = ref<Group | null>(null);
  const total = ref(0);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref(false);
  const toggling = ref(false);
  const deleting = ref(false);

  const fetchGroups = async (query: GetGroupsQuery = {}) => {
    loading.value = true;
    try {
      const res = await getGroups(query);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar grupos.",
          undefined,
          "error",
        );
        return;
      }
      groups.value = res.data.groups;
      total.value = res.data.metadata.total;
    } finally {
      loading.value = false;
    }
  };

  const fetchGroupById = async (id: string) => {
    loading.value = true;
    try {
      const res = await getGroupById(id);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar el grupo.",
          undefined,
          "error",
        );
        return;
      }
      group.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const addGroup = async (payload: CreateGroupPayload) => {
    creating.value = true;
    try {
      const res = await createGroup(payload);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al crear grupo.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Grupo creado correctamente.", undefined, "success");
      return res;
    } finally {
      creating.value = false;
    }
  };

  const editGroup = async (id: string, payload: UpdateGroupPayload) => {
    updating.value = true;
    try {
      const res = await updateGroup(id, payload);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al actualizar grupo.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Grupo actualizado correctamente.", undefined, "success");
      return res;
    } finally {
      updating.value = false;
    }
  };

  const toggleStatus = async (id: string) => {
    toggling.value = true;
    try {
      const res = await toggleGroupStatus(id);
      if (!res.success) {
        showAlert(
          res.error?.message || "No se pudo cambiar el estado.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert(
        res.data.status === "active" ? "Grupo activado." : "Grupo inactivado.",
        undefined,
        "success",
      );
      return res;
    } finally {
      toggling.value = false;
    }
  };

  const removeGroup = async (id: string) => {
    deleting.value = true;
    try {
      const res = await deleteGroup(id);
      if (!res.success) {
        showAlert(
          res.error?.message || "No se pudo eliminar el grupo.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Grupo eliminado correctamente.", undefined, "success");
      return res;
    } finally {
      deleting.value = false;
    }
  };

  return {
    groups,
    group,
    total,
    loading,
    creating,
    updating,
    toggling,
    deleting,
    fetchGroups,
    fetchGroupById,
    addGroup,
    editGroup,
    toggleStatus,
    removeGroup,
  };
};
