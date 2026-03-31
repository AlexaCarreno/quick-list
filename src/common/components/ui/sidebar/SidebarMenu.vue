<template>
  <nav
    class="flex-1 p-2 py-5 space-y-2 overflow-y-auto overflow-hidden"
    :class="{ 'justify-center': !isMobile }"
  >
    <RouterLink
      v-for="item in menuItems"
      :key="item.label"
      :to="item.path"
      class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
      :class="isActive(item) ? 'bg-blue-600 hover:bg-blue-700' : ''"
      @click="$emit('menuClick')"
    >
      <div
        class="flex items-center justify-center w-8 h-8 bg-gray-700 text-sm font-semibold rounded flex-shrink-0"
      >
        {{ item.label[0] }}
      </div>

      <span
        v-show="computedOpen"
        class="transition-all duration-300 ease-in-out"
      >
        {{ item.label }}
      </span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { NavigationItem } from "../../../config/navigation.config";

defineProps<{
  menuItems: NavigationItem[];
  computedOpen: boolean;
  isMobile: boolean;
}>();

const route = useRoute();

const isActive = (item: NavigationItem): boolean => {
  // Coincidencia exacta o ruta hija directa
  if (route.path === item.path || route.path.startsWith(item.path + "/")) {
    return true;
  }

  // Rutas de asistencia pertenecen al módulo de grupos
  if (item.path === "/groups" && route.path.startsWith("/attendance/")) {
    return true;
  }

  return false;
};
</script>
