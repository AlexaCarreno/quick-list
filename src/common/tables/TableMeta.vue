<template>
    <div class="
      flex flex-col gap-2
      sm:flex-row
      sm:items-center
      sm:justify-between
      mb-2
    ">
        <!-- LIMIT -->
        <TableLimitSelect v-model="limit" />

        <!-- PAGINATION -->
        <TablePagination :page="page" :total="total" :limit="limit" @update:page="$emit('update:page', $event)" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import TableLimitSelect from "./TableLimitSelect.vue"
import TablePagination from "./TablePagination.vue"

const props = defineProps<{
    page: number
    total: number
    limit: number
}>()

const emit = defineEmits([
    "update:limit",
    "update:page"
])

const limit = computed({
    get: () => props.limit,
    set: v => emit("update:limit", v)
})
</script>