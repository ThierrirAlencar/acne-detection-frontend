<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { loginService, registerUserService } from "@/api/services/authService";

type AuthMode = "login" | "signup";

type FeedbackType = "error" | "success" | null;

const isOpen = ref(false);
const mode = ref<AuthMode>("login");
const isSubmitting = ref(false);
const feedback = ref<{ type: FeedbackType; message: string } | null>(null);

function openAuthModal(nextMode: AuthMode = "login") {
    mode.value = nextMode;
    feedback.value = null;
    isOpen.value = true;
    document.body.classList.add("overflow-hidden");
}

function closeAuthModal() {
    isOpen.value = false;
    feedback.value = null;
    document.body.classList.remove("overflow-hidden");
}

function showLoginForm() {
    mode.value = "login";
    feedback.value = null;
}

function showSignupForm() {
    mode.value = "signup";
    feedback.value = null;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && isOpen.value) {
        closeAuthModal();
    }
}

onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.body.classList.remove("overflow-hidden");
});

async function handleLoginSubmit(event: Event) {
    event.preventDefault();

    if (isSubmitting.value) return;

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("login-email") ?? "").trim();
    const password = String(formData.get("login-password") ?? "");

    if (!email || !password) {
        feedback.value = {
            type: "error",
            message: "Preencha e-mail e senha para continuar.",
        };
        return;
    }

    try {
        isSubmitting.value = true;
        feedback.value = null;

        const user = await loginService({ email, password });
        console.log("Login realizado com sucesso:", user);

        closeAuthModal();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível realizar o login.";
        feedback.value = {
            type: "error",
            message,
        };
    } finally {
        isSubmitting.value = false;
    }
}

async function handleSignupSubmit(event: Event) {
    event.preventDefault();

    if (isSubmitting.value) return;

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const username = String(formData.get("signup-name") ?? "").trim();
    const email = String(formData.get("signup-email") ?? "").trim();
    const password = String(formData.get("signup-password") ?? "").trim();

    if (!username || !email || !password) {
        feedback.value = {
            type: "error",
            message: "Preencha nome, e-mail e senha para criar a conta.",
        };
        return;
    }

    if (password.length < 8) {
        feedback.value = {
            type: "error",
            message: "A senha deve ter pelo menos 8 caracteres.",
        };
        return;
    }

    try {
        isSubmitting.value = true;
        feedback.value = null;

        const created = await registerUserService({ username, email, password });

        if (!created) {
            throw new Error("Não foi possível criar a conta no momento.");
        }

        feedback.value = {
            type: "success",
            message: "Conta criada com sucesso! Agora você pode entrar.",
        };
        showLoginForm();
        form.reset();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível criar a conta.";
        feedback.value = {
            type: "error",
            message,
        };
    } finally {
        isSubmitting.value = false;
    }
}

