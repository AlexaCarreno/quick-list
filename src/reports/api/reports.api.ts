import { apiFetch } from "../../api/api-client";
import { useAuthStore } from "../../common/stores/authStore";
import type { GroupOption, GroupReportQuery, GroupReportResponse, PeriodsResponse, StudentReportResponse, StudentSearchResult } from "../interface/reports.interface";


type SearchField = 'name' | 'email' | 'documentNumber';

export const reportsApi = {
    searchStudents: async (
        search: string,
        field: SearchField = 'name',
    ): Promise<StudentSearchResult[]> => {
        if (!search.trim()) return [];
        const res = await apiFetch(
            `/students?${field}=${encodeURIComponent(search.trim())}&limit=10`,
        );
        return res.data?.students ?? [];
    },

    getGroupReport: async (
        groupId: string,
        query: GroupReportQuery = {},
    ): Promise<GroupReportResponse> => {
        const params = new URLSearchParams();
        if (query.month) params.set('month', query.month);
        if (query.from) params.set('from', query.from);
        if (query.to) params.set('to', query.to);
        const qs = params.toString() ? `?${params.toString()}` : '';
        const res = await apiFetch(`/reports/group/${groupId}${qs}`);
        return res.data;
    },

    exportGroupReport: async (
        groupId: string,
        query: GroupReportQuery = {},
    ): Promise<void> => {
        const authStore = useAuthStore();

        const params = new URLSearchParams();
        if (query.month) params.set('month', query.month);
        if (query.from) params.set('from', query.from);
        if (query.to) params.set('to', query.to);

        const qs = params.toString() ? `?${params.toString()}` : '';

        const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/reports/group/${groupId}/export${qs}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Error al exportar reporte de grupo');
        }

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `reporte-grupo-${groupId}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(downloadUrl);
    },

    getStudentPeriods: async (studentId: string): Promise<PeriodsResponse> => {
        const res = await apiFetch(`/reports/student/${studentId}/periods`);
        return res.data;
    },

    getStudentReport: async (
        studentId: string,
        period: string,
    ): Promise<StudentReportResponse> => {
        const res = await apiFetch(`/reports/student/${studentId}?period=${period}`);
        return res.data;
    },

    exportStudentReport: async (studentId: string, period: string): Promise<void> => {
        const authStore = useAuthStore();

        const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/reports/student/${studentId}/export?period=${period}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Error al exportar reporte de estudiante');
        }

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `reporte-estudiante-${studentId}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(downloadUrl);
    },

    getGroups: async (): Promise<GroupOption[]> => {
        const res = await apiFetch('/groups?limit=100');
        return res.data?.groups ?? [];
    },
};