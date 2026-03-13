<!-- StudentList.vue -->
<template>
  <EntityListLayout
    ref="layoutRef"
    :items="students"
    :total="total"
    :loading="loading"
    :columns="columns"
    grid-template="3fr 1fr 2fr 1fr 1fr 1fr 1fr"
    :filters="filters"
    :filter-map="studentFilterMap"
    default-filter="name"
    :class="$attrs.class"
    @query-change="$emit('query-change', $event)"
  >
    <template #header-actions>
      <button
        class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full sm:w-auto"
        @click="openCreateStudent"
      >
        + Crear estudiante
      </button>
    </template>

    <!-- MOBILE -->
    <template #mobile="{ item, openDetail }">
      <div
        class="flex gap-x-4 justify-between items-center cursor-pointer"
        @click.stop="openDetail(item)"
      >
        <div class="flex gap-x-4 flex-1 min-w-0">
          <img
            class="size-12 rounded-full bg-slate-800 object-cover"
            :src="studentAvatar(item)"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">
              {{ item.name }} {{ item.lastName }}
            </p>
            <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
            <p class="text-xs text-slate-400">Doc: {{ item.documentNumber }}</p>
            <p class="text-xs text-slate-400 truncate">{{ item.career }}</p>
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
          :src="studentAvatar(item)"
        />
        <div class="min-w-0">
          <p class="text-sm font-semibold text-white truncate">
            {{ item.name }} {{ item.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
        </div>
      </div>
    </template>

    <!-- COLUMNA: documentNumber -->
    <template #documentNumber="{ item }">
      <p class="text-sm text-slate-300">{{ item.documentNumber || "—" }}</p>
    </template>

    <!-- COLUMNA: career -->
    <template #career="{ item }">
      <p class="text-sm text-slate-300 truncate">{{ item.career || "—" }}</p>
    </template>

    <!-- COLUMNA: semester -->
    <template #semester="{ item }">
      <p class="text-sm text-slate-300">Semestre {{ item.semester }}</p>
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

    <!-- DRAWER -->
    <template #drawer="{ item, close }">
      <StudentDetailContent :student="item" @close="close" />
    </template>
  </EntityListLayout>

  <MyModal v-model:open="createModalOpen" size="lg" :closable="true">
    <StudentForm
      :on-submit="addStudent"
      @success="onStudentCreated"
      @cancel="createModalOpen = false"
    />
  </MyModal>

  <MyModal v-model:open="editModalOpen" size="lg" :closable="true">
    <StudentEditForm
      v-if="studentToEdit"
      :student="studentToEdit"
      :on-submit="editStudent"
      @success="onStudentUpdated"
      @cancel="editModalOpen = false"
    />
  </MyModal>

  <ConfirmModal
    :open="confirmOpen"
    :title="
      studentToToggle?.state ? 'Desactivar estudiante' : 'Activar estudiante'
    "
    :message="
      studentToToggle?.state
        ? `¿Seguro que deseas desactivar a ${studentToToggle?.name}? No podrá ser reconocido en asistencias.`
        : `¿Deseas activar a ${studentToToggle?.name}? Volverá a estar disponible en asistencias.`
    "
    :confirm-label="studentToToggle?.state ? 'Desactivar' : 'Activar'"
    :variant="studentToToggle?.state ? 'danger' : 'success'"
    :loading="toggling"
    @confirm="handleToggleConfirm"
    @cancel="handleToggleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

import { getAvatarUrl } from "../../common/utils/avatar";

import MyModal from "../../common/components/modals/MyModal.vue";
import RowActions from "../../common/components/ui/RowActions.vue";
import EntityListLayout from "../../common/tables/EntityListLayout.vue";
import ConfirmModal from "../../users/components/ConfirmModal.vue";
import { studentFilterMap, type Student } from "../student.interfaces";
import type { GetStudentsQuery } from "../studentApi";
import { useStudents } from "../useStudents";
import StudentDetailContent from "./StudentDetailContent.vue";
import StudentEditForm from "./StudentEditForm.vue";
import StudentForm from "./StudentForm.vue";

const layoutRef = ref<{ reset: () => void } | null>(null);

defineProps<{
  students: Student[];
  total: number;
  loading?: boolean;
}>();

defineEmits<{
  (e: "query-change", query: GetStudentsQuery): void;
}>();

const { addStudent, editStudent, toggleState, toggling } = useStudents();

const filters = [
  { label: "Nombre", value: "name" },
  { label: "Correo", value: "email" },
  { label: "Documento", value: "documentNumber" },
  { label: "Carrera", value: "career" },
];

const columns = [
  { label: "Estudiante", key: "user" },
  { label: "Documento", key: "documentNumber" },
  { label: "Carrera", key: "career" },
  { label: "Semestre", key: "semester" },
  { label: "Edad", key: "age" },
  { label: "Estado", key: "state" },
  { label: "Acciones", key: "actions" },
];

const activeActionsId = ref<string | null>(null);
const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};
const closeActions = () => {
  activeActionsId.value = null;
};

const rowActions = (student: Student) => [
  { label: "Editar", onClick: () => openEditStudent(student) },
  {
    label: student.state ? "Desactivar" : "Activar",
    onClick: () => openToggleConfirm(student),
  },
];

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const studentAvatar = (student: Student) =>
  getAvatarUrl(student.photo, student.name, student.lastName);

// Crear
const createModalOpen = ref(false);
const openCreateStudent = () => (createModalOpen.value = true);
const onStudentCreated = () => {
  createModalOpen.value = false;
  layoutRef.value?.reset();
};

// Editar
const editModalOpen = ref(false);
const studentToEdit = ref<Student | null>(null);
const openEditStudent = (student: Student) => {
  studentToEdit.value = student;
  editModalOpen.value = true;
};
const onStudentUpdated = () => {
  editModalOpen.value = false;
  studentToEdit.value = null;
  layoutRef.value?.reset();
};

// Toggle state
const confirmOpen = ref(false);
const studentToToggle = ref<Student | null>(null);
const openToggleConfirm = (student: Student) => {
  studentToToggle.value = student;
  confirmOpen.value = true;
};
const handleToggleConfirm = async () => {
  if (!studentToToggle.value) return;
  await toggleState(studentToToggle.value._id);
  confirmOpen.value = false;
  studentToToggle.value = null;
  layoutRef.value?.reset();
};
const handleToggleCancel = () => {
  confirmOpen.value = false;
  studentToToggle.value = null;
};
</script>
