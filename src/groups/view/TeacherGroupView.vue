<template>
  <div class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <h1 class="text-lg font-semibold mb-4 flex-shrink-0">Mis Grupos</h1>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-28 bg-slate-800 rounded-xl animate-pulse"
      />
    </div>

    <!-- Grid de cards -->
    <div
      v-else-if="groups.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-auto"
    >
      <div
        v-for="group in groups"
        :key="group._id"
        class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition flex items-center justify-between gap-4"
        @click="
          router.push({
            name: 'teacher-group-session',
            params: { id: group._id },
          })
        "
      >
        <div class="flex items-center gap-4 min-w-0">
          <!-- Color del grupo -->
          <div
            class="size-12 rounded-full flex-shrink-0"
            :style="{ backgroundColor: group.color }"
          />
          <div class="min-w-0">
            <p class="text-white font-semibold truncate">{{ group.subject }}</p>
            <p class="text-slate-400 text-sm">{{ group.referenceCode }}</p>
            <p class="text-slate-500 text-xs mt-1">
              {{
                group.schedules.length > 0
                  ? `${translateDay(group.schedules[0].dayOfWeek)} ${group.schedules[0].startTime} - ${group.schedules[0].endTime}`
                  : "Sin horario"
              }}
            </p>
          </div>
        </div>
        <div class="flex-shrink-0 text-slate-400">›</div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center flex-1 text-slate-500"
    >
      <p class="text-4xl mb-3">📚</p>
      <p class="text-sm font-medium">Sin grupos asignados</p>
      <p class="text-xs mt-1">El administrador aún no te ha asignado grupos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTeacherGroups } from "../composables/useTeacherGroups";

const router = useRouter();
const { groups, loading, fetchMyGroups } = useTeacherGroups();

const translateDay = (day: string) => {
  const map: Record<string, string> = {
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mié",
    thursday: "Jue",
    friday: "Vie",
    saturday: "Sáb",
  };
  return map[day] ?? day;
};

onMounted(() => {
  console.log('TeacherGroupView mounted');
  fetchMyGroups()
});
onActivated(() => fetchMyGroups());
</script>
