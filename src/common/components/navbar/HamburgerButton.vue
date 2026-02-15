<template>
  <button
    class="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-lg transition-all duration-200 active:scale-95"
    @click="$emit('toggle')"
    aria-label="Toggle menu"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits(["toggle"]);
</script>
