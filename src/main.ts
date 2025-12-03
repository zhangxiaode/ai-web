import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import { createPinia } from 'pinia'
const pinia = createPinia()
import NaiveUI from "naive-ui";

import "normalize.css/normalize.css";
import "virtual:uno.css";
import "@/styles/index.scss";
const app = createApp(App);
  app.use(pinia)
  .use(router)
  .use(NaiveUI)
  .mount("#app");



