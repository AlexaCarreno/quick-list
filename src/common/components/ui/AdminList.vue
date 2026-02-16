<template>
    <DataList :items="admins" :columns="columns" grid-template="3fr 1fr 2fr 1fr 1fr 1fr 1fr" id-key="_id">
        <template #user="{ item }">
            <div class="flex items-center gap-x-4 min-w-0">
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-white truncate">
                        {{ item.name }} {{ item.lastName }}
                    </p>
                    <p class="text-xs text-slate-400 truncate">
                        {{ item.email }}
                    </p>
                </div>
            </div>
        </template>

        <template #state="{ item }">
            <div class="flex items-center gap-x-2">
                <span class="size-2 rounded-full" :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"></span>
                <span class="text-sm text-slate-300">
                    {{ item.state ? "Activo" : "Inactivo" }}
                </span>
            </div>
        </template>

        <template #createdAt="{ item }">
            <p class="text-sm text-slate-400">
                {{ new Date(item.createdAt).toLocaleDateString() }}
            </p>
        </template>
    </DataList>
</template>

<script setup lang="ts">
import DataList from './DataList.vue';

defineProps<{
    admins: Admin[];
}>();


export interface Admin {
    _id: string;
    userId: string;
    name: string;
    lastName: string;
    email: string;
    state: boolean;
    createdAt: string;
}


const columns = [
    { label: "Usuario", key: "user" },
    { label: "Documento", key: "documentNumber" },
    { label: "Título", key: "professionalTitle" },
    { label: "Edad", key: "age" },
    { label: "Estado", key: "state" },
    { label: "Creado", key: "createdAt" },
    { label: "Actions", key: "actions" }
]


// const onRowClick = (teacher: Teacher) => {
//     openDetail(teacher)
// }
</script>
