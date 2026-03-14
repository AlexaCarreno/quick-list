<template>
  <div class="flex flex-col min-h-0">
    <!-- Header: filtros + vincular -->
    <div class="flex flex-col gap-3 mb-4 flex-shrink-0">
      <div class="flex items-center gap-2">
        <select
          v-model="searchFilter"
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex-shrink-0"
        >
          <option value="name">Nombre</option>
          <option value="documentNumber">Documento</option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar estudiante..."
          class="flex-1 md:max-w-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          @keyup.enter="onSearch"
        />
        <button
          class="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition flex-shrink-0"
          @click="onSearch"
        >
          🔍
        </button>
        <!-- Botón vincular en desktop -->
        <button
          class="hidden md:block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm ml-auto flex-shrink-0"
          @click="openLinkModal"
        >
          + Vincular estudiante
        </button>
      </div>
      <!-- Botón vincular en mobile -->
      <button
        class="md:hidden bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full"
        @click="openLinkModal"
      >
        + Vincular estudiante
      </button>
    </div>

    <!-- Tabla desktop -->
    <div class="hidden md:block flex-1 min-h-0 overflow-auto">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-slate-700 text-slate-400 text-xs uppercase"
          >
            <th class="text-left py-3 px-4">Estudiante</th>
            <th class="text-left py-3 px-4">Documento</th>
            <th class="text-left py-3 px-4">Carrera</th>
            <th class="text-left py-3 px-4">Edad</th>
            <th class="text-left py-3 px-4">Estado</th>
            <th class="text-left py-3 px-4">Creado</th>
            <th class="text-left py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in students"
            :key="item._id"
            class="border-b border-slate-800 hover:bg-slate-800/30 transition"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <img
                  :src="
                    getAvatarUrl(
                      item.studentId.photo,
                      item.studentId.name,
                      item.studentId.lastName,
                    )
                  "
                  class="size-9 rounded-full object-cover bg-slate-700"
                />
                <div>
                  <p class="text-white font-medium">
                    {{ item.studentId.name }} {{ item.studentId.lastName }}
                  </p>
                  <p class="text-xs text-slate-400">
                    {{ item.studentId.email }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ item.studentId.documentNumber }}
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ item.studentId.career }}
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ calculateAge(item.studentId.birthday) }} años
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full"
                  :class="item.allowed ? 'bg-emerald-500' : 'bg-red-500'"
                />
                <span class="text-slate-300">{{
                  item.allowed ? "Activo" : "Inactivo"
                }}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-slate-400">
              {{ formatDate(item.createdAt) }}
            </td>
            <td class="py-3 px-4" @click.stop>
              <RowActions
                :open="activeActionsId === item._id"
                @toggle="toggleActions(item._id)"
                @close="closeActions"
                :actions="rowActions(item)"
              />
            </td>
          </tr>
          <tr v-if="students.length === 0 && !loading">
            <td colspan="7" class="py-8 text-center text-slate-500 text-sm">
              No hay estudiantes vinculados a este grupo
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden flex-1 overflow-auto space-y-3">
      <MobileCard v-for="item in students" :key="item._id">
        <template #avatar>
          <img
            :src="
              getAvatarUrl(
                item.studentId.photo,
                item.studentId.name,
                item.studentId.lastName,
              )
            "
            class="size-12 rounded-full object-cover bg-slate-700"
          />
        </template>
        <template #title>
          <p class="text-sm font-semibold text-white truncate">
            {{ item.studentId.name }} {{ item.studentId.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">
            {{ item.studentId.email }}
          </p>
        </template>
        <template #info>
          <p class="text-xs text-slate-400">
            Doc: {{ item.studentId.documentNumber }}
          </p>
          <p class="text-xs text-slate-400 truncate">
            {{ item.studentId.career }}
          </p>
        </template>
        <template #status>
          <div class="flex items-center gap-2">
            <span
              class="size-2 rounded-full"
              :class="item.allowed ? 'bg-emerald-500' : 'bg-red-500'"
            />
            <span class="text-xs text-slate-400">
              {{ item.allowed ? "Activo" : "Inactivo" }}
            </span>
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
      <p
        v-if="students.length === 0 && !loading"
        class="text-center text-slate-500 text-sm py-8"
      >
        No hay estudiantes vinculados
      </p>
    </div>

    <!-- Paginación -->
    <div
      class="flex items-center justify-between mt-4 flex-shrink-0 text-sm text-slate-400"
    >
      <span>{{ total }} estudiante{{ total !== 1 ? "s" : "" }}</span>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
          :disabled="offset === 0"
          @click="prevPage"
        >
          ‹
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
          :disabled="offset + limit >= total"
          @click="nextPage"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Modal vincular estudiantes -->
    <MyModal v-model:open="linkModalOpen" size="lg" :closable="true">
      <div class="text-white min-h-64">
        <h2 class="text-lg font-semibold mb-4">Vincular estudiantes</h2>
        <div class="relative">
          <input
            v-model="studentSearch"
            type="text"
            placeholder="Buscar por nombre o documento..."
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            @input="onStudentSearch"
            @blur="onStudentBlur"
          />
          <div
            v-if="studentResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <button
              v-for="student in studentResults"
              :key="student._id"
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition flex items-center justify-between"
              @mousedown.prevent="selectStudent(student)"
            >
              <span class="text-white"
                >{{ student.name }} {{ student.lastName }}</span
              >
              <span class="text-slate-400 text-xs">{{
                student.documentNumber
              }}</span>
            </button>
          </div>
        </div>

        <div v-if="selectedStudents.length > 0" class="mt-3 space-y-2">
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-2">
            Seleccionados ({{ selectedStudents.length }})
          </p>
          <div
            v-for="student in selectedStudents"
            :key="student._id"
            class="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2"
          >
            <span class="text-sm text-slate-200">
              {{ student.name }} {{ student.lastName }}
              <span class="text-slate-400 text-xs ml-2">{{
                student.documentNumber
              }}</span>
            </span>
            <button
              type="button"
              class="text-slate-400 hover:text-red-400 text-xs ml-3"
              @click="removeSelected(student._id)"
            >
              ✕
            </button>
          </div>
        </div>

        <p v-else class="mt-3 text-xs text-slate-500">
          Busca y selecciona los estudiantes que deseas vincular
        </p>

        <div class="flex gap-3 mt-5">
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
            @click="linkModalOpen = false"
          >
            Cancelar
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            :disabled="selectedStudents.length === 0 || adding"
            @click="handleLinkStudents"
          >
            <span
              v-if="adding"
              class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            {{
              adding
                ? "Vinculando..."
                : `Vincular${selectedStudents.length > 0 ? ` (${selectedStudents.length})` : ""}`
            }}
          </button>
        </div>
      </div>
    </MyModal>

    <!-- Confirm desvincular -->
    <ConfirmModal
      :open="unlinkConfirmOpen"
      title="Desvincular estudiante"
      :message="`¿Seguro que deseas desvincular a ${studentToUnlink?.studentId.name}?`"
      confirm-label="Desvincular"
      variant="danger"
      :loading="removing"
      @confirm="handleUnlinkConfirm"
      @cancel="unlinkConfirmOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getAvatarUrl } from "../../common/utils/avatar";
import {
  useStudentGroup,
  type StudentInGroup,
} from "../composables/useStudentGroup";
import { getStudents } from "../../students/studentApi";
import RowActions from "../../common/components/ui/RowActions.vue";
import MyModal from "../../common/components/modals/MyModal.vue";
import ConfirmModal from "../../common/components/modals/ConfirmModal.vue";
import { addStudentsToGroup } from "../api/studentGroupApi";
import MobileCard from "../../common/components/ui/MobileCard.vue";

const props = defineProps<{ groupId: string }>();

const {
  students,
  total,
  loading,
  adding,
  removing,
  fetchGroupStudents,
  removeStudent,
  toggleAllowed,
} = useStudentGroup();

const limit = 10;
const offset = ref(0);
const searchQuery = ref("");
const searchFilter = ref("name");
const activeActionsId = ref<string | null>(null);

const currentPage = computed(() => Math.floor(offset.value / limit) + 1);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

const load = () => {
  fetchGroupStudents(props.groupId, {
    limit,
    offset: offset.value,
    name:
      searchFilter.value === "name"
        ? searchQuery.value || undefined
        : undefined,
    documentNumber:
      searchFilter.value === "documentNumber"
        ? searchQuery.value || undefined
        : undefined,
  });
};

const onSearch = () => {
  offset.value = 0;
  load();
};

const prevPage = () => {
  offset.value = Math.max(0, offset.value - limit);
  load();
};

const nextPage = () => {
  offset.value += limit;
  load();
};

const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};
const closeActions = () => (activeActionsId.value = null);

const rowActions = (item: StudentInGroup) => [
  {
    label: item.allowed ? "Desactivar" : "Activar",
    onClick: async () => {
      await toggleAllowed(props.groupId, item.studentId._id);
      load();
    },
  },
  {
    label: "Desvincular",
    onClick: () => openUnlinkConfirm(item),
  },
];

// Desvincular
const unlinkConfirmOpen = ref(false);
const studentToUnlink = ref<StudentInGroup | null>(null);
const openUnlinkConfirm = (item: StudentInGroup) => {
  studentToUnlink.value = item;
  unlinkConfirmOpen.value = true;
};
const handleUnlinkConfirm = async () => {
  if (!studentToUnlink.value) return;
  await removeStudent(props.groupId, studentToUnlink.value.studentId._id);
  unlinkConfirmOpen.value = false;
  studentToUnlink.value = null;
  load();
};

// Vincular múltiples estudiantes
type StudentOption = {
  _id: string;
  name: string;
  lastName: string;
  documentNumber: string;
};

const linkModalOpen = ref(false);
const studentSearch = ref("");
const studentResults = ref<StudentOption[]>([]);
const selectedStudents = ref<StudentOption[]>([]);

const openLinkModal = () => {
  studentSearch.value = "";
  studentResults.value = [];
  selectedStudents.value = [];
  linkModalOpen.value = true;
};

let searchTimeout: ReturnType<typeof setTimeout>;
const onStudentSearch = () => {
  clearTimeout(searchTimeout);
  if (!studentSearch.value.trim()) {
    studentResults.value = [];
    return;
  }
  searchTimeout = setTimeout(async () => {
    const res = await getStudents({ name: studentSearch.value, limit: 5 });
    if (res.success) {
      studentResults.value = res.data.students.map((s: any) => ({
        _id: s._id,
        name: s.name,
        lastName: s.lastName,
        documentNumber: s.documentNumber,
      }));
    }
  }, 300);
};

const onStudentBlur = () => {
  setTimeout(() => (studentResults.value = []), 200);
};

const selectStudent = (student: StudentOption) => {
  if (selectedStudents.value.find((s) => s._id === student._id)) return;
  selectedStudents.value.push(student);
  studentSearch.value = "";
  studentResults.value = [];
};

const removeSelected = (id: string) => {
  selectedStudents.value = selectedStudents.value.filter((s) => s._id !== id);
};

const handleLinkStudents = async () => {
  if (selectedStudents.value.length === 0) return;
  await addStudentsToGroup(
    props.groupId,
    selectedStudents.value.map((s) => s._id),
  );
  linkModalOpen.value = false;
  selectedStudents.value = [];
  load();
};

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

onMounted(() => load());
</script>
