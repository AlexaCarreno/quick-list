<template>
    <div class="relative flex items-center gap-3 p-3 border-b border-gray-800">
        <img src="/quickBlue.png" class="w-10 h-10" />

        <h1 v-if="computedOpen" class="text-xl font-semibold whitespace-nowrap">
            {{ headerName }}
        </h1>

        <button
            class="absolute -right-3 top-1/1 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded-full shadow-md border border-gray-700 transition-all hover:scale-105 active:scale-95 z-30"
            @click="$emit('toggleSidebar')">
            <svg v-if="isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>

            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps({
    headerName: String,
    isSidebarOpen: Boolean,
    computedOpen: Boolean,
});
</script>