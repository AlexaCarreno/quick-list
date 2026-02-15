<template>
    <DataList :items="teachers" :columns="columns" grid-template="3fr 1fr 2fr 1fr 1fr 1fr auto" id-key="_id"
        @row-click="onRowClick">
        <!-- MOBILE CARD -->
        <template #mobile="{ item }">
            <div class="flex gap-x-4 justify-between cursor-pointer" @click.stop="openDetail(item)">

                <!-- Información -->
                <div class="flex gap-x-4 flex-1 min-w-0">
                    <img class="size-12 rounded-full bg-gray-800 object-cover" :src="config.apiBaseUrl + item.photo" />

                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white">
                            {{ item.name }} {{ item.lastName }}
                        </p>

                        <p class="text-xs text-gray-400 truncate">
                            {{ item.email }}
                        </p>

                        <p class="mt-1 text-xs text-gray-400">
                            Doc: {{ item.documentNumber }}
                        </p>

                        <p class="text-xs text-gray-400 truncate">
                            {{ item.professionalTitle }}
                        </p>

                        <div class="mt-2 flex items-center gap-x-2">
                            <span class="size-2 rounded-full"
                                :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"></span>
                            <span class="text-xs text-gray-400">
                                {{ item.state ? "Activo" : "Inactivo" }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- ACCIONES MOBILE -->
                <div class="flex-shrink-0" @click.stop>
                    <RowActions :open="activeActionsId === item._id" @toggle="toggleActions(item._id)"
                        @close="closeActions" :actions="[
                            { label: 'Editar', onClick: () => editTeacher(item) },
                            { label: 'Eliminar', onClick: () => deleteTeacher(item) }
                        ]" />
                </div>
            </div>
        </template>


        <!-- Usuario -->
        <template #user="{ item }">
            <div class="flex items-center gap-x-4 min-w-0">
                <img class="size-10 rounded-full bg-gray-800 object-cover" :src="config.apiBaseUrl + item.photo" />
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-white truncate">
                        {{ item.name }} {{ item.lastName }}
                    </p>
                    <p class="text-xs text-gray-400 truncate">
                        {{ item.email }}
                    </p>
                </div>
            </div>
        </template>

        <!-- Edad -->
        <template #age="{ item }">
            <p class="text-sm text-gray-300">
                {{ calculateAge(item.birthday) }} años
            </p>
        </template>

        <!-- Estado -->
        <template #state="{ item }">
            <div class="flex items-center gap-x-2">
                <span class="size-2 rounded-full" :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"></span>
                <span class="text-sm text-gray-300">
                    {{ item.state ? "Activo" : "Inactivo" }}
                </span>
            </div>
        </template>

        <!-- Fecha -->
        <template #createdAt="{ item }">
            <p class="text-sm text-gray-400">
                {{ formatDate(item.createdAt) }}
            </p>
        </template>

        <template #actions="{ item }">
            <div @click.stop>
                <RowActions :open="activeActionsId === item._id" @toggle="toggleActions(item._id)" @close="closeActions"
                    :actions="[
                        { label: 'Editar', onClick: () => editTeacher(item) },
                        { label: 'Eliminar', onClick: () => deleteTeacher(item) }
                    ]" />
            </div>
        </template>

    </DataList>

    <!-- Drawer -->
    <BaseDrawer :open="drawerOpen" @close="closeDrawer">
        <TeacherDetailContent :teacher="selectedTeacher" @close="closeDrawer" />
    </BaseDrawer>
</template>

<script setup lang="ts">



import { ref } from "vue";
import { config } from "../../../config";
import type { Teacher } from "../../view/UiComponents.vue";
import DataList from "./DataList.vue";
import RowActions from "./RowActions.vue";
import BaseDrawer from "./BaseDrawer.vue";
import TeacherDetailContent from "./TeacherDetailContent.vue";

defineProps<{
    teachers: Teacher[]
}>()

const emit = defineEmits<{
    (e: 'view', teacher: Teacher): void
}>()


const selectedTeacher = ref<Teacher | null>(null)
const drawerOpen = ref(false)

const columns = [
    { label: "Usuario", key: "user" },
    { label: "Documento", key: "documentNumber" },
    { label: "Título", key: "professionalTitle" },
    { label: "Edad", key: "age" },
    { label: "Estado", key: "state" },
    { label: "Creado", key: "createdAt" },
    { label: "", key: "actions" }
]

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

const calculateAge = (birthday: string): number => {
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

const openDetail = (teacher: Teacher) => {
    closeActions()
    selectedTeacher.value = teacher
    drawerOpen.value = true
}

const closeDrawer = () => {
    drawerOpen.value = false
    selectedTeacher.value = null
}


const editTeacher = (teacher: Teacher) => {
    console.log("Editar", teacher)
}

const deleteTeacher = (teacher: Teacher) => {
    console.log("Eliminar", teacher)
}

const onRowClick = (teacher: Teacher) => {
    openDetail(teacher)
}

// controlar acciones de fila abierta
const activeActionsId = ref<string | null>(null)

const toggleActions = (id: string) => {
    activeActionsId.value =
        activeActionsId.value === id ? null : id
}

const closeActions = () => {
    activeActionsId.value = null
}
</script>
