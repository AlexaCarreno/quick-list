<!-- src/common/components/ui/MobileCard.vue -->
<template>
  <div
    class="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/70 transition"
    @click="$emit('click')"
  >
    <!-- Lado izquierdo: avatar + contenido -->
    <div class="flex gap-3 flex-1 min-w-0">
      <!-- Avatar slot -->
      <div class="flex-shrink-0">
        <slot name="avatar" />
      </div>

      <!-- Contenido -->
      <div class="min-w-0 flex-1">
        <!-- Título -->
        <slot name="title" />

        <!-- Líneas de info -->
        <slot name="info" />

        <!-- Estado -->
        <div class="mt-1">
          <slot name="status" />
        </div>
      </div>
    </div>

    <!-- Lado derecho: acciones -->
    <div class="flex-shrink-0" @click.stop>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: "click"): void }>();
</script>
