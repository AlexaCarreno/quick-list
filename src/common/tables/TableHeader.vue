<template>
  <div
    class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3"
  >
    <!-- SEARCH AREA -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
      <!-- filtro -->
      <select
        v-model="localFilter"
        class="bg-slate-800 border border-slate-700 text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
      >
        <option
          v-for="option in filters"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- input -->
      <input
        v-model="localSearch"
        placeholder="Buscar..."
        class="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 w-full sm:w-80"
      />

      <!-- botón buscar -->
      <span
        class="bg-blue-600 px-3 py-2 rounded flex items-center justify-center sm:w-auto w-full"
      >
        🔍
      </span>
    </div>

    <!-- ACTION BUTTON -->
    <div class="flex md:justify-end">
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
