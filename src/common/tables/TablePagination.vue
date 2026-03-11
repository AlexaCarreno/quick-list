<template>
  <div
    class="flex items-center justify-between sm:justify-end gap-2 text-sm text-slate-300"
  >
    <button
      class="px-2 py-1 bg-slate-700 rounded disabled:opacity-40"
      :disabled="page === 1"
      @click="change(page - 1)"
    >
      ◀
    </button>

    <span class="text-slate-400"> {{ page }} / {{ totalPages }} </span>

    <button
      class="px-2 py-1 bg-slate-700 rounded disabled:opacity-40"
      :disabled="page === totalPages"
      @click="change(page + 1)"
    >
      ▶
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  page: number;
  total: number;
  limit: number;
}>();

const emit = defineEmits(["update:page"]);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.limit)),
);

const change = (p: number) => {
  emit("update:page", p);
};
</script>
