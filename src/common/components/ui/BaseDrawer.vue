<template>
  <Teleport to="body">
    <Transition name="fade-overlay">
      <div v-if="open" class="fixed inset-0 z-50">
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        />

        <!-- Desktop: Right drawer -->
        <Transition name="slide-right">
          <div
            v-if="open"
            class="hidden md:block absolute right-0 top-0 h-full w-full max-w-xl bg-gray-900 shadow-xl overflow-y-auto"
          >
            <slot />
          </div>
        </Transition>

        <!-- Mobile: Bottom sheet -->
        <Transition name="slide-up">
          <div
            v-if="open"
            class="md:hidden absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl max-h-[85vh] overflow-y-auto shadow-xl"
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

defineProps<{ open: boolean }>();

const emit = defineEmits<{ (e: "close"): void }>();
const close = () => emit("close");

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<style scoped>
/* Overlay */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* Desktop: desliza desde la derecha */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Mobile: sube desde abajo */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
