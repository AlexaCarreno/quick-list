import { computed, onMounted, ref } from "vue";
import type { GroupOption, GroupReportQuery, GroupReportResponse } from "../interface/reports.interface";
import { reportsApi } from "../api/reports.api";

export function useGroupReport() {
    const report = ref<GroupReportResponse | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const groupId = ref('');
    const filterType = ref<'all' | 'month' | 'range'>('all');
    const selectedMonth = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');

    const groups = ref<GroupOption[]>([]);
    const loadingGroups = ref(false);

    const buildQuery = (): GroupReportQuery => {
        if (filterType.value === 'month' && selectedMonth.value)
            return { month: selectedMonth.value };
        if (filterType.value === 'range' && dateFrom.value)
            return { from: dateFrom.value, to: dateTo.value || undefined };
        return {};
    };

    const fetch = async () => {
        if (!groupId.value) return;
        loading.value = true;
        error.value = null;
        try {
            report.value = await reportsApi.getGroupReport(groupId.value, buildQuery());
        } catch {
            error.value = 'Error al cargar el reporte de grupo.';
        } finally {
            loading.value = false;
        }
    };

    const exportXlsx = () => {
        if (!groupId.value) return;
        reportsApi.exportGroupReport(groupId.value, buildQuery());
    };

    const fetchGroups = async () => {
        loadingGroups.value = true;
        try {
            groups.value = await reportsApi.getGroups();
        } catch {
            error.value = 'Error al cargar los grupos.';
        } finally {
            loadingGroups.value = false;
        }
    };

    const hasData = computed(() => !!report.value && report.value.allSessions.length > 0);


    onMounted(fetchGroups);

    return {
        report,
        loading,
        groups,
        loadingGroups,
        error,
        groupId,
        filterType,
        selectedMonth,
        dateFrom,
        dateTo,
        fetch,
        exportXlsx,
        hasData,
        fetchGroups
    };
}