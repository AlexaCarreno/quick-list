<template>
  <div class="relative p-2 border-t border-gray-800">
    <div
      class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
      @click="toggleUserMenu"
      data-user-toggle
    >
      <img :src="avatar" class="w-8 h-8 rounded-full object-cover" />

      <span
        v-show="computedOpen"
        class="font-medium truncate transition-all duration-300 ease-in-out"
      >
        <p class="text-sm font-semibold text-white">{{ name }}</p>
        <p class="text-xs text-gray-400">{{ email }}</p>
      </span>

      <svg
        v-if="computedOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 ml-auto"
        :class="{ 'rotate-180': isUserMenuOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <UserDropdown
      :isUserMenuOpen="isUserMenuOpen"
      :computedOpen="computedOpen"
      ref="userMenuRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import UserDropdown from "./UserDropdown.vue";

defineProps({
  name: String,
  email: String,
  avatar: String,
  computedOpen: Boolean,
});

const isUserMenuOpen = ref(false);
const userMenuRef = ref();

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const userMenu = userMenuRef.value?.$el;
  const userButton = document.querySelector("[data-user-toggle]");

  if (!isUserMenuOpen.value || !userMenu || !userButton) return;

  if (userMenu.contains(target) || userButton.contains(target)) return;

  isUserMenuOpen.value = false;
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
