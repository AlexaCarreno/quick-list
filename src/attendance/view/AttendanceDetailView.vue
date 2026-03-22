<template>
  <div class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <!-- Header -->
    <div class="flex-shrink-0 mb-4">
      <button
        class="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-3"
        @click="handleBack"
      >
        ‹ volver
      </button>

      <!-- Info de la sesión -->
      <div
        v-if="session"
        class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-4"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-white font-semibold text-base">
              Asistencia del {{ formatDate(session.date) }}
            </p>
            <p class="text-blue-400 text-sm mt-0.5">
              Hora: {{ session.startTime }} - {{ session.endTime }}
              {{ session.shift }}
            </p>
            <p class="text-slate-400 text-xs mt-1">
              Total de estudiantes:
              <span class="text-white">{{ session.totalExpected }}</span>
            </p>
            <p class="text-slate-400 text-xs">
              Asistencia:
              <span class="text-emerald-400">
                {{ session.totalPresent }} presentes ({{
                  session.totalExpected > 0
                    ? Math.round(
                        (session.totalPresent / session.totalExpected) * 100,
                      )
                    : 0
                }}%)
              </span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="
                session.status === 'open'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-slate-700 text-slate-400'
              "
            >
              {{ session.status === "open" ? "Abierta" : "Cerrada" }}
            </span>
            <button
              v-if="session.status === 'open'"
              class="text-xs px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition"
              :disabled="closing"
              @click="handleClose"
            >
              {{ closing ? "Cerrando..." : "Cerrar sesión" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-else class="h-28 bg-slate-800 rounded-xl animate-pulse mb-4" />

      <!-- Buscador -->
      <div class="flex items-center gap-2">
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
      </div>
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
            <th class="text-left py-3 px-4">Asistencia</th>
            <th class="text-left py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in students"
            :key="record._id"
            class="border-b border-slate-800 hover:bg-slate-800/30 transition"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <img
                  :src="
                    getAvatarUrl(
                      record.studentId.photo,
                      record.studentId.name,
                      record.studentId.lastName,
                    )
                  "
                  class="size-9 rounded-full object-cover bg-slate-700"
                />
                <div>
                  <p class="text-white font-medium">
                    {{ record.studentId.name }} {{ record.studentId.lastName }}
                  </p>
                  <p class="text-xs text-slate-400">
                    {{ record.studentId.email }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ record.studentId.documentNumber }}
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ record.studentId.career }}
            </td>
            <td class="py-3 px-4 text-slate-300">
              {{ calculateAge(record.studentId.birthday) }} años
            </td>
            <td class="py-3 px-4">
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="statusClass(record.status)"
              >
                {{ statusLabel(record.status) }}
              </span>
            </td>
            <td class="py-3 px-4" @click.stop>
              <select
                v-if="session?.status === 'open'"
                :value="record.status"
                class="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                @change="
                  handleStatusChange(
                    record,
                    ($event.target as HTMLSelectElement).value,
                  )
                "
              >
                <option value="present">Presente</option>
                <option value="absent">Ausente</option>
                <option value="late">Tardanza</option>
                <option value="excused">Justificado</option>
              </select>
              <span v-else class="text-xs text-slate-500">—</span>
            </td>
          </tr>
          <tr v-if="students.length === 0 && !loading">
            <td colspan="6" class="py-8 text-center text-slate-500 text-sm">
              No hay registros
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden flex-1 min-h-0 overflow-y-auto space-y-3">
      <div
        v-for="record in students"
        :key="record._id"
        class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <!-- Header del card -->
        <div class="flex items-center gap-3 mb-3">
          <img
            :src="
              getAvatarUrl(
                record.studentId.photo,
                record.studentId.name,
                record.studentId.lastName,
              )
            "
            class="size-10 rounded-full object-cover bg-slate-700 flex-shrink-0"
          />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-white truncate">
              {{ record.studentId.name }} {{ record.studentId.lastName }}
            </p>
            <p class="text-xs text-slate-400 truncate">
              {{ record.studentId.email }}
            </p>
          </div>
          <span
            class="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
            :class="statusClass(record.status)"
          >
            {{ statusLabel(record.status) }}
          </span>
        </div>

        <!-- Info adicional -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p class="text-xs text-slate-500">Documento</p>
            <p class="text-xs text-slate-300">
              {{ record.studentId.documentNumber }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Edad</p>
            <p class="text-xs text-slate-300">
              {{ calculateAge(record.studentId.birthday) }} años
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-500">Carrera</p>
            <p class="text-xs text-slate-300 truncate">
              {{ record.studentId.career }}
            </p>
          </div>
        </div>

        <!-- Selector de estado -->
        <select
          v-if="session?.status === 'open'"
          :value="record.status"
          class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
          @change="
            handleStatusChange(
              record,
              ($event.target as HTMLSelectElement).value,
            )
          "
        >
          <option value="present">Presente</option>
          <option value="absent">Ausente</option>
          <option value="late">Tardanza</option>
          <option value="excused">Justificado</option>
        </select>
      </div>

      <p
        v-if="students.length === 0 && !loading"
        class="text-center text-slate-500 text-sm py-8"
      >
        No hay registros
      </p>
    </div>

    <!-- Paginación -->
    <div
      class="flex items-center justify-between mt-4 flex-shrink-0 text-sm text-slate-400"
    >
      <span
        >{{ totalStudents }} estudiante{{
          totalStudents !== 1 ? "s" : ""
        }}</span
      >
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
          :disabled="offset + limit >= totalStudents"
          @click="nextPage"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAvatarUrl } from "../../common/utils/avatar";
import {
  useAttendance,
  type StudentAttendanceRecord,
} from "../composable/useAttendance";
import { usePermissionStore } from "../../common/stores/permissionsStore";

const route = useRoute();
const router = useRouter();
const attendanceId = computed(() => route.params.id as string);

const permissionStore = usePermissionStore();

const {
  session,
  students,
  totalStudents,
  loading,
  closing,
  fetchSessionById,
  fetchStudents,
  closeSession,
  updateStatus,
} = useAttendance();

const limit = 10;
const offset = ref(0);
const searchQuery = ref("");

const currentPage = computed(() => Math.floor(offset.value / limit) + 1);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalStudents.value / limit)),
);

const load = () => {
  fetchStudents(attendanceId.value, {
    limit,
    offset: offset.value,
    name: searchQuery.value || undefined,
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

const handleClose = async () => {
  await closeSession(attendanceId.value);
};

const handleStatusChange = async (
  record: StudentAttendanceRecord,
  newStatus: string,
) => {
  await updateStatus(attendanceId.value, record.studentId._id, newStatus);
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    present: "Presente",
    absent: "Ausente",
    late: "Tardanza",
    excused: "Justificado",
  };
  return map[status] ?? status;
};

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    present: "bg-emerald-500/10 text-emerald-400",
    absent: "bg-red-500/10 text-red-400",
    late: "bg-amber-500/10 text-amber-400",
    excused: "bg-blue-500/10 text-blue-400",
  };
  return map[status] ?? "bg-slate-700 text-slate-400";
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

onMounted(() => {
  fetchSessionById(attendanceId.value);
  load();
});

const handleBack = () => {
  if (permissionStore.hasRole("teacher")) {
    router.push({
      name: "teacher-group-session",
      params: { id: session.value?.groupId },
    });
  } else {
    router.push({
      name: "group-detail",
      params: { id: session.value?.groupId },
      query: { tab: "attendance" },
    });
  }
};
</script>
