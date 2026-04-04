<template>
    <div class="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
        <span v-for="item in items" :key="item.label" class="flex items-center gap-1.5">
            <span :class="['w-5 h-5 rounded flex items-center justify-center font-bold text-xs', item.class]">
                {{ item.symbol }}
            </span>
            {{ item.label }}
        </span>
    </div>
</template>

<script setup lang="ts">
const items = [
    { symbol: 'P', label: 'Presente', class: 'bg-green-900/60 text-green-300 border border-green-700/50' },
    { symbol: 'A', label: 'Ausente', class: 'bg-red-900/60 text-red-300 border border-red-700/50' },
    { symbol: 'R', label: 'Retardo (0.5)', class: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50' },
    { symbol: 'J', label: 'Justificado', class: 'bg-blue-900/60 text-blue-300 border border-blue-700/50' },
    { symbol: '—', label: 'No aplica', class: 'bg-slate-700/60 text-slate-400 border border-slate-600/50' },
];
</script>