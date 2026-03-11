import { apiFetch } from "../../api/api-client";

export interface GetTeachersQuery {
  offset?: number;
  limit?: number;

  nameContains?: string;
  emailContains?: string;
  documentNumberContains?: string;
}

export const getTeachers = async (query: GetTeachersQuery = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();

  return await apiFetch(`/teachers${queryString ? `?${queryString}` : ""}`);
};

export const createTeacher = async (formData: FormData) => {
  return await apiFetch("/accounts/teachers", {
    method: "POST",
    body: formData,
    // No pongas Content-Type — el browser lo setea automáticamente con el boundary correcto
  });
};
