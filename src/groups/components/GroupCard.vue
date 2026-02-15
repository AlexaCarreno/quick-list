<template>
  <div
    @click.prevent="$emit('click', id)"
    :class="[
      'rounded-xl border-2 p-3 text-center relative',
      borderColor,
      'h-48 sm:h-56 md:h-48 lg:h-56', // Reducir altura en desktop
      'transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-gray-900 cursor-pointer',
    ]"
  >
    <div class="flex flex-col justify-center h-full">
      <!-- Título -->
      <div class="text-base md:text-lg font-semibold text-sky-700 mb-2">
        {{ title }}
      </div>

      <!-- Asignatura -->
      <div class="text-sm md:text-base">{{ subject }}</div>

      <!-- Código -->
      <div class="text-xs md:text-sm text-gray-400">
        {{ code }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { border } = defineProps<{
  id?: string
  title: string;
  subject: string;
  code: string;
  border: BorderColor;
}>();

type BorderColor = "blue" | "green" | "red" | "yellow" | "emerald" | "purple" | "sky";

const borderColor = computed(() => {
  const allowedBorders = {
    blue: "border-blue-200",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-indigo-400",
    emerald: "border-emerald-600",
    sky: "border-sky-800",
  };
  return allowedBorders[border] || "border-gray-400";
});
</script>

<style scoped>
/* Tailwind CSS handles most of the responsiveness */
</style>
