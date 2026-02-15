<template>
  <div class="relative">
    <!-- Avatar -->
    <button
      ref="buttonRef"
      @click="toggleMenu"
      class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-blue-500 transition-colors duration-200 active:scale-95"
    >
      <img :src="avatar" alt="User" class="w-8 h-8 rounded-full object-cover" />
    </button>

    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
      >
        <!-- User info -->
        <div class="px-4 py-3 border-b border-gray-700">
          <p class="text-sm font-semibold text-white">{{ name }}</p>
          <p class="text-xs text-gray-400">{{ email }}</p>
        </div>

        <!-- Profile -->
        <a
          href="#"
          class="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
          @click.prevent="select('profile')"
        >
          Profile
        </a>

        <div class="border-t border-gray-700"></div>

        <!-- Logout -->
        <a
          href="#"
          class="flex items-center px-4 py-3 hover:bg-gray-700 text-red-400 transition-colors"
          @click.prevent="select('logout')"
        >
          Logout
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useUserMenu } from "../../layouts/useAvatarMenus";

defineProps({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
});

const emit = defineEmits<{
  (e: "action", value: "profile" | "settings" | "logout"): void;
}>();

const { isOpen, toggleMenu, menuRef, buttonRef } = useUserMenu();

function select(action: "profile" | "settings" | "logout") {
  emit("action", action);
  isOpen.value = false;
}

// Cerrar al hacer click fuera
function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;

  if (
    isOpen.value &&
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(target) &&
    !buttonRef.value.contains(target)
  ) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
