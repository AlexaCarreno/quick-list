import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerSW";
import router from "./router";
import "./style.css";

const app = createApp(App);

// store and persistence pluguin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia); // register pinia stores
app.use(router); // register router

app.mount("#app");
