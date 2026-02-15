<template>
  <form @submit.prevent="emitLogin">
    <!-- Título -->
    <h2 class="text-3xl text-blue-400 text-center mb-6">Iniciar sesión</h2>

    <!-- email input -->
    <InputForm
      v-model="email"
      name="email"
      label="Correo electronico"
      type="email"
      placeholder="ejemplo@dominio.com"
      :required="true"
      :error="errors.email"
    />

    <!-- password -->
    <InputForm
      v-model="password"
      name="password"
      label="Contraseña"
      type="password"
      placeholder="********"
      :required="true"
      :error="errors.password"
    />

    <ButtonForm class="mb-2 mt-3" type="submit">Acceder</ButtonForm>

    <!-- Enlace a registro -->
    <div class="mt-6 text-center text-sm text-gray-300">
      ¿Necesitas una cuenta?
      <RouterLink
        to="/sign-up"
        class="text-blue-400 hover:underline hover:text-blue-300 transition"
      >
        Regístrate
      </RouterLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputForm from "../../common/components/inputs/InputForm.vue";
import ButtonForm from "../../common/components/inputs/ButtonForm.vue";

const email = ref<string>("");
const password = ref<string>("");

const errors = ref({
  email: "",
  password: "",
});

const emit = defineEmits<{
  (e: "submit", payload: { email: string; password: string }): void;
}>();

const emitLogin = () => {
  // limpiar errores
  errors.value.email = "";
  errors.value.password = "";

  let isValid = true;

  // validar email
  if (!email.value.trim()) {
    errors.value.email = "El correo es obligatorio";
    isValid = false;
  }

  // validar password
  if (!password.value.trim()) {
    errors.value.password = "La contraseña es obligatoria";
    isValid = false;
  }

  // si hay errores, NO emitir
  if (!isValid) return;

  emit("submit", {
    email: email.value,
    password: password.value,
  });
};
</script>

<style scoped></style>
