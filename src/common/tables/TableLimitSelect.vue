<template>
    <div class="flex items-center gap-2 text-sm text-slate-300">
        <span class="hidden sm:inline">Mostrar</span>

        <select v-model="model" class="
        bg-slate-800 border border-slate-700
        rounded px-2 py-1
        focus:ring-1 focus:ring-blue-500
      ">
            <option v-for="n in limits" :key="n" :value="n">
                {{ n }}
            </option>
        </select>
        <span class="hidden sm:inline">registros</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    modelValue: number
    limits?: number[]
}>()

const emit = defineEmits(["update:modelValue"])

const limits = props.limits ?? [10, 30, 50, 100]

const model = computed({
    get: () => props.modelValue,
    set: v => emit("update:modelValue", v)
})
</script>