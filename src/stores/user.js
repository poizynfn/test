import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";

export const useUserStore = defineStore("room", () => {
    const authStore = useAuthStore();
    return { username: authStore.username };
});
