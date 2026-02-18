<template>
  <!-- Overlay -->
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 bg-black/40 z-30" @click="close"></div>
  </transition>

  <!-- Drawer -->
  <transition name="slide">
    <aside v-if="modelValue"
      class="fixed top-0 left-0 bottom-0 w-64 z-40 flex flex-col bg-[#1a1d26] text-gray-100 shadow-xl border-r border-gray-800">
      <!-- Header (igual al mobile del sidebar) -->
      <div class="flex items-center h-16 justify-between p-3 border-b border-gray-800">
        <h2 class="text-lg font-semibold">Menu</h2>
        <button
          class="bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded-lg transition-all duration-200 active:scale-95"
          @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Menu (mismo estilo que desktop) -->
      <nav class="flex-1 p-2 py-5 space-y-2 overflow-y-auto">
        <RouterLink v-for="item in menuItems" :key="item.label" :to="item.path"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          active-class="bg-blue-600 hover:bg-blue-700" @click="close">
          <!-- Icono estilo desktop -->
          <div class="flex items-center justify-center w-8 h-8 bg-gray-700 text-sm font-semibold rounded flex-shrink-0">
            {{ item.label[0] }}
          </div>

          <span>
            {{ item.label }}
          </span>
        </RouterLink>
      </nav>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { useNavigation } from '../../composables/useNavigation';


const { menuItems } = useNavigation()

defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Scroll igual que desktop */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
