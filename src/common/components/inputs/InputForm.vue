<template>
  <div class="base-input">
    <label v-if="label" :for="name" class="input-label">{{ label }}
      <span v-if="required" class="text-sky-500">*</span>
    </label>
    <input :id="name" :name="name" :type="type" :placeholder="placeholder" :value="modelValue" @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      " class="input-field" />
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  type?: "text" | "password" | "email";
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-label {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.input-field {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.input-error {
  color: #f87171;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
