<template>
    <div class="flex flex-col h-full min-h-0 text-white p-4 md:p-6">

        <div class="flex-1 min-h-0 overflow-y-auto">
            <ReportTabs :activeTab="activeTab" @change="activeTab = $event" />

            <!-- ── Tab Grupo ───────────────────────────────────────────── -->
            <template v-if="activeTab === 'group'">
                <GroupReportFilters v-model:groupId="group.groupId.value" v-model:filterType="group.filterType.value"
                    v-model:selectedMonth="group.selectedMonth.value" v-model:dateFrom="group.dateFrom.value"
                    v-model:dateTo="group.dateTo.value" :loading="group.loading.value"
                    :loadingGroups="group.loadingGroups.value" :groups="group.groups.value" @generate="group.fetch"
                    @export="group.exportXlsx" />

                <div v-if="group.error.value" class="mt-4 text-red-400 text-sm">
                    {{ group.error.value }}
                </div>

                <div v-if="group.loading.value" class="mt-8 flex justify-center">
                    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>

                <template v-if="!group.loading.value && group.report.value">
                    <GroupReportMetrics :group="group.report.value.group" :metrics="group.report.value.metrics" />
                    <div v-if="group.hasData.value">
                        <GroupReportTable :sessionsByMonth="group.report.value.sessionsByMonth"
                            :allSessions="group.report.value.allSessions" :students="group.report.value.students"
                            :sessionAverages="group.report.value.sessionAverages"
                            :cumulativeAverage="group.report.value.cumulativeAverage" />
                        <GroupReportLegend />
                    </div>
                    <div v-else class="mt-8 text-center text-gray-500 text-sm">
                        No hay sesiones registradas para el filtro seleccionado.
                    </div>
                </template>
            </template>

            <!-- ── Tab Estudiante ─────────────────────────────────────── -->
            <template v-if="activeTab === 'student'">
                <StudentReportFilters :searchQuery="student.searchQuery.value" :searchField="student.searchField.value"
                    :searchResults="student.searchResults.value" :selectedStudent="student.selectedStudent.value"
                    :selectedPeriod="student.selectedPeriod.value" :periods="student.periods.value"
                    :loading="student.loading.value" :loadingSearch="student.loadingSearch.value"
                    :loadingPeriods="student.loadingPeriods.value" @search="student.searchStudents"
                    @selectStudent="student.selectStudent" @update:searchField="student.searchField.value = $event"
                    @update:selectedPeriod="student.selectedPeriod.value = $event" @generate="student.fetch"
                    @export="student.exportXlsx" />

                <div v-if="student.error.value" class="mt-4 text-red-400 text-sm">
                    {{ student.error.value }}
                </div>

                <div v-if="student.loading.value" class="mt-8 flex justify-center">
                    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>

                <template v-if="!student.loading.value && student.report.value">
                    <StudentReportProfile class="mt-4" :profile="student.report.value.profile"
                        :totalGroups="student.report.value.totalGroups" />
                    <StudentReportTable :subjects="student.report.value.subjects" />
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ReportTabs from '../components/ReportTabs.vue';
import GroupReportFilters from '../components/group/GroupReportFilters.vue';
import GroupReportMetrics from '../components/group/GroupReportMetrics.vue';
import GroupReportTable from '../components/group/GroupReportTable.vue';
import GroupReportLegend from '../components/group/GroupReportLegend.vue';
import StudentReportFilters from '../components/student/StudentReportFilters.vue';
import StudentReportProfile from '../components/student/StudentReportProfile.vue';
import StudentReportTable from '../components/student/StudentReportTable.vue';
import { useGroupReport } from '../composable/useGroupReport';
import { useStudentReport } from '../composable/useStudentReport';

const activeTab = ref<'group' | 'student'>('group');
const group = useGroupReport();
const student = useStudentReport();
</script>