<template>
  <EntityListLayout
    ref="layoutRef"
    :items="groups"
    :total="total"
    :loading="loading"
    :columns="columns"
    grid-template="2fr 2fr 2fr 1fr 1fr 1fr"
    :filters="filters"
    :filter-map="groupFilterMap"
    default-filter="subject"
    :disable-drawer="true"
    :class="$attrs.class"
    @query-change="$emit('query-change', $event)"
    @row-click="
      (item) => router.push({ name: 'group-detail', params: { id: item._id } })
    "
  >
    <template #header-actions>
      <button
        class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full sm:w-auto"
        @click="openCreateGroup"
      >
        + Crear grupo
      </button>
    </template>

    <!-- MOBILE -->
    <template #mobile="{ item }">
      <MobileCard
        @click="router.push({ name: 'group-detail', params: { id: item._id } })"
      >
        <template #avatar>
          <div
            class="size-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            :style="{ backgroundColor: item.color }"
          >
            {{ item.referenceCode.slice(0, 2) }}
          </div>
        </template>
        <template #title>
          <p class="text-sm font-semibold text-white truncate">
            {{ item.referenceCode }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.subject }}</p>
        </template>
        <template #info>
          <p class="text-xs text-slate-400 truncate">
            {{
              item.teacherId
                ? `${item.teacherId.name} ${item.teacherId.lastName}`
                : "—"
            }}
          </p>
        </template>
        <template #status>
          <div class="flex items-center gap-2">
            <span
              class="size-2 rounded-full"
              :class="
                item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
              "
            />
            <span class="text-xs text-slate-400">{{
              item.status === "active" ? "Activo" : "Inactivo"
            }}</span>
          </div>
        </template>
        <template #actions>
          <RowActions
            :open="activeActionsId === item._id"
            @toggle="toggleActions(item._id)"
            @close="closeActions"
            :actions="rowActions(item)"
          />
        </template>
      </MobileCard>
    </template>

    <!-- COLUMNA: grupo -->
    <template #grupo="{ item }">
      <div class="flex items-center gap-x-3 min-w-0">
        <!-- sin @click -->
        <div
          class="size-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
          :style="{ backgroundColor: item.color }"
        >
          {{ item.referenceCode.slice(0, 2) }}
        </div>
        <p class="text-sm font-semibold text-white truncate">
          {{ item.referenceCode }}
        </p>
      </div>
    </template>

    <!-- COLUMNA: materia -->
    <template #materia="{ item }">
      <p class="text-sm text-slate-300 truncate">{{ item.subject }}</p>
    </template>

    <!-- COLUMNA: docente -->
    <template #docente="{ item }">
      <p class="text-sm text-slate-300 truncate">
        {{
          item.teacherId
            ? `${item.teacherId.name} ${item.teacherId.lastName}`
            : "—"
        }}
      </p>
    </template>

    <!-- COLUMNA: estudiantes -->
    <template #estudiantes="{ item }">
      <p class="text-sm text-slate-300">{{ item.studentCount ?? 0 }}</p>
    </template>

    <!-- COLUMNA: estado -->
    <template #estado="{ item }">
      <div class="flex items-center gap-x-2">
        <span
          class="size-2 rounded-full"
          :class="item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"
        />
        <span class="text-sm text-slate-300">
          {{ item.status === "active" ? "Activo" : "Inactivo" }}
        </span>
      </div>
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

    <!-- Sin drawer — el detalle es una vista separada -->
    <template #drawer>
      <div />
    </template>
  </EntityListLayout>

  <MyModal v-model:open="createModalOpen" size="lg" :closable="true">
    <GroupForm
      :on-submit="addGroup"
      @success="onGroupCreated"
      @cancel="createModalOpen = false"
    />
  </MyModal>

  <ConfirmModal
    :open="confirmOpen"
    :title="
      groupToToggle?.status === 'active' ? 'Inactivar grupo' : 'Activar grupo'
    "
    :message="
      groupToToggle?.status === 'active'
        ? `¿Seguro que deseas inactivar ${groupToToggle?.referenceCode}? El grupo quedará cerrado.`
        : `¿Deseas activar ${groupToToggle?.referenceCode}?`
    "
    :confirm-label="
      groupToToggle?.status === 'active' ? 'Inactivar' : 'Activar'
    "
    :variant="groupToToggle?.status === 'active' ? 'danger' : 'success'"
    :loading="toggling"
    @confirm="handleToggleConfirm"
    @cancel="handleToggleCancel"
  />

  <ConfirmModal
    :open="deleteConfirmOpen"
    title="Eliminar grupo"
    :message="`¿Seguro que deseas eliminar ${groupToDelete?.referenceCode}? Esta acción no se puede deshacer.`"
    confirm-label="Eliminar"
    variant="danger"
    :loading="deleting"
    @confirm="handleDeleteConfirm"
    @cancel="deleteConfirmOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { GetGroupsQuery } from "../api/groupsApi";

