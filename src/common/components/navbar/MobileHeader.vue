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

  <MyModal v-model:open="logoutModal" size="sm">
    <div class="text-center space-y-4">
      <h2 class="text-lg font-semibold">Confirmar cierre de sesión</h2>

      <p class="text-gray-400 text-sm">
        ¿Estás seguro de que quieres cerrar tu sesión?
      </p>

      <div class="flex justify-center gap-3 mt-4">
        <button
          @click="logoutModal = false"
          class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          Cancelar
        </button>

        <button
          @click="handleLogout"
          class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </MyModal>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import HamburgerButton from "./HamburgerButton.vue";
import UserAvatarMenu from "./UserAvatarMenu.vue";
import { useLogout } from "../../composables/useLogout";
import MyModal from "../modals/MyModal.vue";

defineProps({
  headerName: { type: String, required: true },
  isMobile: { type: Boolean, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, required: true },
});

const logoutModal = ref(false);

const emit = defineEmits(["toggle-menu"]);

const { logout } = useLogout();

const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const handleUserAction = async (action: "profile" | "settings" | "logout") => {
  if (action === "logout") {
    logoutModal.value = true;
  }

  if (action === "profile") {
    console.log("navigate to profile");
  }
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

const handleLogout = async () => {
  await logout();
  logoutModal.value = false;
};

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
