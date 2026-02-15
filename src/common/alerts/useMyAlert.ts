import { ref } from "vue";

export type AlertType = "success" | "warning" | "error" | "info";

const visible = ref(false);
const message = ref<string | undefined>("");
const title = ref("");
const type = ref<AlertType>("info");

const showAlert = (
  alertTitle: string,
  msg?: string,
  alertType: AlertType = "info"
) => {
  message.value = msg;
  type.value = alertType;
  title.value = alertTitle;
  visible.value = true;
};

const closeAlert = () => {
  visible.value = false;
};

export function useAlert() {
  return {
    visible,
    message,
    title,
    type,
    showAlert,
    closeAlert,
  };
}
