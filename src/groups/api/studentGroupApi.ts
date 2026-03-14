import { apiFetch } from "../../api/api-client";

export interface GetGroupStudentsQuery {
  limit?: number;
  offset?: number;
  name?: string;
  documentNumber?: string;
  career?: string;
}

export const getGroupStudents = async (
  groupId: string,
  query: GetGroupStudentsQuery = {},
) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.name) params.append("name", query.name);
  if (query.documentNumber)
    params.append("documentNumber", query.documentNumber);
  if (query.career) params.append("career", query.career);

  return await apiFetch(`/groups/${groupId}/students?${params.toString()}`);
};

export const addStudentToGroup = async (groupId: string, studentId: string) => {
  return await apiFetch(`/groups/${groupId}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });
};

export const removeStudentFromGroup = async (
  groupId: string,
  studentId: string,
) => {
  return await apiFetch(`/groups/${groupId}/students/${studentId}`, {
    method: "DELETE",
  });
};

export const toggleStudentAllowed = async (
  groupId: string,
  studentId: string,
) => {
  return await apiFetch(`/groups/${groupId}/students/${studentId}/toggle`, {
    method: "PATCH",
  });
};

export const addStudentsToGroup = async (
  groupId: string,
  studentIds: string[],
) => {
  return await apiFetch(`/groups/${groupId}/students/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentIds }),
  });
};
