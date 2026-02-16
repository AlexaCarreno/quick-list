<template>
    <div class="bg-[#1a1d26] rounded-lg">

        <!-- Header (desktop) -->
        <div class="hidden md:grid gap-x-6 px-6 py-3 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase"
            :style="{ gridTemplateColumns: gridTemplate }">
            <span v-for="col in columns" :key="col.key">
                {{ col.label }}
            </span>
        </div>

        <!-- List -->
        <ul role="list" class="divide-y divide-white/5">
            <li v-for="item in items" :key="item[idKey]" class="px-6 py-5 hover:bg-white/5 transition cursor-pointer"
                @click="emit('row-click', item)">
                <!-- MOBILE -->
                <div class="md:hidden">
                    <!-- Mobile slot -->
                    <slot name="mobile" :item="item" />
                </div>

                <!-- DESKTOP -->
                <div class="hidden md:grid gap-x-6 items-center" :style="{ gridTemplateColumns: gridTemplate }">
                    <div v-for="col in columns" :key="col.key" class="min-w-0">
                        <!-- Column slot -->
                        <slot :name="col.key" :item="item">
                            <!-- Default renderer -->
                            <p class="text-sm text-slate-300 truncate">
                                {{ item[col.key] }}
                            </p>
                        </slot>
                    </div>
                </div>
            </li>
        </ul>

        <!-- Empty state -->
        <div v-if="!items || items.length === 0" class="px-6 py-10 text-center text-sm text-gray-500">
            No hay registros
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    items: any[]
    columns: { label: string; key: string }[]
    gridTemplate: string
    idKey: string
}>()

const emit = defineEmits<{
    (e: 'row-click', item: any): void
}>()
</script>
