<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('cancel')"
      />
      <div
        class="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl"
      >
        <!-- Ícono -->
        <div class="flex justify-center mb-4">
          <div
            class="size-12 rounded-full flex items-center justify-center text-xl"
            :class="
              variant === 'danger' ? 'bg-red-500/10' : 'bg-emerald-500/10'
            "
          >
            {{ variant === "danger" ? "⚠️" : "✅" }}
          </div>
        </div>

        <!-- Texto -->
        <h3 class="text-white text-base font-semibold text-center mb-1">
          {{ title }}
        </h3>
        <p class="text-slate-400 text-sm text-center mb-6">{{ message }}</p>

        <!-- Acciones -->
        <div class="flex gap-3">
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-white transition"
            @click="$emit('cancel')"
          >
            Cancelar
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
            :class="
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            "
            :disabled="loading"
            @click="$emit('confirm')"
          >
            <span
              v-if="loading"
              class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "danger" | "success";
  loading?: boolean;
}>();

defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>
