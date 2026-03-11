import { ref } from "vue";
import {
  createTeacher,
  getTeachers,
  type GetTeachersQuery,
} from "../api/teachersApi";
import type { Teacher } from "../user.interfaces";
import { useAlert } from "../../common/alerts/useMyAlert";

export const useTeachers = () => {
  const { showAlert } = useAlert();

  const teachers = ref<Teacher[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const creating = ref(false);

  const fetchTeachers = async (query: GetTeachersQuery) => {
    loading.value = true;

    const res = await getTeachers(query);

    if (res.success) {
      teachers.value = res.data.teachers;
      total.value = res.data.metadata.total;
    }

    loading.value = false;
  };

  const addTeacher = async (formData: FormData) => {
    creating.value = true;
    try {
      const res = await createTeacher(formData);
      if (!res.success) {
        // Lanza el mensaje de error que venga del backend
        const message = res.error?.message || "No se pudo crear el docente.";
        showAlert(message, undefined, "error");
      }

      showAlert("Docente creado", undefined, "success");

      return res;
    } finally {
      creating.value = false;
    }
  };

  return {
    // props
    teachers,
    total,
    loading,
    creating,

    // methods
    fetchTeachers,
    addTeacher,
  };
};
