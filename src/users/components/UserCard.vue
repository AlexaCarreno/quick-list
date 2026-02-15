<template>
  <div class="bg-gray-800 rounded-lg p-3 space-y-1">
    <div class="font-medium">{{ user.name }}</div>
    <div class="text-sm text-gray-400">{{ user.email }}</div>

    <div v-if="type === 'admins'" class="text-sm">Role: {{ user.role }}</div>

    <div v-if="type === 'teachers'" class="text-sm">
      Subject: {{ user.subject }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: any;
  type: "admins" | "teachers";
}>();
</script>
