<template>
  <div>
    <!-- Paso 1: Nombre, Apellidos y Fecha de nacimiento -->
    <StepOne v-if="currentStep === 1" :modelValue="registerform" @update:modelValue="(val) => (registerform = val)"
      @next="nextStep" />

    <!-- Paso 2: Correo, Contraseña y Confirmar Contraseña -->
    <StepTwo v-if="currentStep === 2" :modelValue="registerform" @update:modelValue="(val) => (registerform = val)"
      @submit="handleSubmitStepTwo" @previous="previousStep" />

    <!-- Paso 3: Código de Verificación -->
    <StepThree v-if="currentStep === 3" :modelValue="verificationForm"
      @update:modelValue="(val) => (verificationForm = val)" @submit="submitVerification" />
  </div>
</template>

<script setup lang="ts">
import { useRegister } from "../composables/useRegister";
import StepOne from "./StepOne.vue";
import StepThree from "./StepThree.vue";
import StepTwo from "./StepTwo.vue";

const {
  currentStep,
  nextStep,
  previousStep,
  registerform,
  verificationForm,
  handleSubmitStepTwo,
  submitVerification,
} = useRegister();

</script>

<style scoped>
/* Estilos opcionales */
</style>
