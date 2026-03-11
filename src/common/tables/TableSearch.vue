<template>
    <div class="flex items-center gap-2 mb-3">

        <!-- filtro -->
        <select v-model="localFilter"
            class="bg-slate-800 border border-slate-700 text-sm rounded px-3 py-2 focus:ring-1 focus:ring-blue-500">
            <option v-for="option in filters" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <!-- input -->
        <input v-model="localSearch" placeholder="Buscar..."
            class="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm w-72 focus:ring-1 focus:ring-blue-500"
            @keyup.enter="emitSearch" />

        <!-- botón -->
        <button class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded" @click="emitSearch">
            🔍
        </button>

    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

interface FilterOption {
    label: string
    value: string
}

const props = defineProps<{
    search: string
    filter: string
    filters: FilterOption[]
}>()

const emit = defineEmits([
    "update:search",
    "update:filter",
    "search"
])

const localSearch = ref(props.search)
const localFilter = ref(props.filter)

watch(localSearch, v => emit("update:search", v))
watch(localFilter, v => emit("update:filter", v))

const emitSearch = () => emit("search")
</script>