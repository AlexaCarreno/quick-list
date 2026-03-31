<template>
  <div class="flex flex-col h-full min-h-0 overflow-x-hidden pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <!-- Tabs -->
    <div class="flex gap-2 mb-2 flex-shrink-0">
      <button
        :class="activeTab === 'teachers' ? activeClass : inactiveClass"
        @click="activeTab = 'teachers'"
      >
        Docentes
      </button>
      <button
        :class="activeTab === 'admins' ? activeClass : inactiveClass"
        @click="activeTab = 'admins'"
      >
        Administradores
      </button>
    </div>

    <!-- Contenido según tab activo -->
    <div class="flex-1 min-h-0 flex flex-col">
      <TeacherList
        v-if="activeTab === 'teachers'"
        class="flex-1 min-h-0"
        :teachers="teachers"
        :total="total"
        :loading="loading"
        @query-change="handleTeacherQuery"
      />

      <AdminList
        v-else
        class="flex-1 min-h-0"
        :admins="admins"
        :total="adminsTotal"
        :loading="adminsLoading"
        @query-change="handleAdminQuery"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { GetTeachersQuery } from "../api/teachersApi";
import { useTeachers } from "../composable/useTeachers";

import TeacherList from "../components/TeacherList.vue";
import AdminList from "../components/AdminList.vue";
import { useAdmins } from "../composable/useAdmins";
import type { GetAdminsQuery } from "../api/adminsApi";

const activeTab = ref<"teachers" | "admins">("teachers");

// Clases simples para tabs
const activeClass = "px-4 py-1 bg-blue-600 rounded";
const inactiveClass = "px-4 py-1 bg-slate-700 rounded";

// Datos de ejemplo
const { teachers, total, loading, fetchTeachers } = useTeachers();
const handleTeacherQuery = (query: GetTeachersQuery) => {
  fetchTeachers(query);
};

const {
  admins,
  total: adminsTotal,
  loading: adminsLoading,
  fetchAdmins,
} = useAdmins();

const handleAdminQuery = (query: GetAdminsQuery) => fetchAdmins(query);

onMounted(() => {
  fetchTeachers({ offset: 0, limit: 10 });
  fetchAdmins({ offset: 0, limit: 10 });
});
</script>

<style scoped>
/* Puedes refinar con Tailwind si quieres */
</style>
