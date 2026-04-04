<template>
    <div class="mt-4">

        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
            <p class="text-slate-300 text-sm font-semibold">Asistencia por materia</p>
            <p class="text-slate-400 text-xs">{{ subjects.length }} materias matriculadas</p>
        </div>

        <!-- ── DESKTOP: tabla ──────────────────────────────────────── -->
        <div class="hidden md:block overflow-x-auto rounded-xl border border-slate-700/50">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wide">
                        <th class="text-left px-4 py-3 font-medium">Materia</th>
                        <th class="text-left px-4 py-3 font-medium">Progreso de asistencia</th>
                        <th class="text-center px-4 py-3 font-medium">Asistencia</th>
                        <th class="text-center px-4 py-3 font-medium">Faltas</th>
                        <th class="text-center px-4 py-3 font-medium">Sesiones</th>
                        <th class="text-center px-4 py-3 font-medium">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    <tr v-for="subject in subjects" :key="subject.groupId"
                        class="bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                        <!-- Materia -->
                        <td class="px-4 py-3">
                            <p class="text-white font-semibold text-sm">{{ subject.subject }}</p>
                            <p class="text-slate-400 text-xs">{{ subject.referenceCode }}</p>
                        </td>

                        <!-- Barra de progreso -->
                        <td class="px-4 py-3 min-w-[180px]">
                            <div class="flex items-center gap-3">
                                <div class="flex-1 bg-slate-700 rounded-full h-2">
                                    <div :class="['h-2 rounded-full transition-all duration-500', barColor(subject.percentage)]"
                                        :style="{ width: `${subject.percentage}%` }" />
                                </div>
                                <span class="text-xs text-slate-300 font-semibold w-9 text-right shrink-0">
                                    {{ subject.percentage }}%
                                </span>
                            </div>
                        </td>

                        <!-- Asistencia -->
                        <td class="px-4 py-3 text-center">
                            <span class="text-white font-semibold">{{ subject.present }}</span>
                        </td>

                        <!-- Faltas -->
                        <td class="px-4 py-3 text-center">
                            <span class="text-white font-semibold">{{ subject.absent }}</span>
                        </td>

                        <!-- Sesiones -->
                        <td class="px-4 py-3 text-center">
                            <span class="text-white font-semibold">{{ subject.totalSessions }}</span>
                        </td>

                        <!-- Estado -->
                        <td class="px-4 py-3 text-center">
                            <span
                                :class="['px-2.5 py-1 rounded-md text-xs font-bold tracking-wide', statusClasses[subject.status]]">
                                {{ statusLabel[subject.status] }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ── MOBILE: tarjetas ────────────────────────────────────── -->
        <div class="flex flex-col gap-3 md:hidden">
            <div v-for="subject in subjects" :key="subject.groupId"
                class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
                <!-- Header: nombre + estado -->
                <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                        <p class="text-white font-semibold text-sm truncate">{{ subject.subject }}</p>
                        <p class="text-slate-400 text-xs">{{ subject.referenceCode }}</p>
                        <p class="text-slate-500 text-xs mt-0.5">{{ subject.totalSessions }} Sesiones</p>
                    </div>
                    <span
                        :class="['px-2 py-0.5 rounded-md text-xs font-bold shrink-0 tracking-wide', statusClasses[subject.status]]">
                        {{ statusLabel[subject.status] }}
                    </span>
                </div>

                <!-- Barra de progreso -->
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-slate-700 rounded-full h-2">
                        <div :class="['h-2 rounded-full transition-all duration-500', barColor(subject.percentage)]"
                            :style="{ width: `${subject.percentage}%` }" />
                    </div>
                    <span class="text-xs text-slate-300 font-semibold w-9 text-right shrink-0">
                        {{ subject.percentage }}%
                    </span>
                </div>

                <!-- Stats: asistencias / faltas -->
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>
                        <span class="text-white font-semibold">{{ subject.present }}</span>
                        /{{ subject.totalSessions }} asistencias
                    </span>
                    <span>
                        <span class="text-red-400 font-semibold">{{ subject.absent }}</span>
                        faltas
                    </span>
                </div>
            </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="subjects.length === 0" class="text-center text-slate-500 text-sm py-10">
            No hay materias registradas para este periodo.
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SubjectAttendanceRow } from '../../interface/reports.interface';

defineProps<{ subjects: SubjectAttendanceRow[] }>();

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

const barColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 48) return 'bg-yellow-500';
    return 'bg-red-500';
};
</script>