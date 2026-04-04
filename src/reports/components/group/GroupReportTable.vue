<template>
    <div class="mt-4">

        <!-- ── DESKTOP: tabla ──────────────────────────────────────── -->
        <div class="hidden md:block overflow-x-auto rounded-xl border border-slate-700/50">
            <table class="text-xs text-white border-collapse min-w-full">
                <thead>
                    <tr>
                        <th class="bg-slate-800 px-3 py-2.5 text-left min-w-[180px] border border-slate-700/50 text-slate-300 font-medium uppercase tracking-wide"
                            rowspan="2">
                            Estudiante
                        </th>
                        <th class="bg-slate-800 px-3 py-2.5 text-center border border-slate-700/50 text-slate-300 font-medium uppercase tracking-wide"
                            rowspan="2">
                            Documento
                        </th>

                        <th v-for="month in sessionsByMonth" :key="month.month" :colspan="month.sessions.length"
                            class="bg-slate-700/80 px-2 py-2 text-center border border-slate-700/50 text-blue-300 font-semibold whitespace-nowrap">
                            {{ month.month }}
                        </th>

                        <th colspan="4"
                            class="bg-slate-800 px-2 py-2 text-center border border-slate-700/50 text-slate-300 font-medium uppercase tracking-wide">
                            Resumen
                        </th>
                    </tr>

                    <tr>
                        <th v-for="session in allSessions" :key="session.sessionId"
                            class="bg-slate-800/80 px-1 py-1.5 text-center border border-slate-700/50 text-slate-400 whitespace-nowrap font-normal">
                            {{ session.dayLabel }}
                        </th>
                        <th
                            class="bg-slate-800/80 px-2 py-1.5 text-center border border-slate-700/50 text-slate-400 font-normal">
                            P</th>
                        <th
                            class="bg-slate-800/80 px-2 py-1.5 text-center border border-slate-700/50 text-slate-400 font-normal">
                            A</th>
                        <th
                            class="bg-slate-800/80 px-2 py-1.5 text-center border border-slate-700/50 text-slate-400 font-normal">
                            %</th>
                        <th
                            class="bg-slate-800/80 px-2 py-1.5 text-center border border-slate-700/50 text-slate-400 font-normal">
                            Estado</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-700/30">
                    <tr v-for="(student, idx) in students" :key="student.studentId"
                        :class="idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/30'"
                        class="hover:bg-slate-700/30 transition-colors">
                        <td class="px-3 py-2 border border-slate-700/30 whitespace-nowrap">
                            <p class="text-white text-xs font-medium">{{ student.name }} {{ student.lastName }}</p>
                            <p class="text-slate-500 text-xs">{{ student.documentNumber }}</p>
                        </td>
                        <td class="px-3 py-2 border border-slate-700/30 text-center text-slate-400 text-xs">
                            {{ student.documentNumber }}
                        </td>

                        <td v-for="session in allSessions" :key="session.sessionId"
                            class="px-1 py-2 border border-slate-700/30 text-center font-bold"
                            :class="cellStyle(student.attendanceMap[session.sessionId])">
                            {{ cellLabel(student.attendanceMap[session.sessionId]) }}
                        </td>

                        <td class="px-2 py-2 border border-slate-700/30 text-center text-slate-200">
                            {{ student.summary.present }}
                        </td>
                        <td class="px-2 py-2 border border-slate-700/30 text-center text-slate-200">
                            {{ student.summary.absent }}
                        </td>
                        <td class="px-2 py-2 border border-slate-700/30 text-center font-semibold text-white">
                            {{ student.summary.percentage }}%
                        </td>
                        <td class="px-2 py-2 border border-slate-700/30 text-center">
                            <span
                                :class="['px-2 py-0.5 rounded-md text-xs font-semibold', statusClasses[student.summary.status]]">
                                {{ statusLabel[student.summary.status] }}
                            </span>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr class="bg-slate-800/80 font-semibold">
                        <td colspan="2"
                            class="px-3 py-2 border border-slate-700/50 text-center text-xs text-slate-300 uppercase tracking-wide">
                            Promedio por sesión
                        </td>
                        <td v-for="session in allSessions" :key="session.sessionId"
                            class="px-1 py-2 border border-slate-700/50 text-center text-xs text-slate-300">
                            {{ sessionAverages[session.sessionId] ?? 0 }}%
                        </td>
                        <td colspan="2" class="px-2 py-2 border border-slate-700/50 text-right text-xs text-slate-400">
                            Promedio acumulado
                        </td>
                        <td class="px-2 py-2 border border-slate-700/50 text-center font-bold text-blue-300">
                            {{ cumulativeAverage }}%
                        </td>
                        <td class="border border-slate-700/50" />
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- ── MOBILE: tarjetas por estudiante ────────────────────── -->
        <div class="flex flex-col gap-3 md:hidden">
            <div v-for="student in students" :key="student.studentId"
                class="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <!-- Header tarjeta -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                    <div>
                        <p class="text-white text-sm font-semibold">
                            {{ student.name }} {{ student.lastName }}
                        </p>
                        <p class="text-slate-400 text-xs">{{ student.documentNumber }}</p>
                    </div>
                    <span
                        :class="['px-2 py-0.5 rounded-md text-xs font-semibold shrink-0', statusClasses[student.summary.status]]">
                        {{ statusLabel[student.summary.status] }}
                    </span>
                </div>

                <!-- Contadores -->
                <div class="grid grid-cols-3 divide-x divide-slate-700/50 border-b border-slate-700/50">
                    <div class="flex flex-col items-center py-3 gap-0.5">
                        <span class="text-white font-bold text-lg">{{ student.summary.present }}</span>
                        <span class="text-slate-400 text-xs">Presente</span>
                    </div>
                    <div class="flex flex-col items-center py-3 gap-0.5">
                        <span class="text-white font-bold text-lg">{{ student.summary.absent }}</span>
                        <span class="text-slate-400 text-xs">Ausente</span>
                    </div>
                    <div class="flex flex-col items-center py-3 gap-0.5">
                        <span class="text-white font-bold text-lg">{{ student.summary.percentage }}%</span>
                        <span class="text-slate-400 text-xs">% Asistencia</span>
                    </div>
                </div>

                <!-- Sesiones por mes -->
                <div class="px-4 py-3 flex flex-col gap-3">
                    <div v-for="monthGroup in sessionsByMonth" :key="monthGroup.month">
                        <p class="text-slate-400 text-xs font-medium mb-2">{{ monthGroup.month }}</p>
                        <div class="flex flex-wrap gap-1.5">
                            <div v-for="session in monthGroup.sessions" :key="session.sessionId"
                                class="flex flex-col items-center gap-0.5">
                                <span class="text-slate-500 text-[10px]">{{ session.dayLabel }}</span>
                                <span
                                    :class="['w-7 h-7 rounded flex items-center justify-center font-bold text-xs', cellStyle(student.attendanceMap[session.sessionId])]">
                                    {{ cellLabel(student.attendanceMap[session.sessionId]) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SessionsByMonth, SessionSummary, StudentReportRow } from '../../interface/reports.interface';

defineProps<{
    sessionsByMonth: SessionsByMonth[];
    allSessions: SessionSummary[];
    students: StudentReportRow[];
    sessionAverages: Record<string, number>;
    cumulativeAverage: number;
}>();

const statusClasses: Record<string, string> = {
    approved: 'bg-green-900/60 text-green-300 border border-green-700/50',
    at_risk: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
    critical: 'bg-red-900/60 text-red-300 border border-red-700/50',
};

const statusLabel: Record<string, string> = {
    approved: 'Aprobado',
    at_risk: 'En riesgo',
    critical: 'Crítico',
};

const cellStyle = (v: string | null | undefined): string => {
    if (v === 'N/A') return 'bg-slate-700/60 text-slate-400 border border-slate-600/50';
    if (v === 'P') return 'bg-green-900/60 text-green-300 border border-green-700/50';
    if (v === 'R') return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50';
    if (v === 'J') return 'bg-blue-900/60 text-blue-300 border border-blue-700/50';
    return 'bg-red-900/60 text-red-300 border border-red-700/50'; // A y null
};

const cellLabel = (v: string | null | undefined): string => {
    if (v === 'N/A') return '—';
    if (v === null || v === undefined) return 'A';
    return v;
};
</script>