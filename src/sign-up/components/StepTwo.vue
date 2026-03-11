<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="text-3xl text-blue-400 text-center mb-6">Paso 2</h2>

    <!-- email input -->
    <InputForm v-model="form.email" name="email" label="Correo Electrónico" type="email" :required="true" />

    <!-- password input -->
    <InputForm v-model="form.password" name="password" label="Contraseña" type="password" :required="true" />

    <!-- password confirm input -->
    <InputForm v-model="form.passwordConfirm" name="passwordConfirm" label="Confirmar Contraseña" type="password"
      :required="true" />

    <!-- button -->
    <div class="flex space-x-2">
      <ButtonForm class="mb-2 mt-3" type="button" @click="previousStep">Paso anterior</ButtonForm>
      <ButtonForm class="mb-2 mt-3" type="submit" :disabled="isSubmitDisabled">Siguiente paso</ButtonForm>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputForm from "../../common/components/inputs/InputForm.vue";
import ButtonForm from "../../common/components/inputs/ButtonForm.vue";
import { useAlert } from "../../common/alerts/useMyAlert";

const { showAlert } = useAlert()

const isSubmitDisabled = ref(true);

// Props y emits para v-model y navegación
const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue", "next", "previous"]);

// Computed para trabajar con v-model en objeto
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Validar formulario
const validateForm = () => {
  const { email, password, passwordConfirm } = form.value;
  return email && password && passwordConfirm && password === passwordConfirm;
};

// Observamos los cambios en el formulario para validar el estado del submit
watch(
  form,
  () => {
    isSubmitDisabled.value = !validateForm(); // Desactivar el botón si la validación falla
  },
  { deep: true },
);

const handleSubmit = () => {
  const { email, password, passwordConfirm } = form.value;

  // Validar campos requeridos
  if (!email || !password || !passwordConfirm) {
    showAlert("Por favor, complete todos los campos.", undefined, "warning");
    return; // Detener la ejecución si falta algún campo
  }

  // Validar que las contraseñas coincidan
  if (password !== passwordConfirm) {
    showAlert("Las contraseñas no coinciden.", undefined, "error");
    return; // Detener la ejecución si las contraseñas no coinciden
  }

  // Si pasa todas las validaciones, avanzamos al siguiente paso
  emit("update:modelValue", form.value); // Emitir el modelo actualizado
  emit("next"); // Avanzar al siguiente paso
};

const previousStep = () => {
  emit("previous");
};
</script>
