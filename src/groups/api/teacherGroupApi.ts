import { apiFetch } from "../../api/api-client";
import type { GetGroupsQuery } from "./groupsApi";

export const getMyGroups = async (query: GetGroupsQuery = {}) => {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.referenceCode) params.append("referenceCode", query.referenceCode);
  if (query.subject) params.append("subject", query.subject);
  if (query.period) params.append("period", query.period);
  if (query.status) params.append("status", query.status);
  return await apiFetch(`/groups/my-groups?${params.toString()}`);
};
