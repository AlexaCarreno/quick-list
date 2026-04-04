<template>
    <div class="flex gap-2 mb-6">
        <button
            v-for="tab in [{ key: 'group', label: 'Por Grupo' }, { key: 'student', label: 'Por Estudiante' }]"
            :key="tab.key"
            @click="$emit('change', tab.key as 'group' | 'student')"
            :class="[
                'px-5 py-2 rounded-lg text-sm font-semibold border transition-all',
                activeTab === tab.key
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-transparent border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white',
            ]"
        >
            {{ tab.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{ activeTab: 'group' | 'student' }>();
defineEmits<{ (e: 'change', tab: 'group' | 'student'): void }>();
</script>