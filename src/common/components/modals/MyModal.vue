<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed p-3 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        :class="[
          'bg-gray-900 text-white rounded-2xl p-6 shadow-lg w-full',
          sizeClass,
          'relative',
          'max-h-[90vh] overflow-y-auto',
        ]"
      >
        <button
          v-if="closable"
          @click="emitClose"
          class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  size?: "sm" | "md" | "lg" | "xl";
  closable?: boolean;
}>();

// Control de apertura desde el padre con v-model:open
const open = defineModel<boolean>("open");

// Clases por tamaño
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-2xl";
    default:
      return "max-w-md";
  }
});

const emitClose = () => {
  open.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
