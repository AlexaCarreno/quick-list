<template>
    <div class="relative inline-block" ref="container">
        <button class="p-2 rounded hover:bg-white/10" @click.stop="$emit('toggle')">
            ⋮
        </button>

        <div v-if="open"
            class="absolute right-0 top-full mt-2 w-40 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-50">
            <button v-for="action in actions" :key="action.label"
                class="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
                @click="handleAction(action)">
                {{ action.label }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
    open: boolean
    actions: {
        label: string
        onClick: () => void
    }[]
}>()

const emit = defineEmits(['toggle', 'close'])

const container = ref<HTMLElement | null>(null)

// Detectar click fuera
const handleClickOutside = (event: MouseEvent) => {
    if (!container.value) return

    if (!container.value.contains(event.target as Node)) {
        emit('close')
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
        } else {
            document.removeEventListener('click', handleClickOutside)
        }
    }
)

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const handleAction = (action: any) => {
    action.onClick()
    emit('close')
}
</script>
