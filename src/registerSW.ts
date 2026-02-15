import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log(
      "⚡ Nueva versión disponible. Refresca la página para actualizar."
    );
  },
  onOfflineReady() {
    console.log("📴 La app está lista para usarse sin conexión.");
  },
});
