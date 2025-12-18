import App from './App.vue'
import router from "./router"
import NaiveUI from "naive-ui";

import "normalize.css/normalize.css";
import "virtual:uno.css";
import "@/styles/index.scss";
const app = createApp(App);
  app.use(createPinia())
  .use(router)
  .use(NaiveUI)
  .mount("#app");



