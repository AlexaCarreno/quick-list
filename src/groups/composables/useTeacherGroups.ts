import { ref } from "vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import type { Group } from "../interfaces/groups.interfaces";
import type { GetGroupsQuery } from "../api/groupsApi";
import { getMyGroups } from "../api/teacherGroupApi";

export const useTeacherGroups = () => {
  const { showAlert } = useAlert();

  const groups = ref<Group[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const fetchMyGroups = async (query: GetGroupsQuery = {}) => {
    console.log("fetchMyGroups called");
    loading.value = true;
    try {
      const res = await getMyGroups(query);
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

  return {
    groups,
    total,
    loading,
    fetchMyGroups,
  };
};
