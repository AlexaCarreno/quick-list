import { ref } from "vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import {
  addStudentsToGroup,
  addStudentToGroup,
  getGroupStudents,
  removeStudentFromGroup,
  toggleStudentAllowed,
  type GetGroupStudentsQuery,
} from "../api/studentGroupApi";

export interface StudentInGroup {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    birthday: string;
    career: string;
    semester: number;
    photo?: string;
    state: boolean;
    createdAt: string;
  };
  groupId: string;
  allowed: boolean;
  createdAt: string;
}

export const useStudentGroup = () => {
  const { showAlert } = useAlert();

  const students = ref<StudentInGroup[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const adding = ref(false);
  const removing = ref(false);
  const toggling = ref(false);

  const fetchGroupStudents = async (
    groupId: string,
    query: GetGroupStudentsQuery = {},
  ) => {
    loading.value = true;
    try {
      const res = await getGroupStudents(groupId, query);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar estudiantes del grupo.",
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

  const addStudent = async (groupId: string, studentId: string) => {
    adding.value = true;
    try {
      const res = await addStudentToGroup(groupId, studentId);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al vincular estudiante.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Estudiante vinculado correctamente.", undefined, "success");
      return res;
    } finally {
      adding.value = false;
    }
  };

  const removeStudent = async (groupId: string, studentId: string) => {
    removing.value = true;
    try {
      const res = await removeStudentFromGroup(groupId, studentId);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al desvincular estudiante.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert("Estudiante desvinculado correctamente.", undefined, "success");
      return res;
    } finally {
      removing.value = false;
    }
  };

  const toggleAllowed = async (groupId: string, studentId: string) => {
    toggling.value = true;
    try {
      const res = await toggleStudentAllowed(groupId, studentId);

      if (!res.success) {
        showAlert(
          res.error?.message || "No se pudo cambiar el estado.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert(
        res.data.allowed
          ? "Estudiante activado en el grupo."
          : "Estudiante desactivado en el grupo.",
        undefined,
        "success",
      );
      return res;
    } finally {
      toggling.value = false;
    }
  };

  const addStudents = async (groupId: string, studentIds: string[]) => {
    adding.value = true;
    try {
      const res = await addStudentsToGroup(groupId, studentIds);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al vincular estudiantes.",
          undefined,
          "error",
        );
        return res;
      }
      showAlert(
        `${res.data.linked} estudiante(s) vinculado(s) correctamente.`,
        undefined,
        "success",
      );
      return res;
    } finally {
      adding.value = false;
    }
  };

  return {
    students,
    total,
    loading,
    adding,
    removing,
    toggling,
    fetchGroupStudents,
    addStudent,
    removeStudent,
    toggleAllowed,
    addStudents,
  };
};
