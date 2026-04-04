<template>
    <div class="flex flex-col gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">

        <!-- Selector de campo + input de búsqueda -->
        <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Buscar estudiante
            </label>

            <div class="flex gap-2">
                <!-- Selector de campo -->
                <select
                    :value="searchField"
                    @change="emit('update:searchField', ($event.target as HTMLSelectElement).value as SearchField)"
                    class="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 shrink-0"
                >
                    <option
                        v-for="opt in fieldOptions"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </option>
                </select>

                <!-- Input búsqueda -->
                <div class="relative flex-1">
                    <input
                        :value="searchQuery"
                        @input="emit('search', ($event.target as HTMLInputElement).value)"
                        type="text"
                        :placeholder="currentPlaceholder(searchField)"
                        class="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 transition"
                    />
                    <div v-if="loadingSearch" class="absolute right-2.5 top-2.5">
                        <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>

            <!-- Dropdown resultados -->
            <div
                v-if="searchResults.length"
                class="relative z-50"
            >
                <div class="absolute top-1 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                    <button
                        v-for="s in searchResults"
                        :key="s._id"
                        @click="emit('selectStudent', s)"
                        class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/60 transition-colors text-left"
                    >
                        <div class="w-9 h-9 rounded-full bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-600">
                            <img
                                v-if="photoUrl(s.photo)"
                                :src="photoUrl(s.photo)!"
                                :alt="`${s.name} ${s.lastName}`"
                                class="w-full h-full object-cover"
                            />
                            <span v-else class="text-sm font-bold text-slate-300">
                                {{ s.name[0] }}{{ s.lastName[0] }}
                            </span>
                        </div>
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm text-white font-semibold truncate">
                                {{ s.name }} {{ s.lastName }}
                            </span>
                            <span class="text-xs text-slate-400 truncate">
                                {{ s.documentNumber }} · {{ s.email }}
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Chip estudiante seleccionado -->
        <div
            v-if="selectedStudent"
            class="flex items-center gap-3 px-3 py-2 bg-slate-900 rounded-lg border border-slate-700"
        >
            <div class="w-7 h-7 rounded-full bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-600">
                <img
                    v-if="photoUrl(selectedStudent.photo)"
                    :src="photoUrl(selectedStudent.photo)!"
                    class="w-full h-full object-cover"
                />
                <span v-else class="text-xs font-bold text-slate-300">
                    {{ selectedStudent.name[0] }}{{ selectedStudent.lastName[0] }}
                </span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
                <span class="text-sm text-white font-semibold truncate">
                    {{ selectedStudent.name }} {{ selectedStudent.lastName }}
                </span>
                <span class="text-xs text-slate-400">{{ selectedStudent.documentNumber }}</span>
            </div>
            <span class="text-xs text-slate-500">Seleccionado</span>
        </div>

        <!-- Periodo + acciones -->
        <div class="flex flex-wrap items-end gap-2">
            <div class="flex flex-col gap-1">
                <label class="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Periodo
                </label>

                <div v-if="loadingPeriods" class="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <div class="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Cargando periodos...
                </div>

                <select
                    v-else-if="periods.length"
                    :value="selectedPeriod"
                    @change="emit('update:selectedPeriod', ($event.target as HTMLSelectElement).value)"
                    class="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition"
                >
                    <option v-for="p in periods" :key="p" :value="p">{{ p }}</option>
                </select>

                <span v-else-if="selectedStudent && !loadingPeriods" class="text-xs text-slate-500 py-2">
                    Sin periodos disponibles
                </span>
            </div>

            <button
                @click="emit('generate')"
                :disabled="loading || !selectedStudent || !selectedPeriod"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
                <span v-if="loading" class="flex items-center gap-2">
                    <span class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cargando...
                </span>
                <span v-else>Generar</span>
            </button>

            <button
                @click="emit('export')"
                :disabled="!selectedStudent || !selectedPeriod"
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg border border-slate-600 transition-colors"
            >
                Exportar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { config } from '../../../config';
import type { StudentSearchResult } from '../../interface/reports.interface';
import type { SearchField } from '../../composable/useStudentReport';

defineProps<{
    searchQuery: string;
    searchField: SearchField;
    searchResults: StudentSearchResult[];
    selectedStudent: StudentSearchResult | null;
    selectedPeriod: string;
    periods: string[];
    loading: boolean;
    loadingSearch: boolean;
    loadingPeriods: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:searchField', v: SearchField): void;
    (e: 'update:selectedPeriod', v: string): void;
    (e: 'search', v: string): void;
    (e: 'selectStudent', v: StudentSearchResult): void;
    (e: 'generate'): void;
    (e: 'export'): void;
}>();

const fieldOptions: { value: SearchField; label: string; placeholder: string }[] = [
    { value: 'name',           label: 'Nombre',   placeholder: 'Ej: Andrés Pereira...' },
    { value: 'documentNumber', label: 'Documento', placeholder: 'Ej: 1007438904...'    },
    { value: 'email',          label: 'Correo',   placeholder: 'Ej: user@email.com...' },
];

const currentPlaceholder = (field: SearchField) =>
    fieldOptions.find(f => f.value === field)?.placeholder ?? 'Buscar...';

const photoUrl = (photo?: string) =>
    photo ? `${config.apiBaseUrl}${photo}` : null;
</script>