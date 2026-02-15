<template>
  <div class="dashboard text-gray-100">
    <!-- 👋 Encabezado -->
    <header class="mb-8">
      <h2 class="text-xl font-semibold text-gray-100 mb-1">
        Hola, {{ userName }}
      </h2>
      <p class="text-gray-400 text-sm">
        Aquí tienes una vista general del estado actual del sistema.
      </p>
    </header>

    <!-- 📊 Bloque unificado de métricas -->
    <section
      class="metrics-grid bg-[#1a1d26] border border-gray-700 rounded-2xl p-6 shadow-lg grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-700"
    >
      <div
        v-for="card in systemStats"
        :key="card.label"
        class="flex flex-col items-center justify-center p-3 hover:bg-[#1f2230] transition-colors cursor-pointer"
      >
        <span class="text-sm text-gray-400 mb-1">{{ card.label }}</span>
        <span class="text-3xl font-bold text-blue-400">{{ card.value }}</span>
      </div>
    </section>

    <!-- 🕒 Estado del sistema -->
    <section
      class="mt-8 bg-[#1a1d26] border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h3 class="text-lg font-semibold text-blue-400 mb-1">
          Estado del sistema
        </h3>
        <p class="text-gray-400 text-sm">
          Última actualización:
          <span class="text-gray-300">{{ lastUpdated }}</span>
        </p>
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 shadow-md"
        @click="refreshData"
      >
        Actualizar
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 🧑‍💻 Mock temporal
const userName = ref("Andrés");

interface SystemStat {
  label: string;
  value: number;
}

const systemStats = ref<SystemStat[]>([
  { label: "Grupos activos", value: 12 },
  { label: "Grupos inactivos", value: 4 },
  { label: "Total de estudiantes", value: 128 },
  { label: "Asistencias hoy", value: 93 },
]);

const lastUpdated = ref(new Date().toLocaleString());

function refreshData() {
  lastUpdated.value = new Date().toLocaleString();
  console.log("🔄 Datos actualizados (mock)");
}

onMounted(() => {
  console.log("✅ Dashboard montado");
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 📱 Ajustes móviles */
@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
  }
}
</style>
