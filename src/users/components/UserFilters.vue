<template>
  <div class="flex gap-2">
    <input
      :value="modelValue"
      placeholder="Search..."
      class="w-full md:w-80 px-3 py-2 rounded bg-gray-800 border border-gray-700"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
</script>
