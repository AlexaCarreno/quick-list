import { apiFetch } from "../../api/api-client";

export interface GetAdminsQuery {
  offset?: number;
  limit?: number;
  nameContains?: string;
  emailContains?: string;
  documentNumberContains?: string;
}

export const getAdmins = async (query: GetAdminsQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  return await apiFetch(`/admins${queryString ? `?${queryString}` : ""}`);
};

export const createAdmin = async (formData: FormData) => {
  return await apiFetch("/accounts/admins", {
    method: "POST",
    body: formData,
  });
};

export const updateAdmin = async (id: string, formData: FormData) => {
  return await apiFetch(`/admins/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const toggleAdminState = async (id: string) => {
  return await apiFetch(`/admins/${id}/toggle-state`, {
    method: "PATCH",
  });
};