import ConfirmModal from "../../common/components/modals/ConfirmModal.vue";
import MyModal from "../../common/components/modals/MyModal.vue";
import MobileCard from "../../common/components/ui/MobileCard.vue";
import RowActions from "../../common/components/ui/RowActions.vue";
import EntityListLayout from "../../common/tables/EntityListLayout.vue";
import { useGroups } from "../composables/useGroups";
import { groupFilterMap, type Group } from "../interfaces/groups.interfaces";
import GroupForm from "./GroupForm.vue";

const router = useRouter();
const layoutRef = ref<{ reset: () => void } | null>(null);

defineProps<{
  groups: Group[];
  total: number;
  loading?: boolean;
}>();

defineEmits<{
  (e: "query-change", query: GetGroupsQuery): void;
}>();

const { addGroup, toggleStatus, toggling, removeGroup, deleting } = useGroups();

const filters = [
  { label: "Materia", value: "subject" },
  { label: "Código", value: "referenceCode" },
  { label: "Periodo", value: "period" },
];

const columns = [
  { label: "Grupo", key: "grupo" },
  { label: "Materia", key: "materia" },
  { label: "Docente", key: "docente" },
  { label: "# Estudiantes", key: "estudiantes" },
  { label: "Estado", key: "estado" },
  { label: "Acciones", key: "actions" },
];

const activeActionsId = ref<string | null>(null);
const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};
const closeActions = () => {
  activeActionsId.value = null;
};

const rowActions = (group: Group) => [
  {
    label: "Ver grupo",
    onClick: () =>
      router.push({ name: "group-detail", params: { id: group._id } }),
  },
  {
    label: group.status === "active" ? "Inactivar" : "Activar",
    onClick: () => openToggleConfirm(group),
  },
  {
    label: "Eliminar",
    onClick: () => openDeleteConfirm(group),
  },
];

// Crear
const createModalOpen = ref(false);
const openCreateGroup = () => (createModalOpen.value = true);
const onGroupCreated = () => {
  createModalOpen.value = false;
  layoutRef.value?.reset();
};

// Toggle status
const confirmOpen = ref(false);
const groupToToggle = ref<Group | null>(null);
const openToggleConfirm = (group: Group) => {
  groupToToggle.value = group;
  confirmOpen.value = true;
};
const handleToggleConfirm = async () => {
  if (!groupToToggle.value) return;
  await toggleStatus(groupToToggle.value._id);
  confirmOpen.value = false;
  groupToToggle.value = null;
  layoutRef.value?.reset();
};
const handleToggleCancel = () => {
  confirmOpen.value = false;
  groupToToggle.value = null;
};

// Eliminar
const deleteConfirmOpen = ref(false);
const groupToDelete = ref<Group | null>(null);
const openDeleteConfirm = (group: Group) => {
  groupToDelete.value = group;
  deleteConfirmOpen.value = true;
};
const handleDeleteConfirm = async () => {
  if (!groupToDelete.value) return;
  await removeGroup(groupToDelete.value._id);
  deleteConfirmOpen.value = false;
  groupToDelete.value = null;
  layoutRef.value?.reset();
};
</script>
