import { ref } from "vue";

export type AlertType = "success" | "warning" | "error" | "info";

const visible = ref(false);
const message = ref<string | undefined>("");
const title = ref("");
const type = ref<AlertType>("info");

let timer: number | undefined;

const showAlert = (
  alertTitle: string,
  msg?: string,
  alertType: AlertType = "info",
) => {
  title.value = alertTitle;
  message.value = msg;
  type.value = alertType;
  visible.value = true;

  if (timer) clearTimeout(timer);

  timer = window.setTimeout(() => {
    closeAlert();
  }, 2000);
};

const closeAlert = () => {
  visible.value = false;
  message.value = ""
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
