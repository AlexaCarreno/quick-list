<template>
  <div class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <div class="flex-1 min-h-0 flex flex-col">
      <GroupList
        class="flex-1 min-h-0"
        :groups="groups"
        :total="total"
        :loading="loading"
        @query-change="fetchGroups"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import GroupList from "../components/GroupList.vue";
import { useGroups } from "../composables/useGroups";

const { groups, total, loading, fetchGroups } = useGroups();

onMounted(() => fetchGroups());
</script>
