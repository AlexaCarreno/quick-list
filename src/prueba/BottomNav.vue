<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-[#1a1d26] border-t border-gray-800 flex justify-around items-center py-2 z-50"
  >
    <button
      v-for="item in menuItems"
      :key="item.label"
      @click="active = item.label"
      class="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
      :class="{ 'text-blue-500': active === item.label }"
    >
      <!-- 🔹 Placeholder del ícono -->
      <div
        class="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-md text-sm font-semibold mb-1"
      >
        {{ item.label[0] }}
      </div>

      <!-- 🔹 Etiqueta -->
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

const active = ref("Inicio");

const menuItems = [
  { label: "Inicio" },
  { label: "Grupos" },
  { label: "Estudiantes" },
  { label: "Asistencia" },
  { label: "Reportes" },
];
</script>
