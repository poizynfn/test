<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { renderGoogleButton } from "@/composables/googleAuth";
import IconMain from "@/components/icons/IconMain.vue";

const router = useRouter();
const authStore = useAuthStore();

const errorMessage = ref("");
const isLoading = ref(false);

const form = ref({
    email: "",
    password: "",
});

const googleButton = ref(null);

const handleGoogleCredential = async (credential) => {
    errorMessage.value = "";
    isLoading.value = true;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
        });

        const data = await response.json();

        if (data.message !== "success") {
            errorMessage.value = data.message;
            return;
        }

        authStore.setSession(data.token, data.user);
        router.push("/");
    } catch (_) {
        errorMessage.value = "An error occurred. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    renderGoogleButton(googleButton.value, handleGoogleCredential);
});

const login = async () => {
    errorMessage.value = "";

    if (!form.value.email || !form.value.password) {
        errorMessage.value = "Please fill in all fields.";
        return;
    }

    isLoading.value = true;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.value),
        });

        const data = await response.json();

        if (data.message !== "success") {
            errorMessage.value = data.message;
            return;
        }

        authStore.setSession(data.token, data.user);
        router.push("/");
    } catch (_) {
        errorMessage.value = "An error occurred. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center max-w-sm mx-auto h-screen">
        <div class="flex flex-col items-center gap-3">
            <IconMain />
            <h1 class="font-bold text-3xl text-center">Log In</h1>
        </div>

        <form class="mt-8 flex flex-col items-stretch justify-center gap-4 w-full" @submit.prevent="login">
            <input class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-zinc-800 text-white" type="email" name="email" placeholder="Email" autocomplete="email" required v-model="form.email" />
            <input class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-zinc-800 text-white" type="password" name="password" placeholder="Password" autocomplete="current-password" required v-model="form.password" />

            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

            <button type="submit" class="bg-white text-black px-4 py-1.5 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all ease-in-out duration-100" :class="{ 'cursor-not-allowed bg-opacity-50': isLoading }" :disabled="isLoading">Log In</button>
        </form>

        <div class="flex items-center gap-3 w-full my-5">
            <div class="flex-1 h-px bg-gray-600"></div>
            <span class="text-gray-400 text-sm">OR</span>
            <div class="flex-1 h-px bg-gray-600"></div>
        </div>

        <div ref="googleButton"></div>

        <p class="mt-6 text-sm text-gray-400">
            Don't have an account?
            <RouterLink :to="{ name: 'register' }" class="text-blue-400 hover:underline">Sign Up</RouterLink>
        </p>
    </div>
</template>
