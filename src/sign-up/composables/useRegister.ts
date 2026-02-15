import { ref } from "vue";
import type {
  IRegisterData,
  ISignUpVerification,
} from "../interfaces/register.interface";

import { useUserStore } from "../../common/stores/userStore";
import { useAuthStore } from "../../common/stores/authStore";
import { apiFetch } from "../../api/api-client";
import type { AlertType } from "../../common/alerts/useMyAlert";
import { useRouter } from "vue-router";

export const useRegister = (
  handleAlert: (title: string, msg?: string, type?: AlertType) => void
) => {
  /* stores */
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const router = useRouter();

  //----------- properties -----------//
  // Control del paso actual
  const currentStep = ref(1);

  // Datos del registro inicial
  const registerform = ref<IRegisterData>({
    name: "",
    lastName: "",
    birthdate: null,
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Datos del paso 3 (verificación)
  const verificationForm = ref<ISignUpVerification>({
    email: "",
    code: "",
  });

  //---------------- methods--------------//
  // siguiente paso
  const nextStep = () => {
    currentStep.value++;
  };

  // paso anterior
  const previousStep = () => {
    currentStep.value--;
  };

  // Llamado a la API cuando se completa el paso 2
  const handleSubmitStepTwo = async () => {
    try {
      const { passwordConfirm, ...dataToSend } = registerform.value;
      // Simular envío a la API
      const result = await apiFetch("/user-signup/step-one", {
        method: "POST",
        body: JSON.stringify({ ...dataToSend }),
      });

      if (!result.success) {
        let message = result.error?.message || "Error al procesar el registro";
        handleAlert(`${message} ❌`);
        return;
      }

      handleAlert("Registro Exitoso ✅");
      // Guardar el correo para el paso 3
      verificationForm.value.email = registerform.value.email;

      // Avanzar al paso 3
      nextStep();
    } catch (error) {
      console.error("Error al registrar:", error);
      handleAlert("ℹ️ Ocurrio un error, por favor intenta nuevamente. ");
    }
  };

  // Enviar código de verificación (paso 3)
  const submitVerification = async () => {
    try {
      // Aquí deberías llamar a la API para validar el código
      const result = await apiFetch("/user-signup/step-two", {
        method: "PATCH",
        body: JSON.stringify(verificationForm.value),
      });

      if (!result.success) {
        let message = result.error?.message || "Error al procesar el codigo.";
        handleAlert(`${message} ❌`);
        userStore.cleanUser();
        router.push({ name: "register" });
        return;
      }

      const { accessToken } = result.data;

      authStore.setAccessToken(accessToken);
      handleAlert("Codigo verificado exitosamente ✅");

      const myResult = await apiFetch(`/user/me`, {
        method: "GET",
      });

      if (!myResult.success) {
        let message =
          myResult.error?.message ||
          "Ocurrio un error al obtener la informacion del usuario.";
        handleAlert(`${message} ❌`);
        return;
      }

      userStore.setUser(myResult.data.user);

      handleAlert("Bienvenido a QuickList ✅");

      await new Promise((resolve) => setTimeout(resolve, 700));

      router.push({ name: "Groups" });
    } catch (error) {
      handleAlert("ℹ️ Ocurrio un error inesperado.");
    }
  };

  return {
    // properties
    registerform,
    verificationForm,
    currentStep,

    // methods
    nextStep,
    previousStep,
    handleSubmitStepTwo,
    submitVerification,
  };
};
