<template>
  <EntityListLayout
    ref="layoutRef"
    :items="teachers"
    :total="total"
    :loading="loading"
    :columns="columns"
    grid-template="3fr 1fr 2fr 1fr 1fr 1fr 1fr"
    :filters="filters"
    :filter-map="filterMap"
    default-filter="name"
    :class="$attrs.class"
    @query-change="$emit('query-change', $event)"
  >
    <!-- Botón de crear -->
    <template #header-actions>
      <button
        class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full sm:w-auto"
        @click="openCreateTeacher"
      >
        + Crear docente
      </button>
    </template>

    <!-- MOBILE CARD -->
    <template #mobile="{ item, openDetail }">
      <div
        class="flex gap-x-4 justify-between items-center cursor-pointer"
        @click.stop="openDetail(item)"
      >
        <div class="flex gap-x-4 flex-1 min-w-0">
          <img
            class="size-12 rounded-full bg-slate-800 object-cover"
            :src="teacherAvatar(item)"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">
              {{ item.name }} {{ item.lastName }}
            </p>
            <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
            <p class="mt-1 text-xs text-slate-400">
              Doc: {{ item.documentNumber }}
            </p>
            <p class="text-xs text-slate-400 truncate">
              {{ item.professionalTitle }}
            </p>
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
        <img
          class="size-10 rounded-full bg-slate-800 object-cover"
          :src="teacherAvatar(item)"
        />
        <div class="min-w-0">
          <p class="text-sm font-semibold text-white truncate">
            {{ item.name }} {{ item.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
        </div>
      </div>
    </template>

    <!-- COLUMNA: age -->
    <template #age="{ item }">
      <p class="text-sm text-slate-300">
        {{ calculateAge(item.birthday) }} años
      </p>
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
      <p class="text-sm text-slate-400">{{ formatDate(item.createdAt) }}</p>
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

    <!-- DRAWER: detalle del teacher -->
    <template #drawer="{ item, close }">
      <TeacherDetailContent :teacher="item" @close="close" />
    </template>
  </EntityListLayout>

  <MyModal v-model:open="createModalOpen" size="lg" :closable="true">
    <TeacherForm
      :on-submit="addTeacher"
      @success="onTeacherCreated"
      @cancel="createModalOpen = false"
    />
  </MyModal>

  <MyModal v-model:open="editModalOpen" size="lg" :closable="true">
    <TeacherEditForm
      v-if="teacherToEdit"
      :teacher="teacherToEdit"
      :on-submit="updateTeacher"
      @success="onTeacherUpdated"
      @cancel="editModalOpen = false"
    />
  </MyModal>

  <ConfirmModal
    :open="confirmOpen"
    :title="teacherToToggle?.state ? 'Desactivar docente' : 'Activar docente'"
    :message="
      teacherToToggle?.state
        ? `¿Seguro que deseas desactivar a ${teacherToToggle?.name}? No podrá acceder al sistema.`
        : `¿Deseas activar a ${teacherToToggle?.name}? Recuperará acceso al sistema.`
    "
    :confirm-label="teacherToToggle?.state ? 'Desactivar' : 'Activar'"
    :variant="teacherToToggle?.state ? 'danger' : 'success'"
    :loading="toggling"
    @confirm="handleToggleConfirm"
    @cancel="handleToggleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { GetTeachersQuery } from "../api/teachersApi";
import { filterMap, type Teacher } from "../user.interfaces";
import { getAvatarUrl } from "../../common/utils/avatar";

import RowActions from "../../common/components/ui/RowActions.vue";

import EntityListLayout from "../../common/tables/EntityListLayout.vue";
import MyModal from "../../common/components/modals/MyModal.vue";
import TeacherForm from "./TeacherForm.vue";
import { useTeachers } from "../composable/useTeachers";
import TeacherEditForm from "./TeacherEditForm.vue";
import TeacherDetailContent from "./TeacherDetailContent.vue";
import ConfirmModal from "./ConfirmModal.vue";

const layoutRef = ref<{ reset: () => void } | null>(null);

defineProps<{
  teachers: Teacher[];
  total: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "query-change", query: GetTeachersQuery): void;
}>();

const {
  addTeacher,
  editTeacher: updateTeacher,
  toggleState,
  toggling,
} = useTeachers();

/* -----------------------------------------------------
 * Configuración de tabla (lo único específico de Teacher)
 * --------------------------------------------------- */
const filters = [
  { label: "Nombre", value: "name" },
  { label: "Correo", value: "email" },
  { label: "Documento", value: "documentNumber" },
];

const columns = [
  { label: "Usuario", key: "user" },
  { label: "Documento", key: "documentNumber" },
  { label: "Título", key: "professionalTitle" },
  { label: "Edad", key: "age" },
  { label: "Estado", key: "state" },
  { label: "Creado", key: "createdAt" },
  { label: "Actions", key: "actions" },
];

/* -----------------------------------------------------
 * Row actions state
 * --------------------------------------------------- */
const activeActionsId = ref<string | null>(null);

const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};

const closeActions = () => {
  activeActionsId.value = null;
};

const rowActions = (teacher: Teacher) => [
  { label: "Editar", onClick: () => editTeacher(teacher) },
  {
    label: teacher.state ? "Desactivar" : "Activar",
    onClick: () => openToggleConfirm(teacher),
  },
];

/* -----------------------------------------------------
 * Helpers
 * --------------------------------------------------- */
const formatDate = (date: string) => new Date(date).toLocaleDateString();

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const teacherAvatar = (teacher: Teacher) =>
  getAvatarUrl(teacher.photo, teacher.name, teacher.lastName);

/* -----------------------------------------------------
 * Acciones CRUD (conectar con modales/forms reales)
 * --------------------------------------------------- */

const createModalOpen = ref(false);

const openCreateTeacher = () => {
  createModalOpen.value = true;
};

const onTeacherCreated = () => {
  createModalOpen.value = false;
  // re-fetch: emitir query-change para recargar la lista
  layoutRef.value?.reset();
};

const editModalOpen = ref(false);
const teacherToEdit = ref<Teacher | null>(null);

const editTeacher = (teacher: Teacher) => {
  teacherToEdit.value = teacher;
  editModalOpen.value = true;
};

const onTeacherUpdated = () => {
  editModalOpen.value = false;
  teacherToEdit.value = null;
  layoutRef.value?.reset();
};

const deleteTeacher = (teacher: Teacher) => {
  console.log("Eliminar", teacher); // por ahora
};

// state del confirm
const confirmOpen = ref(false);
const teacherToToggle = ref<Teacher | null>(null);

const openToggleConfirm = (teacher: Teacher) => {
  teacherToToggle.value = teacher;
  confirmOpen.value = true;
};

const handleToggleConfirm = async () => {
  if (!teacherToToggle.value) return;
  await toggleState(teacherToToggle.value._id);
  confirmOpen.value = false;
  teacherToToggle.value = null;
  layoutRef.value?.reset();
};

const handleToggleCancel = () => {
  confirmOpen.value = false;
  teacherToToggle.value = null;
};
</script>
