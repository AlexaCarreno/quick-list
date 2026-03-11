<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="[
      'alert',
      'fixed z-100 p-3 rounded-md shadow-lg text-white',
      'w-[90%] max-w-sm',
      'left-1/2 -translate-x-1/2',
      'sm:left-auto sm:right-4 sm:translate-x-0',
      'top-4',
      alertTypeClass
    ]">
      <div class="flex justify-between items-center">
        <div class="font-semibold">{{ title }}</div>
        <button @click="closeAlert" class="text-lg">×</button>
      </div>

      <div v-if="message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean
  title: string
  message?: string
  type?: "success" | "warning" | "error" | "info"
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const alertTypeClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500"

    case "error":
      return "bg-red-500"

    case "info":
      return "bg-blue-500"

    case "warning":
    default:
      return "bg-yellow-600"
  }
})

const closeAlert = () => {
  emit("close")
}
</script>

<style scoped>
.alert {
  animation: slide-in 0.4s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>