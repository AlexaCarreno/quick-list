<template>
  <div
    class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white overflow-y-auto"
  >
    <!-- Header -->
    <div class="flex-shrink-0 mb-4">
      <!-- Volver -->
      <button
        class="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-3"
        @click="router.push({ name: 'groups' })"
      >
        ‹ volver
      </button>

      <!-- Título -->
      <div v-if="group" class="flex items-center gap-3 mb-4">
        <div
          class="size-8 rounded-full flex-shrink-0"
          :style="{ backgroundColor: group.color }"
        />
        <h1 class="text-lg font-semibold text-white">
          {{ group.referenceCode }} / {{ group.subject }}
        </h1>
      </div>

      <!-- Skeleton título -->
      <div v-else class="flex items-center gap-3 mb-4">
        <div class="size-8 rounded-full bg-slate-700 animate-pulse" />
        <div class="h-6 w-64 bg-slate-700 rounded animate-pulse" />
      </div>

      <!-- Tabs -->
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="activeTab === tab.key ? activeTabClass : inactiveTabClass"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Contenido tabs -->
    <div class="flex-1 flex flex-col">
      <GroupInfoTab
        v-if="activeTab === 'info'"
        :group="group"
        :loading="loading"
        class="flex-1"
        @updated="fetchGroupById(groupId)"
      />
      <GroupStudentsTab
        v-else-if="activeTab === 'students'"
        :group-id="groupId"
        class="flex-1"
      />
      <GroupAttendanceTab
        v-else-if="activeTab === 'attendance'"
        :group-id="groupId"
        class="flex-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import GroupAttendanceTab from "../components/GroupAttendanceTab.vue";
import GroupInfoTab from "../components/GroupInfoTab.vue";
import GroupStudentsTab from "../components/GroupStudentsTab.vue";
import { useGroups } from "../composables/useGroups";

const route = useRoute();
const router = useRouter();

const groupId = computed(() => route.params.id as string);
const activeTab = computed({
  get: () => (route.query.tab as string) || "info",
  set: (val) => router.replace({ query: { ...route.query, tab: val } }),
});

const tabs: { key: "info" | "students" | "attendance"; label: string }[] = [
  { key: "info", label: "Info" },
  { key: "students", label: "Estudiantes" },
  { key: "attendance", label: "Asistencia" },
];

const activeTabClass =
  "px-4 py-1.5 rounded text-sm font-medium bg-blue-600 text-white";
const inactiveTabClass =
  "px-4 py-1.5 rounded text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition";

const { group, loading, fetchGroupById } = useGroups();

onMounted(() => fetchGroupById(groupId.value));
</script>
