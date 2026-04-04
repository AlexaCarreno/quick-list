<template>
    <div class="flex flex-col gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">

        <!-- Fila 1: selector de grupo + filtro -->
        <div class="flex flex-wrap items-end gap-3">

            <!-- Selector de grupo -->
            <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
                <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Materia
                </label>
                <div class="relative">
                    <select :value="groupId"
                        @change="emit('update:groupId', ($event.target as HTMLSelectElement).value)"
                        :disabled="loadingGroups"
                        class="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 transition appearance-none disabled:opacity-50">
                        <option value="" disabled>Seleccionar materia...</option>
                        <option v-for="g in groups" :key="g._id" :value="g._id">
                            {{ g.subject }} / {{ g.referenceCode }}
                        </option>
                    </select>
                    <div class="absolute right-2.5 top-2.5 pointer-events-none">
                        <div v-if="loadingGroups"
                            class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Selector de tipo de filtro -->
            <div class="flex flex-col gap-1">
                <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Filtro
                </label>
                <select :value="filterType"
                    @change="emit('update:filterType', ($event.target as HTMLSelectElement).value as any)"
                    class="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition">
                    <option value="all">Todo el periodo</option>
                    <option value="month">Por mes</option>
                    <option value="range">Rango de fechas</option>
                </select>
            </div>

            <!-- Mes -->
            <div v-if="filterType === 'month'" class="flex flex-col gap-1">
                <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Mes
                </label>
                <input :value="selectedMonth"
                    @input="emit('update:selectedMonth', ($event.target as HTMLInputElement).value)" type="month"
                    class="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition" />
            </div>

            <!-- Rango -->
            <template v-if="filterType === 'range'">
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                        Desde
                    </label>
                    <input :value="dateFrom" @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
                        type="date"
                        class="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                        Hasta
                    </label>
                    <input :value="dateTo" @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
                        type="date"
                        class="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition" />
                </div>
            </template>

            <!-- Acciones -->
            <div class="flex gap-2 ml-auto">
                <button @click="emit('generate')" :disabled="loading || !groupId"
                    class="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors">
                    <span v-if="loading" class="flex items-center gap-2">
                        <span class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cargando...
                    </span>
                    <span v-else>Generar</span>
                </button>

                <button @click="emit('export')" :disabled="!groupId"
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg border border-slate-600 transition-colors">
                    Exportar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GroupOption } from '../../interface/reports.interface';

defineProps<{
    groupId: string;
    filterType: 'all' | 'month' | 'range';
    selectedMonth: string;
    dateFrom: string;
    dateTo: string;
    loading: boolean;
    loadingGroups: boolean;
    groups: GroupOption[];
}>();

const emit = defineEmits<{
    (e: 'update:groupId', v: string): void;
    (e: 'update:filterType', v: 'all' | 'month' | 'range'): void;
    (e: 'update:selectedMonth', v: string): void;
    (e: 'update:dateFrom', v: string): void;
    (e: 'update:dateTo', v: string): void;
    (e: 'generate'): void;
    (e: 'export'): void;
}>();
</script>