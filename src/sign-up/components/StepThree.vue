<template>
  <form @submit.prevent="handleSubmit">
    <p class="text-blue-400 text-center mb-6">
      Revisa tu correo electronico, recibiras un codigo de verificacion.
    </p>

    <InputForm
      v-model="form.code"
      name="code"
      label="Ingrese el codigo"
      type="text"
      :required="true"
    />

    <!-- button -->
    <ButtonForm class="mb-2 mt-3" type="submit" :disabled="isDisabled"
      >Verificar</ButtonForm
    >
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ButtonForm from "../../common/components/inputs/ButtonForm.vue";
import InputForm from "../../common/components/inputs/InputForm.vue";
import type { ISignUpVerification } from "../interfaces/register.interface";

const isDisabled = ref(true);

// Props y emits para v-model
const props = defineProps<{ modelValue: ISignUpVerification }>();
const emit = defineEmits(["update:modelValue", "submit"]);

// Computed para trabajar con v-model
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const validateCode = () => {
  const code = form.value.code?.trim();
  return /^[a-zA-Z0-9]{6}$/.test(code); // 6 caracteres alfanuméricos exactos
};

watch(
  form,
  () => {
    isDisabled.value = !validateCode();
  },
  { deep: true },
);

const handleSubmit = () => {
  console.log("codigo verificacion: ", form.value.code);
  emit("submit", form.value); // Envía la solicitud al servidor
};
</script>
