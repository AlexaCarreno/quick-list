import { computed, ref } from "vue";
import type { PeriodsResponse, StudentReportResponse, StudentSearchResult } from "../interface/reports.interface";
import { reportsApi } from "../api/reports.api";


export type SearchField = 'name' | 'email' | 'documentNumber';

export function useStudentReport() {
    const report = ref<StudentReportResponse | null>(null);
    const periods = ref<string[]>([]);
    const searchResults = ref<StudentSearchResult[]>([]);
    const selectedStudent = ref<StudentSearchResult | null>(null);

    const loading = ref(false);
    const loadingPeriods = ref(false);
    const loadingSearch = ref(false);
    const error = ref<string | null>(null);

    const searchQuery = ref('');
    const searchField = ref<SearchField>('name');
    const selectedPeriod = ref('');

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const searchStudents = async (query: string) => {
        searchQuery.value = query;
        searchResults.value = [];
        selectedStudent.value = null;
        report.value = null;
        periods.value = [];

        if (!query.trim()) return;

        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            loadingSearch.value = true;
            error.value = null;
            try {
                searchResults.value = await reportsApi.searchStudents(
                    query,
                    searchField.value,
                );
            } catch {
                error.value = 'Error al buscar estudiantes.';
            } finally {
                loadingSearch.value = false;
            }
        }, 350);
    };

    const selectStudent = async (student: StudentSearchResult) => {
        selectedStudent.value = student;
        searchResults.value = [];
        searchQuery.value = `${student.name} ${student.lastName}`;
        report.value = null;

        loadingPeriods.value = true;
        error.value = null;
        try {
            const res: PeriodsResponse = await reportsApi.getStudentPeriods(student._id);
            periods.value = res.periods;
            if (res.periods.length > 0) selectedPeriod.value = res.periods[0];
        } catch {
            error.value = 'Error al cargar los periodos.';
        } finally {
            loadingPeriods.value = false;
        }
    };

    const fetch = async () => {
        if (!selectedStudent.value || !selectedPeriod.value) return;
        loading.value = true;
        error.value = null;
        try {
            report.value = await reportsApi.getStudentReport(
                selectedStudent.value._id,
                selectedPeriod.value,
            );
        } catch {
            error.value = 'Error al cargar el reporte.';
        } finally {
            loading.value = false;
        }
    };

    const exportXlsx = () => {
        if (!selectedStudent.value || !selectedPeriod.value) return;
        reportsApi.exportStudentReport(selectedStudent.value._id, selectedPeriod.value);
    };

    const hasData = computed(
        () => !!report.value && report.value.subjects.length > 0,
    );

    return {
        report,
        periods,
        searchResults,
        selectedStudent,
        loading,
        loadingPeriods,
        loadingSearch,
        error,
        searchQuery,
        searchField,
        selectedPeriod,
        searchStudents,
        selectStudent,
        fetch,
        exportXlsx,
        hasData,
    };
}