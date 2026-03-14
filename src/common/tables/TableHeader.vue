<template>
  <div class="flex flex-col gap-3 mb-3">
    <!-- Fila: filtro + buscador + botón acción -->
    <div class="flex items-center gap-2">
      <select
        v-model="localFilter"
        class="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 flex-shrink-0"
      >
        <option
          v-for="option in filters"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <input
        v-model="localSearch"
        placeholder="Buscar..."
        class="flex-1 md:max-w-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
      />

      <span
        class="bg-blue-600 px-3 py-2 rounded-lg flex items-center justify-center flex-shrink-0"
      >
        🔍
      </span>

      <!-- Botón acción en desktop va en la misma fila -->
      <div class="hidden md:flex md:flex-1 md:justify-end">
        <slot name="actions" />
      </div>
    </div>

    <!-- Botón acción en mobile va en su propia fila -->
    <div class="flex md:hidden">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface FilterOption {
  label: string;
  value: string;
}

const props = defineProps<{
  search: string;
  filter: string;
  filters: FilterOption[];
}>();

const emit = defineEmits(["update:search", "update:filter"]);

const localSearch = ref(props.search);
const localFilter = ref(props.filter);

watch(localSearch, (v) => emit("update:search", v));
watch(localFilter, (v) => emit("update:filter", v));
</script>
