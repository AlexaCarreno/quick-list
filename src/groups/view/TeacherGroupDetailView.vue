<template>
  <div class="flex flex-col h-full min-h-0">
    <div
      class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white"
    >
      <!-- Header -->
      <div class="flex-shrink-0 mb-4">
        <button
          class="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-3"
          @click="router.push({ name: 'groups' })"
        >
          ‹ Grupos
        </button>

        <!-- Título -->
        <div v-if="group" class="flex items-center gap-3 mb-4">
          <div
            class="size-8 rounded-full flex-shrink-0"
            :style="{ backgroundColor: group.color }"
          />
          <div>
            <h1 class="text-lg font-semibold text-white">
              {{ group.subject }} {{ group.referenceCode }}
            </h1>
            <p class="text-xs text-slate-400">
              {{ group.schedules.length }} horario(s) · {{ group.period }}
            </p>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-else class="flex items-center gap-3 mb-4">
          <div class="size-8 rounded-full bg-slate-700 animate-pulse" />
          <div class="h-6 w-64 bg-slate-700 rounded animate-pulse" />
        </div>

        <!-- Sesión abierta -->
        <div
          v-if="openSession"
          class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-2"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="size-2 rounded-full bg-amber-400 animate-pulse" />
            <p class="text-sm font-medium text-amber-400">
              Sesión abierta sin cerrar
            </p>
          </div>
          <p class="text-xs text-slate-400 mb-3">
            {{ formatDate(openSession.date) }} · {{ openSession.startTime }} -
            {{ openSession.endTime }} {{ openSession.shift }} ·
            {{ openSession.totalPresent }}/{{ openSession.totalExpected }}
            presentes
          </p>
          <div class="flex gap-2">
            <button
              class="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition flex items-center justify-center gap-2"
              @click="handleContinueSession"
            >
              📸 Continuar sesión
            </button>
            <button
              class="flex-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition flex items-center justify-center gap-2"
              @click="handleContinueManual"
            >
              ✏️ Ver detalle
            </button>
            <button
              class="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm transition"
              :disabled="deleting"
              @click="handleDeleteSession"
            >
              <span
                v-if="deleting"
                class="size-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block"
              />
              <span v-else>🗑️</span>
            </button>
          </div>
        </div>

        <!-- Botón tomar asistencia (solo si no hay sesión abierta) -->
        <button
          v-else-if="group?.status === 'active'"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2"
          @click="openStartModal"
        >
          📋 Tomar Asistencia
        </button>
      </div>

      <!-- Lista de sesiones -->
      <div class="flex-1 min-h-0 overflow-auto">
        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="h-16 bg-slate-800 rounded-xl animate-pulse"
          />
        </div>

        <template v-else-if="sessions.length > 0">
          <!-- Tabla desktop -->
          <div class="hidden md:block">
            <table class="w-full text-sm">
              <thead>
                <tr
                  class="border-b border-slate-700 text-slate-400 text-xs uppercase"
                >
                  <th class="text-left py-3 px-4">Fecha</th>
                  <th class="text-left py-3 px-4">Hora</th>
                  <th class="text-left py-3 px-4">AM/PM</th>
                  <th class="text-left py-3 px-4">Asistencia</th>
                  <th class="text-left py-3 px-4">Estado</th>
                  <th class="text-left py-3 px-4">Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="s in sessions"
                  :key="s._id"
                  class="border-b border-slate-800 hover:bg-slate-800/30 transition"
                >
                  <td class="py-3 px-4 text-slate-300">
                    {{ formatDate(s.date) }}
                  </td>
                  <td class="py-3 px-4 text-slate-300">
                    {{ s.startTime }} - {{ s.endTime }}
                  </td>
                  <td class="py-3 px-4 text-slate-300">{{ s.shift }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-24 bg-slate-700 rounded-full h-1.5">
                        <div
                          class="h-1.5 rounded-full bg-emerald-400"
                          :style="{
                            width: `${s.totalExpected > 0 ? (s.totalPresent / s.totalExpected) * 100 : 0}%`,
                          }"
                        />
                      </div>
                      <span class="text-xs text-slate-400"
                        >{{ s.totalPresent }}/{{ s.totalExpected }}</span
                      >
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="
                        s.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-700 text-slate-400'
                      "
                    >
                      {{ s.status === "open" ? "Abierta" : "Cerrada" }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button
                      class="text-blue-400 hover:text-blue-300 text-xs transition"
                      @click="
                        router.push({
                          name: 'attendance-detail',
                          params: { id: s._id },
                        })
                      "
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div class="md:hidden space-y-3">
            <div
              v-for="s in sessions"
              :key="s._id"
              class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
            >
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-white">
                  {{ formatDate(s.date) }}
                </p>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="
                    s.status === 'open'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                  "
                >
                  {{ s.status === "open" ? "Abierta" : "Cerrada" }}
                </span>
              </div>
              <p class="text-xs text-slate-400">
                {{ s.startTime }} - {{ s.endTime }} · {{ s.shift }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full bg-emerald-400"
                    :style="{
                      width: `${s.totalExpected > 0 ? (s.totalPresent / s.totalExpected) * 100 : 0}%`,
                    }"
                  />
                </div>
                <span class="text-xs text-slate-400"
                  >{{ s.totalPresent }}/{{ s.totalExpected }}</span
                >
              </div>
              <button
                class="mt-3 text-blue-400 hover:text-blue-300 text-xs"
                @click="
                  router.push({
                    name: 'attendance-detail',
                    params: { id: s._id },
                  })
                "
              >
                Ver Detalle →
              </button>
            </div>
          </div>
        </template>

        <!-- Empty -->
        <div
          v-else
          class="flex flex-col items-center justify-center h-full text-slate-500"
        >
          <p class="text-4xl mb-3">📋</p>
          <p class="text-sm font-medium">Sin sesiones registradas</p>
          <p class="text-xs mt-1">Presiona "Tomar Asistencia" para iniciar</p>
        </div>
      </div>

      <!-- Paginación -->
      <div
        v-if="total > 0"
        class="flex items-center justify-between mt-4 flex-shrink-0 text-sm text-slate-400"
      >
        <span>{{ total }} sesión{{ total !== 1 ? "es" : "" }}</span>
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
    </div>

    <!-- Modal iniciar sesión -->
    <MyModal v-model:open="startModalOpen" size="md" :closable="true">
      <div class="text-white">
        <div
          class="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full mb-4"
        >
          <span class="size-1.5 rounded-full bg-blue-400" />
          INICIAR SESIÓN DE ASISTENCIA
        </div>

        <h2 class="text-xl font-semibold mb-1">
          {{ group?.subject }} {{ group?.referenceCode }}
        </h2>
        <p class="text-xs text-slate-400 mb-5">
          Confirma los datos antes de abrir la cámara
        </p>

        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="bg-slate-800 rounded-xl p-3">
            <p class="text-xs text-slate-500 mb-1">📅 FECHA</p>
            <p class="text-sm text-white font-medium">
              {{ formatDateShort(new Date().toISOString()) }}
            </p>
          </div>
          <div class="bg-slate-800 rounded-xl p-3">
            <p class="text-xs text-slate-500 mb-1">🕐 HORARIO</p>
            <p class="text-sm text-white font-medium">
              {{
                selectedSchedule
                  ? `${selectedSchedule.startTime} - ${selectedSchedule.endTime} ${selectedSchedule.shift}`
                  : "—"
              }}
            </p>
          </div>
          <div class="bg-slate-800 rounded-xl p-3">
            <p class="text-xs text-slate-500 mb-1">👥 ESTUDIANTES</p>
            <p class="text-sm text-white font-medium">
              {{ group?.schedules?.length ? studentCount + " esperados" : "—" }}
            </p>
          </div>
        </div>

        <div v-if="group && group.schedules.length > 1" class="mb-4">
          <label class="text-xs text-slate-400 mb-1 block"
            >Selecciona el horario:</label
          >
          <select
            v-model="selectedScheduleIndex"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option v-for="(s, i) in group.schedules" :key="i" :value="i">
              {{ translateDay(s.dayOfWeek) }} · {{ s.startTime }} -
              {{ s.endTime }} {{ s.shift }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-3">
          <button
            class="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
            :disabled="creating"
            @click="handleStartFacial"
          >
            <span
              v-if="creating"
              class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            📸 Iniciar con Reconocimiento Facial
          </button>
          <button
            class="w-full px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            :disabled="creating"
            @click="handleStartManual"
          >
            ✏️ Tomar Asistencia Manual
          </button>
        </div>
      </div>
    </MyModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroups } from "../composables/useGroups";
import {
  useAttendance,
  type AttendanceSession,
} from "../../attendance/composable/useAttendance";
import MyModal from "../../common/components/modals/MyModal.vue";

const route = useRoute();
const router = useRouter();
const groupId = computed(() => route.params.id as string);

const { group, fetchGroupById } = useGroups();
const {
  sessions,
  total,
  loading,
  creating,
  fetchSessionsByGroup,
  startSession,
  deleteSession,
} = useAttendance();

const limit = 10;
const offset = ref(0);
const startModalOpen = ref(false);
const selectedScheduleIndex = ref(0);
const deleting = ref(false);

const openSession = computed<AttendanceSession | null>(
  () => sessions.value.find((s) => s.status === "open") ?? null,
);

const currentPage = computed(() => Math.floor(offset.value / limit) + 1);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));
const selectedSchedule = computed(
  () => group.value?.schedules[selectedScheduleIndex.value],
);
const studentCount = computed(() =>
  sessions.value.length > 0 ? sessions.value[0].totalExpected : "?",
);

