import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";
import "./registerSW";

const app = createApp(App);

// store and persistence pluguin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia); // register pinia stores
app.use(router); // register router
app.mount("#app");
