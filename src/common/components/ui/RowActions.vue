<template>
  <div class="relative inline-block" ref="container">
    <button
      class="p-2 ml-2 rounded hover:bg-white/10"
      @click.stop="$emit('toggle')"
    >
      ⋮
    </button>

    <div
      v-if="open"
      class="fixed w-40 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-50"
      :style="dropdownStyle"
    >
      <button
        v-for="action in actions"
        :key="action.label"
        class="w-full text-center px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
  actions: { label: string; onClick: () => void }[];
}>();

const emit = defineEmits(["toggle", "close"]);
const container = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const updatePosition = async () => {
  await nextTick();
  const btn = container.value?.querySelector("button");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.top + rect.height / 2}px`,
    right: `${window.innerWidth - rect.left}px`,
    transform: "translateY(-50%)",
  };
};

const handleClickOutside = (e: MouseEvent) => {
  if (!container.value?.contains(e.target as Node)) {
    emit("close");
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      updatePosition();
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleAction = (action: any) => {
  action.onClick();
  emit("close");
};
</script>
