<template>
  <div class="flex flex-col h-full min-h-0 pl-5 pr-5 sm:pt-3 md:p-5 text-white">
    <div class="flex-1 min-h-0 flex flex-col">
      <StudentList
        class="flex-1 min-h-0"
        :students="students"
        :total="total"
        :loading="loading"
        @query-change="fetchStudents"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import StudentList from "../components/StudentList.vue";
import { useStudents } from "../useStudents";

const { students, total, loading, fetchStudents } = useStudents();

onMounted(() => fetchStudents());
</script>
