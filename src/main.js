import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useVideoStore } from "./stores/video";
import { useAuthStore } from "./stores/auth";

document.title = import.meta.env.VITE_APP_NAME;

const app = createApp(App);

app.use(createPinia());

useAuthStore().init();

app.use(router);

app.mount("#app");

router.afterEach(() => useVideoStore().$reset());
