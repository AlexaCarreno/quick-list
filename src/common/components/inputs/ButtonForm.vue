<template>
  <button
    :type="type"
    class="w-full py-2 px-6 bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-[#0a0f1a] font-bold rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}>();
</script>
