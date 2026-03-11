<template>
  <div class="h-screen overflow-hidden flex bg-[#12151c] text-white">
    <!-- 📱 Header Mobile -->
    <MobileHeader
      v-if="isMobile"
      :header-name="appName"
      :name="user?.name!"
      :email="user?.email!"
      :avatar="userAvatar"
      :is-mobile="isMobile"
      @toggle-menu="isMobileMenuOpen = !isMobileMenuOpen"
    />
    <MobileDrawer v-if="isMobile" v-model="isMobileMenuOpen" />

    <!-- 🧭 Sidebar -->
    <Sidebar
      v-if="!isMobile"
      :header-name="appName"
      :name="user?.name!"
      :email="user?.email!"
      :avatar="userAvatar"
      v-model:is-sidebar-open="isSidebarOpen"
      v-model:is-mobile="isMobile"
      v-model:is-mobile-menu-open="isMobileMenuOpen"
    />

    <!-- 🧩 Contenido principal -->
    <main
      class="flex-1 transition-all duration-300 ease-in-out overflow-hidden min-h-0"
      :class="{
        'ml-0': isMobile,
        'ml-64': !isMobile && isSidebarOpen,
        'ml-16': !isMobile && !isSidebarOpen,
      }"
    >
      <div
        class="pb-4 md:pb-0 h-full flex flex-col min-h-0"
        :class="{
          'pt-20': isMobile,
        }"
      >
        <!-- 🔁 Aquí se inyectarán las vistas de tus rutas hijas -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Sidebar from "../../common/components/ui/sidebar/Sidebar.vue";
import MobileDrawer from "../components/navbar/MobileDrawer.vue";
import MobileHeader from "../components/navbar/MobileHeader.vue";
import { useUserStore } from "../stores/userStore";
import { getAvatarUrl } from "../utils/avatar";

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

const userAvatar = computed(() =>
  getAvatarUrl(user?.photo, user?.name, user?.lastName),
);

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

watch(isMobileMenuOpen, (v) => console.log("mobile menu:", v));
</script>
