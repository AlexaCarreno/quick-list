<template>
  <div class="space-y-4">
    <!-- Tabs -->
    <UserTabs v-model="activeTab" />

    <!-- Filtros -->
    <UserFilters v-model="search" />

    <!-- Tabla desktop / cards mobile -->
    <UserTable :type="activeTab" :search="search" />

    <!-- Botón -->
    <div class="flex justify-end">
      <button class="btn-primary">New</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserTabs from "../components/UserTabs.vue";
import UserFilters from "../components/UserFilters.vue";
import UserTable from "../components/UserTable.vue";

const activeTab = ref<"admins" | "teachers">("admins");
const search = ref("");
</script>