defineExpose({
    openAuthModal,
    closeAuthModal,
    showLoginForm,
    showSignupForm,
});
</script>
<template>
    <div
        v-show="isOpen"
        id="auth-modal"
        class="fixed inset-0 z-100"
        :aria-hidden="!isOpen"
        @click.self="closeAuthModal"
    >
        <div
            id="auth-backdrop"
            class="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
            @click="closeAuthModal"
        ></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
            <div
                id="auth-dialog"
                class="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/20"
            >

                <button
                    id="auth-close"
                    type="button"
                    class="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Fechar"
                    @click="closeAuthModal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

            <div class="p-7 sm:p-9">

                <!-- Brand -->
                <div class="mb-8">
                    <div class="mb-5 flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
                            <span class="font-mono text-xs font-bold text-white">C</span>
                        </div>

                        <span class="font-semibold tracking-tight text-gray-900">
                            ClearFace
                        </span>
                    </div>

                    <div v-if="mode === 'login'" id="login-heading">
                        <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                            ClearFace Account
                        </p>

                        <h2 class="text-2xl font-semibold tracking-tight text-gray-900">
                            Bem-vindo de volta.
                        </h2>

                        <p class="mt-2 text-sm leading-relaxed text-gray-500">
                            Entre na sua conta para continuar acompanhando suas análises.
                        </p>
                    </div>

                    <div v-else id="signup-heading">
                        <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                            ClearFace Account
                        </p>

                        <h2 class="text-2xl font-semibold tracking-tight text-gray-900">
                            Crie sua conta.
                        </h2>

                        <p class="mt-2 text-sm leading-relaxed text-gray-500">
                            Comece a acompanhar seus resultados com o ClearFace.
                        </p>
                    </div>
                </div>

                <div v-if="feedback" class="mb-4 rounded-xl border px-3 py-2 text-sm" :class="feedback.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'">
                    {{ feedback.message }}
                </div>

                <form
                    v-if="mode === 'login'"
                    id="login-form"
                    class="space-y-5"
                    @submit="handleLoginSubmit"
                >
                    <div>
                        <label for="login-email" class="mb-2 block text-sm font-medium text-gray-700">
                            E-mail
                        </label>

                        <input
                            id="login-email"
                            name="login-email"
                            type="email"
                            autocomplete="email"
                            placeholder="seu@email.com"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                        />
                    </div>

                    <div>
                        <div class="mb-2 flex items-center justify-between">
                            <label for="login-password" class="block text-sm font-medium text-gray-700">
                                Senha
                            </label>

                            <button type="button" class="text-xs text-gray-400 transition hover:text-gray-900">
                                Esqueceu a senha?
                            </button>
                        </div>

                        <input
                            id="login-password"
                            name="login-password"
                            type="password"
                            autocomplete="current-password"
                            placeholder="••••••••"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                        />
                    </div>

                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {{ isSubmitting ? "Entrando..." : "Entrar" }}
                    </button>
                </form>

                <form
                    v-else
                    id="signup-form"
                    class="space-y-5"
                    @submit="handleSignupSubmit"
                >
                    <div>
                        <label for="signup-name" class="mb-2 block text-sm font-medium text-gray-700">
                            Nome
                        </label>

                        <input
                            id="signup-name"
                            name="signup-name"
                            type="text"
                            autocomplete="name"
                            placeholder="Seu nome"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                        />
                    </div>

                    <div>
                        <label for="signup-email" class="mb-2 block text-sm font-medium text-gray-700">
                            E-mail
                        </label>

                        <input
                            id="signup-email"
                            name="signup-email"
                            type="email"
                            autocomplete="email"
                            placeholder="seu@email.com"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                        />
                    </div>

                    <div>
                        <label for="signup-password" class="mb-2 block text-sm font-medium text-gray-700">
                            Senha
                        </label>

                        <input
                            id="signup-password"
                            name="signup-password"
                            type="password"
                            autocomplete="new-password"
                            placeholder="Mínimo de 8 caracteres"
                            minlength="8"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
                        />
                    </div>

                    <label class="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            required
                            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />

                        <span class="text-xs leading-relaxed text-gray-500">
                            Concordo com os termos de uso e a <a href="https://www.termsfeed.com/live/7405937e-2e88-4825-beea-8ca6418ed0d7" target="_blank" rel="noopener noreferrer">política de privacidade</a> do ClearFace.
                        </span>
                    </label>

                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {{ isSubmitting ? "Criando conta..." : "Criar conta" }}
                    </button>
                </form>

                <!-- Divider -->
                <div class="my-7 flex items-center gap-4">
                    <div class="h-px flex-1 bg-gray-200"></div>

                    <span class="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                        ou
                    </span>

                    <div class="h-px flex-1 bg-gray-200"></div>
                </div>

                <div class="text-center text-sm text-gray-500">
                    <span v-if="mode === 'login'" id="login-switch">
                        Ainda não possui uma conta?
                        <button
                            type="button"
                            id="show-signup"
                            class="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-500"
                            @click="showSignupForm"
                        >
                            Criar conta
                        </button>
                    </span>

                    <span v-else id="signup-switch">
                        Já possui uma conta?
                        <button
                            type="button"
                            id="show-login"
                            class="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-500"
                            @click="showLoginForm"
                        >
                            Entrar
                        </button>
                    </span>
                </div>

                <!-- Security note -->
                <div class="mt-7 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-9V7a4 4 0 00-8 0v3h8z"/>
                    </svg>

                    Conexão segura
                </div>

            </div>
        </div>
        </div>
    </div>
</template>