import { apiFetch } from "../../api/api-client";
import type { AlertType } from "../../common/alerts/useMyAlert";
import { useStudentStore } from "../stores/studentStore";

export const useStudent = (
  alertHandler: (title: string, msg?: string, type?: AlertType) => void
) => {
  const studentStore = useStudentStore();

  const createStudent = async (groupId: string, payload: FormData) => {
    const result = await apiFetch(`/group/${groupId}/students`, {
      method: "POST",
      body: payload,
    });

    if (!result.success) {
      alertHandler(result.error?.message);
      return;
    }

    studentStore.addNewStudent(result.data);
    alertHandler(`Creado exitosamente. ✅`);
  };

  const loadStudentsFromDB = async (groupId: string) => {
    const result = await apiFetch(`/group/${groupId}/students`, {
      method: "GET",
    });

    if (!result.success) {
      alertHandler(
        `Problemas para obtener los estudiantes.`,
        undefined,
        "warning"
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
      alertHandler(
        "Problemas para eliminar los estudiantes.",
        undefined,
        "warning"
      );
      return;
    }
    studentStore.removeStudents(userIds);

    alertHandler(`Estudiantes eliminados exitosamente. ✅`);
  };

  const updateStudent = async (groupId: string,studentId: string, payload: FormData) => {
    const result = await apiFetch(`/group/${groupId}/students/${studentId}`, {
      method: "PUT",
      body: payload,
    });

    if (!result.success) {
      alertHandler(
        "Problema para actualizar al estudiante.",
        undefined,
        "warning"
      );
      return;
    }

    studentStore.updateStudent(result.data);
    alertHandler("Estudiante actualizado exitosamente. ✅");
  };

  return {
    createStudent,
    loadStudentsFromDB,
    deleteManyStudents,
    updateStudent,
  };
};
