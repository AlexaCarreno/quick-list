<template>
  <div class="flex py-4 sm: border-b border-gray-700">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="$emit('update:modelValue', tab.value)"
      :class="[
        'px-4 py-2 text-sm',
        modelValue === tab.value
          ? 'border-b-2 border-blue-500 text-white'
          : 'text-gray-400',
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: "admins" | "teachers";
}>();

const tabs = [
  { label: "Admins", value: "admins" },
  { label: "Teachers", value: "teachers" },
];
</script>
