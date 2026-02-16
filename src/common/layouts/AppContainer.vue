<template>
  <div class="h-screen overflow-hidden flex bg-[#12151c] text-white">
    <!-- 📱 Header Mobile -->
    <MobileHeader v-if="isMobile" :header-name="appName" :name="user?.name!" :email="user?.email!" :avatar="userAvatar"
      :is-mobile="isMobile" @toggle-menu="isMobileMenuOpen = !isMobileMenuOpen" />
    <MobileDrawer v-if="isMobile" v-model="isMobileMenuOpen" />

    <!-- 🧭 Sidebar -->
    <Sidebar v-if="!isMobile" :header-name="appName" :name="user?.name!" :email="user?.email!" :avatar="userAvatar"
      v-model:is-sidebar-open="isSidebarOpen" v-model:is-mobile="isMobile"
      v-model:is-mobile-menu-open="isMobileMenuOpen" />

    <!-- 🧩 Contenido principal -->
    <main class="flex-1 transition-all duration-300 ease-in-out overflow-y-auto overscroll-none" :class="{
      'ml-0': isMobile,
      'ml-64': !isMobile && isSidebarOpen,
      'ml-16': !isMobile && !isSidebarOpen,
    }">
      <div class="pb-5 h-full" :class="{
        'pt-20': isMobile,
      }">
        <!-- 🔁 Aquí se inyectarán las vistas de tus rutas hijas -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Sidebar from "../../prueba/Sidebar.vue";
import MobileHeader from "../components/navbar/MobileHeader.vue";
import MobileDrawer from "../components/navbar/MobileDrawer.vue";
import { useUserStore } from "../stores/userStore";
import { config } from "../../config";

/* --- Estado --- */
const isSidebarOpen = ref(true);
const isMobile = ref(false);
const isMobileMenuOpen = ref(false);
const appName = ref("QuickList");

/* --- Detección de pantalla --- */
const handleResize = () => {
  const mobile = window.innerWidth < 768;
  isMobile.value = mobile;

  if (!mobile) {
    // Al pasar a desktop, cerrar el menú móvil
    isMobileMenuOpen.value = false;
  }
};

const { user } = useUserStore();

const userAvatar = computed(() => {
  // Retornar imagen si existe
  if (user?.photo) {
    return `${config.apiBaseUrl}${user.photo}`;
  }

  // Extraer iniciales: primera letra del nombre + primera letra del apellido
  const nameParts = user?.name?.split(" ") || [];
  const firstInitial = nameParts[0]?.[0] || "?";
  const lastInitial = nameParts[1]?.[0] || "?"; // si no hay apellido, usar ?

  const initials = (firstInitial + lastInitial).toUpperCase();

  // URL de ui-avatars.com
  const bgColor = "2563eb";
  const textColor = "fff";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=${bgColor}&color=${textColor}`;
});

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

watch(isMobileMenuOpen, (v) => console.log("mobile menu:", v));
</script>
