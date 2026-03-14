<template>
  <div class="flex items-center justify-between mb-2 text-sm text-slate-400">
    <!-- Total registros -->
    <span>{{ total }} registro{{ total !== 1 ? "s" : "" }}</span>

    <!-- Limit + Paginación -->
    <div class="flex items-center gap-2">
      <TableLimitSelect v-model="limit" />
      <button
        class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
        :disabled="page === 1"
        @click="$emit('update:page', page - 1)"
      >
        ‹
      </button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button
        class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition"
        :disabled="page === totalPages"
        @click="$emit('update:page', page + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TableLimitSelect from "./TableLimitSelect.vue";

const props = defineProps<{
  page: number;
  total: number;
  limit: number;
}>();

const emit = defineEmits(["update:limit", "update:page"]);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.limit)),
);

const limit = computed({
  get: () => props.limit,
  set: (v) => emit("update:limit", v),
});
</script>
