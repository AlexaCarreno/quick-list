import { apiFetch } from "../../api/api-client";

export interface GetAttendancesQuery {
  limit?: number;
  offset?: number;
  status?: string;
}

export const createAttendance = async (payload: {
  groupId: string;
  date: string;
  startTime: string;
  endTime: string;
  shift: string;
}) => {
  return await apiFetch("/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const initAttendance = async (attendanceId: string) => {
  return await apiFetch(`/attendance/${attendanceId}/init`, {
    method: "POST",
  });
};

export const getAttendancesByGroup = async (
  groupId: string,
  query: GetAttendancesQuery = {},
) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.status) params.append("status", query.status);
  return await apiFetch(`/attendance/group/${groupId}?${params.toString()}`);
};

export const getAttendanceById = async (attendanceId: string) => {
  return await apiFetch(`/attendance/${attendanceId}`);
};

export const closeAttendance = async (attendanceId: string) => {
  return await apiFetch(`/attendance/${attendanceId}/close`, {
    method: "PATCH",
  });
};

export const getAttendanceStudents = async (
  attendanceId: string,
  query: {
    limit?: number;
    offset?: number;
    name?: string;
    status?: string;
  } = {},
) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.name) params.append("name", query.name);
  if (query.status) params.append("status", query.status);
  return await apiFetch(
    `/attendance/${attendanceId}/students?${params.toString()}`,
  );
};

export const updateStudentAttendance = async (
  attendanceId: string,
  studentId: string,
  status: string,
) => {
  return await apiFetch(`/attendance/${attendanceId}/students/${studentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

export const recognizeFace = async (attendanceId: string, imageBlob: Blob) => {
  const formData = new FormData();
  formData.append("photo", imageBlob, "frame.jpg");
  return await apiFetch(`/attendance/${attendanceId}/recognize`, {
    method: "POST",
    body: formData,
  });
};

export const deleteAttendance = async (attendanceId: string) => {
  return await apiFetch(`/attendance/${attendanceId}`, {
    method: "DELETE",
  });
};
