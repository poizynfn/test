import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/LoginView.vue"),
            meta: { guestOnly: true },
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/RegisterView.vue"),
            meta: { guestOnly: true },
        },
        {
            path: "/",
            name: "home",
            component: () => import("@/views/HomeView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/room/create",
            name: "create-room",
            component: () => import("@/views/CreateRoomView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/room/join",
            name: "join-room",
            component: () => import("@/views/JoinRoomView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/room/:roomCode",
            name: "room",
            component: () => import("@/views/RoomView.vue"),
            meta: { requiresAuth: true },
        },

        {
            path: "/:pathMatch(.*)*",
            redirect: { name: "home" },
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: "login" };
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return { name: "home" };
    }
});

export default router;
