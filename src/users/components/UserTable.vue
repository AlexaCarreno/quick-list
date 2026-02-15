<template>
  <!-- Desktop -->
  <div class="hidden md:block">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-gray-400 border-b border-gray-700">
          <th v-for="col in columns" :key="col.key" class="text-left p-2">
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-800 hover:bg-gray-800">
          <td v-for="col in columns" :key="col.key" class="p-2">
            {{}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile -->
  <div class="md:hidden space-y-3">
    <UserCard v-for="user in filteredUsers" :key="user.id" :user="user" :type="type" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserCard from "./UserCard.vue";
import { adminColumns, teacherColumns } from "./columns";

const props = defineProps<{
  type: "admins" | "teachers";
  search: string;
}>();

// Mock (luego store)
const users = [
  { id: 1, name: "Admin One", email: "a@test.com", role: "super" },
  { id: 2, name: "Teacher One", email: "t@test.com", subject: "Math" },
];

const columns = computed(() =>
  props.type === "admins" ? adminColumns : teacherColumns,
);

const filteredUsers = computed(() =>
  users.filter((u) =>
    u.name.toLowerCase().includes(props.search.toLowerCase()),
  ),
);
</script>
