<template>
  <div>
    <!-- 🧭 Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-full flex flex-col bg-[#1a1d26] text-gray-100 shadow-xl transition-all duration-300 ease-in-out',

      // MOBILE → overlay con transform, sin header ni footer de usuario
      isMobile
        ? [
          'w-64 z-40',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        ]
        : // DESKTOP → layout sin transform, con header y footer
        ['z-40 justify-between', isSidebarOpen ? 'w-64' : 'w-16'],
    ]">
      <!-- 🔝 Header - SOLO EN DESKTOP -->
      <div v-if="!isMobile" class="relative flex items-center gap-3 p-3 border-b border-gray-800">
        <img src="/quickBlue.png" alt="Logo" class="w-10 h-10" />
        <h1 v-if="computedOpen" class="text-xl font-semibold whitespace-nowrap">
          {{ headerName }}
        </h1>

        <!-- 📌 Botón para colapsar (solo desktop) -->
        <button
          class="absolute -right-3 top-1/1 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded-full shadow-md border border-gray-700 transition-all hover:scale-105 active:scale-95 z-30"
          @click="toggleSidebar" aria-label="Toggle sidebar" type="button">
          <svg v-if="isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-200" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 📋 Menú principal -->
      <nav class="flex-1 p-2 py-5 space-y-2 overflow-y-auto overflow-hidden" :class="{ 'justify-center': !isMobile }">
        <RouterLink v-for="item in menuItems" :key="item.label" :to="item.path"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          active-class="bg-blue-600 hover:bg-blue-700" @click="handleMenuClick">
          <div class="flex items-center justify-center w-8 h-8 bg-gray-700 text-sm font-semibold rounded flex-shrink-0">
            {{ item.label[0] }}
          </div>
          <span v-show="computedOpen" class="transition-all duration-300 ease-in-out">
            {{ item.label }}
          </span>
        </RouterLink>
      </nav>

      <!-- 👤 Usuario - SOLO EN DESKTOP -->
      <div v-if="!isMobile" class="relative p-2 border-t border-gray-800">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer" @click="toggleUserMenu"
          data-user-toggle>
          <img :src="avatar" alt="User" class="w-8 h-8 rounded-full object-cover" />
          <span v-show="computedOpen" class="font-medium truncate transition-all duration-300 ease-in-out">
            <p class="text-sm font-semibold text-white">{{ name }}</p>
            <p class="text-xs text-gray-400">{{ email }}</p>
          </span>
          <svg v-if="computedOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto"
            :class="{ 'rotate-180': isUserMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- 📂 Dropdown flotante - SOLO EN DESKTOP -->
        <transition name="fade">
          <div v-if="isUserMenuOpen" ref="userMenuRef" :class="[
            'absolute bottom-full mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden transition-all duration-300',
            computedOpen ? 'left-2 w-60' : 'left-2 w-48',
          ]" style="z-index: 60">
            <!-- 👤 Perfil -->
            <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </a>

            <!-- 🧭 Separador -->
            <div class="border-t border-gray-700 my-1"></div>

            <!-- 🚪 Cerrar sesión -->
            <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </a>
          </div>
        </transition>
      </div>
    </aside>

    <!-- 🧩 Overlay (mobile) -->
    <div v-if="isMobile && isMobileMenuOpen" class="fixed inset-0 bg-black/40 z-30" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { usePermissionStore } from "../common/stores/permissionsStore";

const permissionStore = usePermissionStore();

const props = defineProps({
  headerName: { type: String, required: true },
  isSidebarOpen: { type: Boolean, default: true },
  isMobile: { type: Boolean, default: false },
  isMobileMenuOpen: { type: Boolean, default: false },
  name: { type: String, required: true, default: "username" },
  email: { type: String, required: true, default: "e-mail" },
  avatar: { type: String, required: false },
});

const emit = defineEmits([
  "update:isSidebarOpen",
  "update:isMobile",
  "update:isMobileMenuOpen",
]);

const isSidebarOpen = ref(props.isSidebarOpen);
const isMobileMenuOpen = ref(props.isMobileMenuOpen);
const isMobile = ref(props.isMobile);
const isUserMenuOpen = ref(false);

// 🔗 Referencia al contenedor del menú desplegable
const userMenuRef = ref<HTMLElement | null>(null);

watch(isSidebarOpen, (val) => emit("update:isSidebarOpen", val));
watch(isMobile, (val) => emit("update:isMobile", val));
watch(isMobileMenuOpen, (val) => emit("update:isMobileMenuOpen", val));

const allMenuItems = [
  {
    label: "Groups",
    path: "/groups",
    resource: "groups",
    action: "read",
  },
  {
    label: "Users",
    path: "/users",
    resource: "users",
    action: "read",
  },
];

const menuItems = computed(() => {
  return allMenuItems.filter((item) =>
    permissionStore.can(item.resource, item.action),
  );
});

const handleResize = () => {
  const mobile = window.innerWidth < 768;
  isMobile.value = mobile;

  if (!mobile) {
    // Al pasar a desktop
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("mousedown", handleClickOutside);
});

const computedOpen = computed(() => {
  return isMobile.value ? isMobileMenuOpen.value : isSidebarOpen.value;
});

const toggleSidebar = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  } else {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const toggleUserMenu = () => (isUserMenuOpen.value = !isUserMenuOpen.value);

const handleMenuClick = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = false;
  }
};

// 🧠 Detectar clics fuera del menú
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const userMenu = userMenuRef.value;
  const userButton = document.querySelector("[data-user-toggle]");

  // Si no hay menú abierto, nada que hacer
  if (!isUserMenuOpen.value || !userMenu || !userButton) return;

  // Si clic dentro del dropdown o dentro del botón -> no cerrar
  if (userMenu.contains(target) || userButton.contains(target)) {
    return;
  }

  // Clic fuera → cerrar menú
  isUserMenuOpen.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

[v-show] {
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

[v-show="false"] {
  opacity: 0;
  transform: translateX(-10px);
}

.router-link-active {
  background-color: #2563eb;
  /* azul */
  color: white;
}

/* Scroll personalizado */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
