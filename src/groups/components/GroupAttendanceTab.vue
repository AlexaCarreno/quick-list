<template>
  <div class="flex flex-col h-full min-h-0">
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
      <div class="hidden md:block flex-1 min-h-0 overflow-auto">
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
              <td class="py-3 px-4 text-slate-300">{{ formatDate(s.date) }}</td>
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
      <div class="md:hidden flex-1 min-h-0 overflow-y-auto space-y-3">
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
              router.push({ name: 'attendance-detail', params: { id: s._id } })
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
      class="flex flex-col items-center justify-center flex-1 text-slate-500"
    >
      <p class="text-4xl mb-3">📋</p>
      <p class="text-sm font-medium">Sin sesiones registradas</p>
      <p class="text-xs mt-1">
        El docente aún no ha tomado asistencia en este grupo
      </p>
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAttendance } from "../../attendance/composable/useAttendance";

const props = defineProps<{ groupId: string }>();

const router = useRouter();
const { sessions, total, loading, fetchSessionsByGroup } = useAttendance();

const limit = 10;
const offset = ref(0);

const currentPage = computed(() => Math.floor(offset.value / limit) + 1);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

const load = () =>
  fetchSessionsByGroup(props.groupId, { limit, offset: offset.value });

const prevPage = () => {
  offset.value = Math.max(0, offset.value - limit);
  load();
};
const nextPage = () => {
  offset.value += limit;
  load();
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

onMounted(() => load());
</script>
