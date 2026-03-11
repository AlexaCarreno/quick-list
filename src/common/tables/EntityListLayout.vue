<template>
  <div
    class="flex flex-col h-full min-h-0 gap-3 md:gap-4"
    :class="$attrs.class"
  >
    <!-- Header -->
    <div class="flex-shrink-0">
      <TableHeader
        v-model:search="search"
        v-model:filter="filter"
        :filters="filters"
      >
        <template #actions>
          <!-- El padre inyecta su botón de acción (ej: "Nuevo Teacher") -->
          <slot name="header-actions" />
        </template>
      </TableHeader>

      <TableMeta
        v-model:limit="limit"
        :page="page"
        :total="total"
        @update:page="page = $event"
      />
    </div>

    <!-- TABLE SCROLL -->
    <div class="overflow-auto">
      <DataList
        :items="items"
        :columns="columns"
        :grid-template="gridTemplate"
        :id-key="idKey"
        @row-click="onRowClick"
      >
        <!-- Mobile card: el padre define cómo se ve la card mobile -->
        <template #mobile="{ item }">
          <slot name="mobile" :item="item" :open-detail="openDetail" />
        </template>

        <!-- Re-exponer todos los slots de columnas dinámicamente -->
        <template v-for="col in columns" #[col.key]="{ item }" :key="col.key">
          <slot :name="col.key" :item="item" />
        </template>
      </DataList>
    </div>
  </div>

  <!-- Drawer -->
  <BaseDrawer :open="drawerOpen" @close="closeDrawer">
    <slot name="drawer" :item="selectedItem" :close="closeDrawer" />
  </BaseDrawer>
</template>

<script setup lang="ts" generic="T extends { [key: string]: any }">
import { watchDebounced } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import DataList from "../components/ui/DataList.vue";
import BaseDrawer from "../components/ui/BaseDrawer.vue";
import TableHeader from "./TableHeader.vue";
import TableMeta from "./TableMeta.vue";

/* -----------------------------------------------------
 * Props / Emits
 * --------------------------------------------------- */
interface FilterOption {
  label: string;
  value: string;
}

interface Column {
  label: string;
  key: string;
}

// filterMap convierte el valor del filtro al key de query que espera el backend
// ej: { name: "name", email: "email", documentNumber: "documentNumber" }
type FilterMap = Record<string, string>;

const props = defineProps<{
  items: T[];
  total: number;
  loading?: boolean;
  columns: Column[];
  gridTemplate: string;
  idKey?: string;
  filters: FilterOption[];
  filterMap?: FilterMap;
  defaultFilter?: string;
}>();

const emit = defineEmits<{
  (e: "query-change", query: Record<string, any>): void;
  (e: "row-click", item: T): void;
}>();

/* -----------------------------------------------------
 * State
 * --------------------------------------------------- */
const search = ref("");
const filter = ref(props.defaultFilter ?? props.filters[0]?.value ?? "");
const page = ref(1);
const limit = ref(10);
const offset = computed(() => (page.value - 1) * limit.value);

const selectedItem = ref<T | null>(null);
const drawerOpen = ref(false);

const idKey = computed(() => props.idKey ?? "_id");

/* -----------------------------------------------------
 * Drawer
 * --------------------------------------------------- */
const openDetail = (item: T) => {
  selectedItem.value = item;
  drawerOpen.value = true;
};

const closeDrawer = () => {
  drawerOpen.value = false;
  selectedItem.value = null;
};

/* -----------------------------------------------------
 * Row click
 * --------------------------------------------------- */
const onRowClick = (item: T) => {
  // Emite hacia arriba Y abre drawer por defecto.
  // El padre puede ignorar el evento si no necesita drawer.
  emit("row-click", item);
  openDetail(item);
};

/* -----------------------------------------------------
 * Query builder
 * --------------------------------------------------- */
const emitQuery = () => {
  const query: Record<string, any> = {
    offset: offset.value,
    limit: limit.value,
  };

  if (search.value) {
    const key = props.filterMap?.[filter.value] ?? filter.value;
    query[key] = search.value;
  }

  emit("query-change", query);
};

/* -----------------------------------------------------
 * Watchers
 * --------------------------------------------------- */
watch([page, limit], () => emitQuery());

watch(filter, () => {
  page.value = 1;
  emitQuery();
});

watchDebounced(
  search,
  () => {
    page.value = 1;
    emitQuery();
  },
  { debounce: 400 },
);
</script>
