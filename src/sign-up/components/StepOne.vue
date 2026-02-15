<template>
  <form @submit.prevent="handleSubmit">
    <!-- Título -->
    <h2 class="text-3xl text-blue-400 text-center mb-6">Registrarse</h2>

    <!-- name -->
    <InputForm
      v-model="form.name"
      name="name"
      label="Nombres"
      type="text"
      :required="true"
    />

    <!-- lastName -->
    <InputForm
      v-model="form.lastName"
      name="lastName"
      label="Apellidos"
      type="text"
      :required="true"
    />

    <!-- birthdate -->
    <DatePicker v-model="form.birthdate" :required="true" />

    <!-- botón -->
    <ButtonForm class="mb-2 mt-3" type="submit">Siguiente paso</ButtonForm>

    <!-- Enlace a login -->
    <div class="mt-6 text-center text-sm text-gray-300">
      ¿Ya tienes una cuenta?
      <RouterLink
        to="/sign-in"
        class="text-blue-400 hover:underline hover:text-blue-300 transition"
      >
        Acceder
      </RouterLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ButtonForm from "../../common/components/inputs/ButtonForm.vue";
import DatePicker from "../../common/components/inputs/DatePicker.vue";
import InputForm from "../../common/components/inputs/InputForm.vue";
import type { IRegisterData } from "../interfaces/register.interface";

// Props y emits para v-model y navegación
const props = defineProps<{ modelValue: IRegisterData }>();
const emit = defineEmits(["update:modelValue", "next", "alert"]);

// Computed para trabajar con v-model en objeto
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isFormValid = computed(
  () =>
    form.value.name.trim() !== "" &&
    form.value.lastName.trim() !== "" &&
    form.value.birthdate !== undefined
);

const handleSubmit = () => {
  if (!isFormValid.value) {
    emit("alert", "Todos los campos son obligatorios");
    return;
  }
  emit("update:modelValue", form.value); // asegúrate de emitir el modelo actualizado
  emit("next"); // avanzar al siguiente paso
};
</script>

<style scoped></style>
