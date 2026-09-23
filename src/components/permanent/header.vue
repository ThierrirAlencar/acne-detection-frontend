<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import MarketingBanner from '../banners/marketingBanner.vue';
    import Sidebar from '@/components/permanent/sidebar.vue';
    import MobileOverlay from '@/components/overlays/mobile_overlay.vue';
    import AuthenticationModal from '@/components/modals/authenticationModal.vue';
    import { handleCreateAppointments } from '@/api/services/appointmentsService';
    import {
        AUTH_STATE_CHANGED_EVENT,
        getAuthenticatedUser,
        logoutUser,
        type AuthenticatedUser,
    } from '@/api/services/authService';

    type AuthModalHandle = {
        openAuthModal: (mode?: 'login' | 'signup') => void;
    };

    type SidebarHandle = {
        refreshAppointments: () => Promise<void>;
    };

    const authModalRef = ref<AuthModalHandle | null>(null);
    const sidebarRef = ref<SidebarHandle | null>(null);
    const authenticatedUser = ref<AuthenticatedUser | null>(null);
    const router = useRouter();
    const isCreatingAppointment = ref(false);

    function refreshAuthState() {
        authenticatedUser.value = getAuthenticatedUser();
    }

    function openLoginModal() {
        authModalRef.value?.openAuthModal('login');
    }

    function handleLogout() {
        logoutUser();
    }

    async function createAppointment() {
        if (!authenticatedUser.value || isCreatingAppointment.value) {
            if (!authenticatedUser.value) {
                openLoginModal();
            }
            return;
        }

        try {
            isCreatingAppointment.value = true;
            const appointment = await handleCreateAppointments();

            await router.push({
                name: 'home',
                query: { appointment_id: String(appointment.id) },
            });
            await sidebarRef.value?.refreshAppointments();
        } catch (error) {
            console.error('Could not create appointment', error);
        } finally {
            isCreatingAppointment.value = false;
        }
    }

    function hideSidebar() {
        document.getElementById('default-sidebar')?.classList.add('-translate-x-full');
        document.getElementById('sidebar-overlay')?.classList.add('hidden');
    }

    function showSidebar() {
        document.getElementById('default-sidebar')?.classList.remove('-translate-x-full');
        document.getElementById('sidebar-overlay')?.classList.remove('hidden');
    }

    onMounted(() => {
        refreshAuthState();
        window.addEventListener(AUTH_STATE_CHANGED_EVENT, refreshAuthState);
    });

    onBeforeUnmount(() => {
        window.removeEventListener(AUTH_STATE_CHANGED_EVENT, refreshAuthState);
    });
</script>

<template>
    <AuthenticationModal ref="authModalRef" />
    <Sidebar ref="sidebarRef" @close="hideSidebar" @new-chat="createAppointment" />
    <MobileOverlay @click="hideSidebar" />
    <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">

        <div class="flex h-16 items-center justify-between px-4 sm:px-6">

            <div class="flex items-center gap-3">

                <button
                    id="open-sidebar"
                    type="button"
                    class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    aria-label="Abrir menu"
                    @click="showSidebar"
                >
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>


                <div>

                    <div class="flex items-center gap-2">
<!-- 
                        <h2 class="text-sm font-bold sm:text-base">
                            Visão Computacional 
                        </h2> -->

                    </div>

                    <p class="hidden text-xs text-gray-500 sm:block">
                        Assistente de análise dermatológica desenvolvida por alunos do IFCE Campus Cedro entre os anos de 2024 e 2026 através do programa de bolsas de iniciação científica (PIBIC Jr)!
                    </p>

                </div>

            </div>


            <div class="flex items-center gap-2">

                <button
                    id="clear-chat"
                    type="button"
                    class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-wait disabled:opacity-50"
                    :disabled="isCreatingAppointment"
                    @click="createAppointment"
                >
                    {{ isCreatingAppointment ? 'Criando conversa...' : 'Nova conversa' }}
                </button>

                <div v-if="authenticatedUser" class="flex items-center gap-2">
                    <span class="hidden text-sm font-medium text-gray-700 sm:inline">
                        Olá, {{ authenticatedUser.username }}
                    </span>

                    <button
                        id="logout-button"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                        @click="handleLogout"
                    >
                        Logout
                    </button>
                </div>

                <div v-if="!authenticatedUser" class="group relative">
                    <button
                        id="login-button"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                        aria-describedby="login-as-user-tooltip"
                        @click="openLoginModal"
                    >
                        Login
                    </button>

                    <span
                        id="login-as-user-tooltip"
                        role="tooltip"
                        class="pointer-events-none absolute right-0 top-full z-30 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                        mantenha suas consultas salvas
                    </span>
                </div>
                


            </div>
        </div>
        
        <!-- ================================================= -->
        <!-- MARKETING BANNER -->
        <!-- ================================================= -->

        <MarketingBanner></MarketingBanner>
    </header>
    
</template>
