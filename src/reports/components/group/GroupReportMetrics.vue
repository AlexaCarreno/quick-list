<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div v-for="metric in metrics_list" :key="metric.label"
            class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center gap-1">
            <span class="text-2xl font-bold text-white">{{ metric.value }}</span>
            <span class="text-xs text-slate-400 text-center uppercase tracking-wide">{{ metric.label }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GroupInfo, GroupMetrics } from '../../interface/reports.interface';

const props = defineProps<{ group: GroupInfo; metrics: GroupMetrics }>();

const metrics_list = computed(() => [
    { label: 'Total de estudiantes', value: props.metrics.totalStudents },
    { label: 'Promedio grupal', value: `${props.metrics.groupAverage}%` },
    { label: 'Sesiones registradas', value: props.metrics.totalSessions },
    { label: `Asistencia < ${props.group.minAttendanceThreshold}%`, value: props.metrics.studentsAtRisk },
]);
</script>