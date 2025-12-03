import { createRouter, createWebHistory } from "vue-router";
import routes from "@/utils/menu"
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
