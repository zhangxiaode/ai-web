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
                component: () => import("../views/home/index.vue")
            },
            { // 音频提取、视频剪辑、格式工厂: 视频格式、音频格式、图片格式
                path: "tools",
                name: "tools",
                component: () => import("../views/tools/index.vue"),
                children: [
                    {
                        path: "audio_extraction",
                        name: "audio_extraction",
                        component: () => import("../views/tools/audio_extraction.vue")
                    },
                    {
                        path: "video_editing",
                        name: "video_editing",
                        component: () => import("../views/tools/video_editing.vue")
                    },
                    {
                        path: "format_factory",
                        name: "format_factory",
                        component: () => import("../views/tools/format_factory.vue"),
                        children: [
                            {
                                path: "format_image",
                                name: "format_image",
                                component: () => import("../views/tools/format_image.vue")
                            },
                            {
                                path: "format_audio",
                                name: "format_audio",
                                component: () => import("../views/tools/format_audio.vue")
                            },
                            {
                                path: "format_video",
                                name: "format_video",
                                component: () => import("../views/tools/format_video.vue")
                            },
                        ]
                    },
                ]
            },
            { // 音色管理、音效管理、物品管理
                path: "assets",
                name: "assets",
                component: () => import("../views/assets/index.vue"),
                children: [
                    {
                        path: "voice",
                        name: "voice",
                        component: () => import("../views/assets/voice.vue")
                    },
                    {
                        path: "sound",
                        name: "sound",
                        component: () => import("../views/assets/sound.vue")
                    },
                    {
                        path: "thing",
                        name: "thing",
                        component: () => import("../views/assets/thing.vue")
                    },
                ]
            },
            { // 角色管理、场景管理、物品管理、剧集管理-分镜管理
                path: "project",
                name: "project",
                component: () => import("../views/project/index.vue"),
                children: [
                    {
                        path: "character",
                        name: "character",
                        component: () => import("../views/project/character.vue")
                    },
                    {
                        path: "scene",
                        name: "scene",
                        component: () => import("../views/project/scene.vue")
                    },
                    {
                        path: "thing",
                        name: "thing",
                        component: () => import("../views/project/thing.vue")
                    },
                    {
                        path: "chapter",
                        name: "chapter",
                        component: () => import("../views/project/chapter.vue"),
                        children: [
                            {
                                path: "shot",
                                name: "shot",
                                component: () => import("../views/project/shot.vue")
                            },
                        ]
                    },
                ]
            },
            {
                path: "recharge",
                name: "recharge",
                component: () => import("../views/recharge/index.vue")
            },
            { // 充值记录、消耗记录、绑定微信、修改手机号修改密码、修改用户名、退出登录
                path: "account",
                name: "account",
                component: () => import("../views/account/index.vue"),
                children: [
                    {
                        path: "topup",
                        name: "topup",
                        component: () => import("../views/account/topup.vue")
                    },
                    {
                        path: "consume",
                        name: "consume",
                        component: () => import("../views/account/consume.vue")
                    },
                    {
                        path: "bind_wechat",
                        name: "bind_wechat",
                        component: () => import("../views/account/bind_wechat.vue")
                    },
                    {
                        path: "reset_phone",
                        name: "reset_phone",
                        component: () => import("../views/account/reset_phone.vue")
                    },
                    {
                        path: "reset_password",
                        name: "reset_password",
                        component: () => import("../views/account/reset_password.vue")
                    },
                    {
                        path: "reset_nickname",
                        name: "reset_nickname",
                        component: () => import("../views/account/reset_nickname.vue")
                    },
                ]
            },
            {
                path: "about",
                name: "about",
                component: () => import("../views/about/index.vue")
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login.vue")
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
