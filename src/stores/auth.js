import { ref, computed } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "watch_party_auth";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(null);
    const user = ref(null);

    const username = computed(() => (user.value ? user.value.username || user.value.email.split("@")[0] : ""));
    const isAuthenticated = computed(() => !!token.value);

    const setSession = (newToken, newUser) => {
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem(STORAGE_KEY);
    };

    const init = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            token.value = parsed.token;
            user.value = parsed.user;
        } catch (_) {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const fetchMe = async () => {
        if (!token.value) return false;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token.value}` },
            });

            if (!response.ok) {
                logout();
                return false;
            }

            const data = await response.json();
            user.value = data.user;
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token.value, user: data.user }));

            return true;
        } catch (_) {
            return false;
        }
    };

    return { token, user, username, isAuthenticated, setSession, logout, init, fetchMe };
});
