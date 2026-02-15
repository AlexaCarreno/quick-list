<template>
  <div class="mt-6 overflow-auto rounded-lg border border-gray-700">
    <table class="min-w-full divide-y divide-gray-600 bg-gray-900 text-sm sm:text-base text-white">
      <thead class="bg-gray-800">
        <tr>
          <th class="px-4 py-3 text-left font-semibold text-blue-400 tracking-wider">
            <input type="checkbox" @change="toggleAll" :checked="allSelected" />
          </th>
          <th v-for="(col, i) in columns" :key="i"
            class="px-4 py-3 text-left font-semibold text-blue-400 tracking-wider">
            {{ col }}
          </th>
          <th class="px-4 py-3 text-left font-semibold text-blue-400 tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="row._id || i" class="hover:bg-gray-800 border-t border-gray-700 transition">
          <td class="px-4 py-2">
            <input type="checkbox" :value="row._id" v-model="selectedIds" @change="emitSelection" />
          </td>
          <td v-for="(col, j) in columns" :key="j" class="px-4 py-2 text-gray-200">
            {{ row[col] }}
          </td>
          <td class="px-4 py-2">

            <button class="text-blue-400 hover:text-blue-600" @click="emitEdit(row._id)" title="Editar">
              ✏️
            </button>
          </td>
        </tr>

        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + 2" class="px-4 py-3 text-center text-gray-400">
            No data available.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  columns: string[];
  rows: Record<string, any>[];
}>();

const emit = defineEmits<{
  (e: 'selectionChange', selectedIds: string[]): void;
  (e: 'editStudent', id: string): void;
}>();

const selectedIds = ref<string[]>([]);

const allSelected = computed(() =>
  props.rows.length > 0 &&
  props.rows.every((row) => selectedIds.value.includes(row._id))
);

function toggleAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  selectedIds.value = checked ? props.rows.map((r) => r._id) : [];
  emitSelection();
}

function emitSelection() {
  emit('selectionChange', selectedIds.value);
}

function emitEdit(id: string) {
  emit('editStudent', id);
}
</script>
