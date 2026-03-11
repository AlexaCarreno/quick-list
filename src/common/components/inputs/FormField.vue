<template>
  <div class="flex flex-col gap-1">
    <label class="text-xs font-medium text-slate-400 uppercase tracking-wide">
      {{ label }}
      <span v-if="required" class="text-blue-400 ml-0.5">*</span>
    </label>
    <slot />
    <p v-if="error" class="text-xs text-red-400 mt-0.5">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  required?: boolean;
  error?: string;
}>();
</script>
