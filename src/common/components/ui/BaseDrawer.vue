<template>
    <div v-if="open" class="fixed inset-0 z-50">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- Desktop: Right drawer -->
        <div
            class="hidden md:block absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl overflow-y-auto">
            <slot />
        </div>

        <!-- Mobile: Bottom sheet -->
        <div
            class="md:hidden absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl max-h-[85vh] overflow-y-auto shadow-xl">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    (e: "close"): void
}>()

const close = () => emit("close")

// Cerrar con ESC
const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") emit("close")
}

onMounted(() => window.addEventListener("keydown", onKey))
onUnmounted(() => window.removeEventListener("keydown", onKey))
</script>
