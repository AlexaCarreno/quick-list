import { apiFetch } from "../../api/api-client";
import type { ISchedule } from "../interfaces/groups.interfaces";

export interface GetGroupsQuery {
  limit?: number;
  offset?: number;
  referenceCode?: string;
  subject?: string;
  period?: string;
  status?: string;
}

export interface CreateGroupPayload {
  referenceCode: string;
  subject: string;
  color: string;
  period: string;
  startDate: string;
  endDate: string;
  minAttendanceThreshold?: number;
  schedules?: ISchedule[];
  teacherId?: string;
}

export interface UpdateGroupPayload {
  referenceCode?: string;
  subject?: string;
  color?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  minAttendanceThreshold?: number;
  schedules?: ISchedule[];
  teacherId?: string | null;
}

export const getGroups = async (query: GetGroupsQuery = {}) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.referenceCode) params.append("referenceCode", query.referenceCode);
  if (query.subject) params.append("subject", query.subject);
  if (query.period) params.append("period", query.period);
  if (query.status) params.append("status", query.status);

  return await apiFetch(`/groups?${params.toString()}`);
};

export const getGroupById = async (id: string) => {
  return await apiFetch(`/groups/${id}`);
};

export const createGroup = async (payload: CreateGroupPayload) => {
  return await apiFetch("/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const updateGroup = async (id: string, payload: UpdateGroupPayload) => {
  return await apiFetch(`/groups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const toggleGroupStatus = async (id: string) => {
  return await apiFetch(`/groups/${id}/toggle-status`, {
    method: "PATCH",
  });
};

export const deleteGroup = async (id: string) => {
  return await apiFetch(`/groups/${id}`, {
    method: "DELETE",
  });
};
