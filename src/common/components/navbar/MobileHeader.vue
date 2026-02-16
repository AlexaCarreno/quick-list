<template>
  <!-- 📱 Header Mobile - Solo visible en mobile -->
  <header
    v-if="isMobile"
    class="fixed top-0 left-0 right-0 z-[100] bg-[#1a1d26] border-b border-gray-800 shadow-lg"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 🔘 Botón hamburguesa -->
      <hamburger-button @toggle="emit('toggle-menu')" />

      <!-- 🎨 Logo y nombre de la app -->
      <div class="flex items-center gap-2">
        <img src="/quickBlue.png" alt="Logo" class="w-8 h-8" />
        <h1 class="text-lg font-semibold text-white">{{ headerName }}</h1>
      </div>

      <!-- 👤 Avatar del usuario con dropdown -->
      <UserAvatarMenu
        :avatar="avatar"
        :name="name"
        :email="email"
        @action="handleUserAction"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import HamburgerButton from "./HamburgerButton.vue";
import UserAvatarMenu from "./UserAvatarMenu.vue";

defineProps({
  headerName: { type: String, required: true },
  isMobile: { type: Boolean, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
});

const emit = defineEmits(["toggle-menu"]);

const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const handleUserAction = (action: string) => {
  console.log(`User action: ${action}`);
  isUserMenuOpen.value = false;
};

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const userMenu = userMenuRef.value;
  const userButton = document.querySelector("[data-user-toggle]");

  if (!isUserMenuOpen.value || !userMenu || !userButton) return;

  if (userMenu.contains(target) || userButton.contains(target)) {
    return;
  }

  isUserMenuOpen.value = false;
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
