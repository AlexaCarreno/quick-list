<template>
  <div
    class="min-h-screen bg-[#0a0f1a] text-white flex flex-col items-center justify-center p-6"
  >
    <div
      class="max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start bg-[#12182f] rounded-2xl p-8 md:p-16"
    >
      <!-- Texto principal -->
      <div class="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
        <h1
          class="text-7xl md:text-9xl font-bold text-blue-400 mb-6 select-none"
        >
          404
        </h1>
        <h2 class="text-3xl md:text-5xl text-gray-300 mb-4 font-semibold">
          Página no encontrada
        </h2>
        <p class="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
          Lo sentimos, la página que estás buscando no existe o fue movida. Por
          favor regresa para continuar.
        </p>
      </div>

      <!-- Botón para volver -->
      <div class="md:w-1/2 flex justify-center md:justify-start">
        <button
          @click="goBack"
          class="bg-blue-400 hover:bg-blue-500 transition-colors text-[#0a0f1a] font-bold px-8 py-4 rounded-2xl text-lg shadow-lg"
        >
          Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const goBack = () => {
  // Si el usuario está autenticado
  if (authStore.isAuthenticated) {
    // Intentar volver a la anterior
    if (window.history.length > 1) {
      router.back();
    } else {
      // No hay historial, ir a home o dashboard
      router.push({ name: "Groups" });
    }
  } else {
    // Usuario no autenticado: llevar al login
    router.push({ name: "login" });
  }
};
</script>
