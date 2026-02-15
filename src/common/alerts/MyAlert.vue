<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      :class="[
        'alert',
        alertTypeClass,
        'fixed',
        'top-4',
        'z-50',
        alertPosition,
      ]"
      class="max-w-sm w-full p-3 rounded-md shadow-lg text-white"
    >
      <div class="flex justify-between items-center">
        <div class="font-semibold">{{ title }}</div>
        <button @click="closeAlert" class="text-lg">×</button>
      </div>
      <div>{{ message }}</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  visible: boolean; // Visibilidad controlada desde afuera
  title: string;
  message?: string;
  type?: "success" | "warning" | "error" | "info";
}>();

// Emitimos evento para que el padre controle el cierre
const emit = defineEmits<{
  (e: "close"): void;
}>();

// No hay estado local visible, usamos prop

// Computed para la clase según tipo
const alertTypeClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "info":
      return "bg-blue-500";
    case "warning":
    default:
      return "bg-yellow-600";
  }
});

// Posición responsive
const alertPosition = ref("right-4");
onMounted(() => {
  if (window.innerWidth < 890) {
    alertPosition.value = "left-4 right-2 top-4"; // márgenes en móvil
  }
  if (window.innerWidth < 768 && window.innerWidth >= 600) {
    alertPosition.value = "left-2 right-2 top-4";
  }
});

// Método para emitir cierre
const closeAlert = () => {
  emit("close");
};
</script>

<style scoped>
.alert {
  animation: slide-in 0.5s ease-out;
}
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
