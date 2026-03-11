import { apiFetch } from "../../api/api-client";
import { useAlert } from "../../common/alerts/useMyAlert";
import { useStudentStore } from "../stores/studentStore";

export const useStudent = () => {
  const { showAlert } = useAlert();
  const studentStore = useStudentStore();

  const createStudent = async (groupId: string, payload: FormData) => {
    const result = await apiFetch(`/group/${groupId}/students`, {
      method: "POST",
      body: payload,
    });

    if (!result.success) {
      showAlert(result.error?.message);
      return;
    }

    studentStore.addNewStudent(result.data);
    showAlert(`Creado exitosamente. ✅`);
  };

  const loadStudentsFromDB = async (groupId: string) => {
    const result = await apiFetch(`/group/${groupId}/students`, {
      method: "GET",
    });

    if (!result.success) {
      showAlert(
        `Problemas para obtener los estudiantes.`,
        undefined,
        "warning",
      );
      return;
    }

    studentStore.loadStudents(result.data);
    return;
  };

  const deleteManyStudents = async (groupId: string, userIds: string[]) => {
    const result = await apiFetch(`/group/${groupId}/students`, {
      method: "DELETE",
      body: JSON.stringify({ studentIds: userIds }),
    });

    if (!result.success) {
      showAlert(
        "Problemas para eliminar los estudiantes.",
        undefined,
        "warning",
      );
      return;
    }
    studentStore.removeStudents(userIds);

    showAlert(`Estudiantes eliminados exitosamente. ✅`);
  };

  const updateStudent = async (
    groupId: string,
    studentId: string,
    payload: FormData,
  ) => {
    const result = await apiFetch(`/group/${groupId}/students/${studentId}`, {
      method: "PUT",
      body: payload,
    });

    if (!result.success) {
      showAlert(
        "Problema para actualizar al estudiante.",
        undefined,
        "warning",
      );
      return;
    }

    studentStore.updateStudent(result.data);
    showAlert("Estudiante actualizado exitosamente. ✅");
  };

  return {
    createStudent,
    loadStudentsFromDB,
    deleteManyStudents,
    updateStudent,
  };
};
