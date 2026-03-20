import { ref } from "vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import {
  closeAttendance,
  createAttendance,
  deleteAttendance,
  getAttendanceById,
  getAttendancesByGroup,
  getAttendanceStudents,
  initAttendance,
  recognizeFace,
  updateStudentAttendance,
} from "../api/attendanceApi";

export interface AttendanceSession {
  _id: string;
  groupId: string;
  date: string;
  startTime: string;
  endTime: string;
  shift: string;
  status: "open" | "closed";
  totalExpected: number;
  totalPresent: number;
  createdBy: string;
  createdAt: string;
}

export interface StudentAttendanceRecord {
  _id: string;
  attendanceId: string;
  studentId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    birthday: string;
    career: string;
    photo?: string;
    hasFaceProfile: boolean;
  };
  status: "present" | "absent" | "late" | "excused";
  method: "facial" | "manual";
  recognitionTime?: string;
}

export const useAttendance = () => {
  const { showAlert } = useAlert();

  const sessions = ref<AttendanceSession[]>([]);
  const session = ref<AttendanceSession | null>(null);
  const students = ref<StudentAttendanceRecord[]>([]);
  const total = ref(0);
  const totalStudents = ref(0);
  const loading = ref(false);
  const creating = ref(false);
  const closing = ref(false);

  const fetchSessionsByGroup = async (
    groupId: string,
    query: { limit?: number; offset?: number; status?: string } = {},
  ) => {
    loading.value = true;
    try {
      const res = await getAttendancesByGroup(groupId, query);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar sesiones.",
          undefined,
          "error",
        );
        return;
      }
      sessions.value = res.data.attendances;
      total.value = res.data.metadata.total;
    } finally {
      loading.value = false;
    }
  };

  const fetchSessionById = async (attendanceId: string) => {
    loading.value = true;
    try {
      const res = await getAttendanceById(attendanceId);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar sesión.",
          undefined,
          "error",
        );
        return;
      }
      session.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchStudents = async (
    attendanceId: string,
    query: {
      limit?: number;
      offset?: number;
      name?: string;
      status?: string;
    } = {},
  ) => {
    loading.value = true;
    try {
      const res = await getAttendanceStudents(attendanceId, query);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cargar estudiantes.",
          undefined,
          "error",
        );
        return;
      }
      students.value = res.data.students;
      totalStudents.value = res.data.metadata.total;
    } finally {
      loading.value = false;
    }
  };

  const startSession = async (payload: {
    groupId: string;
    date: string;
    startTime: string;
    endTime: string;
    shift: string;
  }) => {
    creating.value = true;
    try {
      const res = await createAttendance(payload);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al crear sesión.",
          undefined,
          "error",
        );
        return null;
      }
      const attendanceId = res.data._id;
      await initAttendance(attendanceId);
      session.value = res.data;
      showAlert("Sesión iniciada correctamente.", undefined, "success");
      return res.data;
    } finally {
      creating.value = false;
    }
  };

  const closeSession = async (attendanceId: string) => {
    closing.value = true;
    try {
      const res = await closeAttendance(attendanceId);
      if (!res.success) {
        showAlert(
          res.error?.message || "Error al cerrar sesión.",
          undefined,
          "error",
        );
        return;
      }
      if (session.value) session.value.status = "closed";
      showAlert("Sesión cerrada correctamente.", undefined, "success");
      return res;
    } finally {
      closing.value = false;
    }
  };

  const updateStatus = async (
    attendanceId: string,
    studentId: string,
    status: string,
  ) => {
    const res = await updateStudentAttendance(attendanceId, studentId, status);
    if (!res.success) {
      showAlert(
        res.error?.message || "Error al actualizar estado.",
        undefined,
        "error",
      );
      return;
    }
    // Actualizar localmente
    const record = students.value.find((s) => s.studentId._id === studentId);
    if (record) {
      record.status = status as any;
      record.method = "manual";
    }
    return res;
  };

  const recognize = async (attendanceId: string, imageBlob: Blob) => {
    const res = await recognizeFace(attendanceId, imageBlob);
    if (!res.success) return null;

    if (res.data.recognized && res.data.student_ids?.length > 0) {
      // Actualizar localmente todos los estudiantes reconocidos
      for (const studentId of res.data.student_ids) {
        const record = students.value.find(
          (s) => s.studentId._id === studentId,
        );
        if (record && record.status === "absent") {
          record.status = "present";
          record.method = "facial";
        }
      }
    }
    return res.data;
  };

  const deleteSession = async (attendanceId: string) => {
    const res = await deleteAttendance(attendanceId);
    if (!res.success) {
      showAlert(
        res.error?.message || "Error al eliminar sesión.",
        undefined,
        "error",
      );
      return false;
    }
    showAlert("Sesión eliminada correctamente.", undefined, "success");
    return true;
  };

  return {
    sessions,
    session,
    students,
    total,
    totalStudents,
    loading,
    creating,
    closing,
    fetchSessionsByGroup,
    fetchSessionById,
    fetchStudents,
    startSession,
    closeSession,
    updateStatus,
    recognize,
    deleteSession,
  };
};
