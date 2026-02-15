<template>
  <div class="flex justify-center gap-4 border-b border-gray-500 mt-4 pb-3">
    <button
      v-for="(tab, i) in tabs"
      :key="i"
      :class="[
        'border rounded-md hover:bg-blue-900',
        'py-2 px-3 text-sm sm:text-base',
        {
          'border-b-2 border-blue-400 bg-blue-900': currentTab === tab.value,
        },
      ]"
      @click="$emit('update:currentTab', tab.value)"
    >
      <component :is="tab.icon" class="inline-block mr-1" />
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentTab: string;
  tabs: { label: string; value: string; icon: any }[];
}>();
defineEmits(["update:currentTab"]);
</script>
