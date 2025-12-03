const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/layout/home",
    },
    {
        path: "/layout",
        name: "layout",
        redirect: "/layout/home",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("../views/home.vue")
            },
            {
                path: "introduction",
                name: "introduction",
                component: () => import("../views/introduction.vue")
            },
            {
                path: "product",
                name: "product",
                component: () => import("../views/product.vue")
            },
            {
                path: "about",
                name: "about",
                component: () => import("../views/about.vue")
            }
        ]
    },
    {
        path: "/error",
        name: "error",
        component: () => import("../views/error.vue")
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/error"
    }
]
export default routes
