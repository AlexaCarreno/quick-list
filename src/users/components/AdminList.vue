<template>
  <EntityListLayout
    :items="admins"
    :total="total"
    :columns="columns"
    grid-template="3fr 1fr 1fr 1fr"
    :filters="filters"
    default-filter="name"
    :class="$attrs.class"
    @query-change="$emit('query-change', $event)"
  >
    <!-- Botón crear admin -->
    <template #header-actions>
      <button
        class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full sm:w-auto"
        @click="openCreateAdmin"
      >
        New
      </button>
    </template>

    <!-- MOBILE -->
    <template #mobile="{ item }">
      <div class="flex gap-x-4 justify-between items-center">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white">
            {{ item.name }} {{ item.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
          <div class="mt-2 flex items-center gap-x-2">
            <span
              class="size-2 rounded-full"
              :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"
            />
            <span class="text-xs text-slate-400">
              {{ item.state ? "Activo" : "Inactivo" }}
            </span>
          </div>
        </div>
        <div class="flex-shrink-0" @click.stop>
          <RowActions
            :open="activeActionsId === item._id"
            @toggle="toggleActions(item._id)"
            @close="closeActions"
            :actions="rowActions(item)"
          />
        </div>
      </div>
    </template>

    <!-- COLUMNA: user -->
    <template #user="{ item }">
      <div class="flex items-center gap-x-4 min-w-0">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-white truncate">
            {{ item.name }} {{ item.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
        </div>
      </div>
    </template>

    <!-- COLUMNA: state -->
    <template #state="{ item }">
      <div class="flex items-center gap-x-2">
        <span
          class="size-2 rounded-full"
          :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"
        />
        <span class="text-sm text-slate-300">
          {{ item.state ? "Activo" : "Inactivo" }}
        </span>
      </div>
    </template>

    <!-- COLUMNA: createdAt -->
    <template #createdAt="{ item }">
      <p class="text-sm text-slate-400">
        {{ new Date(item.createdAt).toLocaleDateString() }}
      </p>
    </template>

    <!-- COLUMNA: actions -->
    <template #actions="{ item }">
      <div @click.stop>
        <RowActions
          :open="activeActionsId === item._id"
          @toggle="toggleActions(item._id)"
          @close="closeActions"
          :actions="rowActions(item)"
        />
      </div>
    </template>

    <!-- Sin drawer para admins por ahora, o puedes agregar uno -->
  </EntityListLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RowActions from "../../common/components/ui/RowActions.vue";
import EntityListLayout from "../../common/tables/EntityListLayout.vue";




export interface Admin {
  _id: string;
  userId: string;
  name: string;
  lastName: string;
  email: string;
  state: boolean;
  createdAt: string;
}

defineProps<{
  admins: Admin[];
  total: number;
}>();

defineEmits<{
  (e: "query-change", query: Record<string, any>): void;
}>();

const filters = [
  { label: "Nombre", value: "name" },
  { label: "Correo", value: "email" },
];

const columns = [
  { label: "Usuario", key: "user" },
  { label: "Estado", key: "state" },
  { label: "Creado", key: "createdAt" },
  { label: "Actions", key: "actions" },
];

const activeActionsId = ref<string | null>(null);
const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};
const closeActions = () => {
  activeActionsId.value = null;
};
const rowActions = (admin: Admin) => [
  { label: "Editar", onClick: () => console.log("Editar", admin) },
  { label: "Eliminar", onClick: () => console.log("Eliminar", admin) },
];
const openCreateAdmin = () => console.log("Crear admin");
</script>
