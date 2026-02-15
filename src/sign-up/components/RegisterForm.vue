<template>
  <div>
    <!-- Paso 1: Nombre, Apellidos y Fecha de nacimiento -->
    <StepOne
      v-if="currentStep === 1"
      :modelValue="registerform"
      @update:modelValue="(val) => (registerform = val)"
      @alert="handleAlert"
      @next="nextStep"
    />

    <!-- Paso 2: Correo, Contraseña y Confirmar Contraseña -->
    <StepTwo
      v-if="currentStep === 2"
      :modelValue="registerform"
      @update:modelValue="(val) => (registerform = val)"
      @submit="handleSubmitStepTwo"
      @previous="previousStep"
    />

    <!-- Paso 3: Código de Verificación -->
    <StepThree
      v-if="currentStep === 3"
      :modelValue="verificationForm"
      @update:modelValue="(val) => (verificationForm = val)"
      @submit="submitVerification"
    />
  </div>
</template>

<script setup lang="ts">
import { useAlert } from "../../common/alerts/useMyAlert"; // Ajusta ruta según corresponda
import { useRegister } from "../composables/useRegister";
import StepOne from "./StepOne.vue";
import StepThree from "./StepThree.vue";
import StepTwo from "./StepTwo.vue";

const alert = useAlert();

const handleAlert = (message: string) => {
  alert.showAlert(message);
};

const {
  currentStep,
  nextStep,
  previousStep,
  registerform,
  verificationForm,
  handleSubmitStepTwo,
  submitVerification,
} = useRegister(handleAlert);
</script>

<style scoped>
/* Estilos opcionales */
</style>
