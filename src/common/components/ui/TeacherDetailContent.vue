<template>
    <div class="p-6" v-if="teacher">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-white">
                Detalle del docente
            </h2>
            <button class="text-gray-400 hover:text-white" @click="$emit('close')">
                ✕
            </button>
        </div>

        <!-- Foto -->
        <img class="w-24 h-24 rounded-full object-cover mx-auto mb-4" :src="config.apiBaseUrl + teacher.photo" />

        <!-- Principal -->
        <div class="text-center mb-6">
            <p class="text-white font-semibold">
                {{ teacher.name }} {{ teacher.lastName }}
            </p>
            <p class="text-gray-400 text-sm">
                {{ teacher.email }}
            </p>
        </div>

        <!-- Información -->
        <div class="space-y-4 text-sm">
            <Info label="Documento" :value="teacher.documentNumber" />
            <Info label="Dirección" :value="teacher.residentialAddress" />
            <Info label="Título" :value="teacher.professionalTitle" />
            <Info label="Tarjeta profesional" :value="teacher.professionalLicenseNumber" />
            <Info label="Edad" :value="calculateAge(teacher.birthday) + ' años'" />
            <Info label="Estado" :value="teacher.state ? 'Activo' : 'Inactivo'" />
            <Info label="Creado" :value="formatDate(teacher.createdAt)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { config } from "../../../config"
import type { Teacher } from "../../view/UiComponents.vue"

defineProps<{
    teacher: Teacher | null
}>()

defineEmits(["close"])

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

const calculateAge = (birthday: string) => {
    const today = new Date()
    const birthDate = new Date(birthday)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--
    }

    return age
}

const Info = {
    props: {
        label: String,
        value: String
    },
    template: `
        <div>
            <p class="text-gray-500 text-xs">{{ label }}</p>
            <p class="text-gray-200">{{ value || '-' }}</p>
        </div>
    `
}
</script>
