import { apiFetch } from "../api/api-client";

export interface GetStudentsQuery {
  limit?: number;
  offset?: number;
  name?: string;
  email?: string;
  documentNumber?: string;
  career?: string;
}

export const getStudents = async (query: GetStudentsQuery = {}) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.name) params.append("name", query.name);
  if (query.email) params.append("email", query.email);
  if (query.documentNumber)
    params.append("documentNumber", query.documentNumber);
  if (query.career) params.append("career", query.career);

  return await apiFetch(`/students?${params.toString()}`);
};

export const createStudent = async (formData: FormData) => {
  return await apiFetch("/students", {
    method: "POST",
    body: formData,
  });
};

export const updateStudent = async (id: string, formData: FormData) => {
  return await apiFetch(`/students/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const toggleStudentState = async (id: string) => {
  return await apiFetch(`/students/${id}/toggle-state`, {
    method: "PATCH",
  });
};

export const registerStudentFace = async (id: string, formData: FormData) => {
  return await apiFetch(`/students/${id}/register-face`, {
    method: "PATCH",
    body: formData,
  });
};

export const getStudentById = async (id: string) => {
  return await apiFetch(`/students/${id}`);
};

export const getStudentFaceStatus = async (id: string) => {
  return await apiFetch(`/students/${id}/face-status`);
};

export const deleteStudentFaceProfile = async (id: string) => {
  return await apiFetch(`/students/${id}/face-profile`, {
    method: "DELETE",
  });
};