const load = () => {
  fetchSessionsByGroup(groupId.value, { limit, offset: offset.value });
};

const prevPage = () => {
  offset.value = Math.max(0, offset.value - limit);
  load();
};
const nextPage = () => {
  offset.value += limit;
  load();
};
const openStartModal = () => {
  selectedScheduleIndex.value = 0;
  startModalOpen.value = true;
};

const handleContinueSession = () => {
  if (!openSession.value) return;
  router.push({
    name: "attendance-camera",
    params: { attendanceId: openSession.value._id },
  });
};

const handleContinueManual = () => {
  if (!openSession.value) return;
  router.push({
    name: "attendance-detail",
    params: { id: openSession.value._id },
  });
};

const handleDeleteSession = async () => {
  if (!openSession.value) return;
  deleting.value = true;
  const success = await deleteSession(openSession.value._id);
  deleting.value = false;
  if (success) load();
};

const handleStartFacial = async () => {
  if (!group.value || !selectedSchedule.value) return;
  const session = await startSession({
    groupId: groupId.value,
    date: new Date().toISOString().split("T")[0],
    startTime: selectedSchedule.value.startTime,
    endTime: selectedSchedule.value.endTime,
    shift: selectedSchedule.value.shift,
  });
  if (session) {
    startModalOpen.value = false;
    router.push({
      name: "attendance-camera",
      params: { attendanceId: session._id },
    });
  }
};

const handleStartManual = async () => {
  if (!group.value || !selectedSchedule.value) return;
  const session = await startSession({
    groupId: groupId.value,
    date: new Date().toISOString().split("T")[0],
    startTime: selectedSchedule.value.startTime,
    endTime: selectedSchedule.value.endTime,
    shift: selectedSchedule.value.shift,
  });
  if (session) {
    startModalOpen.value = false;
    router.push({ name: "attendance-detail", params: { id: session._id } });
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatDateShort = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const translateDay = (day: string) => {
  const map: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
  };
  return map[day] ?? day;
};

onMounted(() => {
  fetchGroupById(groupId.value);
  load();
});
</script>
