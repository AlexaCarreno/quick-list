<template>
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            <!-- Foto -->
            <div
                class="w-14 h-14 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center shrink-0 border-2 border-slate-600">
                <img v-if="photoUrl(profile.photo)" :src="photoUrl(profile.photo)!"
                    :alt="`${profile.name} ${profile.lastName}`" class="w-full h-full object-cover" />
                <span v-else class="text-xl text-slate-300 font-bold">
                    {{ profile.name[0] }}{{ profile.lastName[0] }}
                </span>
            </div>

            <!-- Datos — mobile: stack, desktop: row con divisores -->
            <div
                class="flex flex-col sm:flex-row sm:items-center sm:divide-x sm:divide-slate-700 gap-3 sm:gap-0 flex-1 min-w-0">

                <!-- Bloque 1: nombre + email + documento -->
                <div class="sm:pr-5 flex flex-col gap-0.5 min-w-0">
                    <p class="text-white font-semibold text-sm truncate">
                        {{ profile.name }} {{ profile.lastName }}
                    </p>
                    <p class="text-blue-400 text-xs truncate">{{ profile.email }}</p>
                    <p class="text-slate-400 text-xs">{{ profile.documentNumber }}</p>
                </div>

                <!-- Bloque 2: teléfono + edad -->
                <div class="sm:px-5 flex flex-col gap-0.5">
                    <p class="text-slate-300 text-xs">
                        <span class="text-slate-500">Teléfono: </span>
                        {{ profile.phone ?? '—' }}
                    </p>
                    <p class="text-slate-300 text-xs">
                        <span class="text-slate-500">Edad: </span>
                        {{ profile.age }}
                    </p>
                </div>

                <!-- Bloque 3: programa + periodo -->
                <div class="sm:pl-5 flex flex-col gap-0.5">
                    <p class="text-slate-300 text-xs">
                        <span class="text-slate-500">Programa académico: </span>
                        {{ profile.career }}
                    </p>
                    <p class="text-slate-300 text-xs">
                        <span class="text-slate-500">Periodo: </span>
                        <span class="text-white font-semibold">{{ profile.period }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { config } from '../../../config';
import type { StudentProfile } from '../../interface/reports.interface';

defineProps<{ profile: StudentProfile; totalGroups: number }>();

const photoUrl = (photo: string | null) =>
    photo ? `${config.apiBaseUrl}${photo}` : null;
</script>