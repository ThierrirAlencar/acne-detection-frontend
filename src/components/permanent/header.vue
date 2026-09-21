<script setup>
    import MarketingBanner from '../banners/marketingBanner.vue';
    import Sidebar from '@/components/permanent/sidebar.vue';
</script>

<template>
    <Sidebar />
    <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">

        <div class="flex h-16 items-center justify-between px-4 sm:px-6">

            <div class="flex items-center gap-3">

                <button
                    id="open-sidebar"
                    type="button"
                    class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                    aria-label="Abrir menu"
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

                        <h2 class="text-sm font-bold sm:text-base">
                            ClearFace LM
                        </h2>

                        <span
                            class="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700"
                        >
                            ONLINE
                        </span>

                    </div>

                    <p class="hidden text-xs text-gray-500 sm:block">
                        Assistente de análise dermatológica
                    </p>

                </div>

            </div>


            <div class="flex items-center gap-2">

                <div class="group relative">

                    <button
                        id="clear-chat"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                        aria-describedby="clear-chat-tooltip"
                    >
                        Limpar conversa
                    </button>

                    <span
                        id="clear-chat-tooltip"
                        role="tooltip"
                        class="pointer-events-none absolute right-0 top-full z-30 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                        criar novo chat
                </span>
                </div>
                <div class="group relative">
                    <button
                        id="login-button"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                        aria-describedby="login-as-user-tooltip"
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
