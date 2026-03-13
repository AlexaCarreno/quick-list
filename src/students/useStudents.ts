import { ref } from "vue";
import { useAlert } from "../common/alerts/useMyAlert";
import type { Student } from "./student.interfaces";
import {
  createStudent,
  getStudents,
  toggleStudentState,
  updateStudent,
  type GetStudentsQuery,
} from "./studentApi";

export const useStudents = () => {
  const { showAlert } = useAlert();

  const students = ref<Student[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref(false);
  const toggling = ref(false);

  const fetchStudents = async (query: GetStudentsQuery = {}) => {
    loading.value = true;
    try {
      const res = await getStudents(query);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar estudiantes.",
          undefined,
          "error",
        );
        return;
      }
      students.value = res.data.students;
      total.value = res.data.metadata.total;
    } finally {
      loading.value = false;
    }
  };

  const addStudent = async (formData: FormData) => {
    creating.value = true;
    try {
      const res = await createStudent(formData);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al crear estudiante.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Estudiante creado correctamente.", undefined, "success");
      return res;
    } finally {
      creating.value = false;
    }
  };

  const editStudent = async (id: string, formData: FormData) => {
    updating.value = true;
    try {
      const res = await updateStudent(id, formData);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al actualizar estudiante.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Estudiante actualizado correctamente.", undefined, "success");
      return res;
    } finally {
      updating.value = false;
    }
  };

  const toggleState = async (id: string) => {
    toggling.value = true;
    try {
      const res = await toggleStudentState(id);
      if (!res.success) {
        showAlert(
          res.error?.message || "No se pudo cambiar el estado.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert(
        res.data.state ? "Estudiante activado." : "Estudiante desactivado.",
        undefined,
        "success",
      );
      return res;
    } finally {
      toggling.value = false;
    }
  };

  return {
    students,
    total,
    loading,
    creating,
    updating,
    toggling,
    fetchStudents,
    addStudent,
    editStudent,
    toggleState,
  };
};
