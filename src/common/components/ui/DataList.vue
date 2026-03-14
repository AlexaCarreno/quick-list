<template>
  <div class="md:bg-[#1a1d26] md:rounded-lg flex flex-col">
    <!-- HEADER -->
    <div
      class="hidden md:grid gap-x-6 px-6 py-3 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase flex-shrink-0"
      :style="{ gridTemplateColumns: gridTemplate }"
    >
      <span v-for="col in columns" :key="col.key">{{ col.label }}</span>
    </div>

    <!-- FILAS -->
    <ul role="list" class="md:divide-y md:divide-white/5">
      <li
        v-for="item in items"
        :key="item[idKey]"
        class="md:px-6 md:py-5 py-1.5 md:hover:bg-white/5 transition cursor-pointer"
        @click="emit('row-click', item)"
      >
        <div class="md:hidden">
          <slot name="mobile" :item="item" />
        </div>
        <div
          class="hidden md:grid gap-x-6 items-center"
          :style="{ gridTemplateColumns: gridTemplate }"
        >
          <div v-for="col in columns" :key="col.key" class="min-w-0">
            <slot :name="col.key" :item="item">
              <p class="text-sm text-slate-300 truncate">{{ item[col.key] }}</p>
            </slot>
          </div>
        </div>
      </li>
    </ul>

    <div
      v-if="!items || items.length === 0"
      class="px-6 py-10 text-center text-sm text-gray-500"
    >
      No hay registros
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[];
  columns: { label: string; key: string }[];
  gridTemplate: string;
  idKey: string;
}>();

const emit = defineEmits<{
  (e: "row-click", item: any): void;
}>();

defineSlots<{
  mobile(props: { item: any }): any;
  [key: string]: (props: { item: any }) => any;
}>();
</script>
