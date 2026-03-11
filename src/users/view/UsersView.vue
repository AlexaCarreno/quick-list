<template>
  <div class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <!-- Tabs -->
    <div class="flex gap-2 mb-2 flex-shrink-0">
      <button
        :class="activeTab === 'teachers' ? activeClass : inactiveClass"
        @click="activeTab = 'teachers'"
      >
        Teachers
      </button>
      <button
        :class="activeTab === 'admins' ? activeClass : inactiveClass"
        @click="activeTab = 'admins'"
      >
        Admins
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
        :total="admins.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Admin } from "../../common/components/ui/AdminList.vue";

import type { GetTeachersQuery } from "../api/teachersApi";
import { useTeachers } from "../composable/useTeachers";

import TeacherList from "../components/TeacherList.vue";
import AdminList from "../components/AdminList.vue";

const activeTab = ref<"teachers" | "admins">("teachers");

// Clases simples para tabs
const activeClass = "px-4 py-1 bg-blue-600 rounded";
const inactiveClass = "px-4 py-1 bg-slate-700 rounded";

// Datos de ejemplo
const { teachers, total, loading, fetchTeachers } = useTeachers();

const handleTeacherQuery = (query: GetTeachersQuery) => {
  fetchTeachers(query);
};

const admins = ref<Admin[]>([]);

onMounted(() => {
  // Simula fetch del backend
  fetchTeachers({
    offset: 0,
    limit: 10,
  });

  admins.value = [
    {
      _id: "a1",
      userId: "admin1",
      name: "Andrés Felipe",
      lastName: "Gómez",
      email: "admin@gmail.com",
      state: true,
      createdAt: "2026-02-12T12:00:00.000Z",
    },
    {
      _id: "a2",
      userId: "admin2",
      name: "Angie",
      lastName: "Carreño",
      email: "angie.admin@gmail.com",
      state: false,
      createdAt: "2026-02-10T08:00:00.000Z",
    },
  ];
});
</script>

<style scoped>
/* Puedes refinar con Tailwind si quieres */
</style>
