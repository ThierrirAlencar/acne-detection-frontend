<template>
    <!-- ========================================================= -->

    <!-- SIDEBAR -->

    <!-- ========================================================= -->

    <aside
        id="default-sidebar"
        class="sidebar-transition fixed left-0 top-0 z-40 flex h-screen w-64 -translate-x-full flex-col border-r border-gray-200 bg-gray-100 md:translate-x-0"
        aria-label="Navegação principal"
    >

    <!-- Sidebar header -->

    <div class="flex h-20 items-center border-b border-gray-200 px-5">

        <div>
            <h1 class="text-xl font-bold tracking-tight">
                ClearFace
            </h1>

            <p class="mono text-[8px] uppercase tracking-widest text-gray-500">
                Pipeline Multimodal de Visão Computacional e Linguagem Natural para tratamento da Acne
            </p>
        </div>

        <button
            id="close-sidebar"
            type="button"
            class="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-200 md:hidden"
            aria-label="Fechar menu"
        >
            <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

    </div>


    <!-- New conversation -->

    <div class="p-3">

        <button
            id="new-chat-button"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-gray-50"
        >

            <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                />
            </svg>

            Nova conversa

        </button>

    </div>


    <!-- Navigation -->

    <nav class="flex-1 overflow-y-auto px-3">

        <p class="mono mb-2 px-3 pt-2 text-[10px] uppercase tracking-widest text-gray-400">
            Navegação
        </p>

        <ul class="space-y-1">

            <li>
                <RouterLink
                    to="/"
                    exact-active-class="bg-gray-200 text-gray-900"
                    class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>

                    Landing
                </RouterLink>
            </li>
            <li>
                <RouterLink
                    to="/home"
                    exact-active-class="bg-gray-200 text-gray-900"
                    class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                >
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 10h8M8 14h5M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                    />
                </svg>
                    Chat
                </RouterLink>
            </li>

            <li>
                <RouterLink
                    to="/data"
                    exact-active-class="bg-gray-200 text-gray-900"
                    class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-200"
                >
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    Histórico
                </RouterLink>
            </li>

        </ul>


        <!-- Conversation history -->

        <div id="history" class="mt-8">

            <div class="mb-2 flex items-center justify-between px-3">

                <p class="mono text-[10px] uppercase tracking-widest text-gray-400">
                    Conversas recentes
                </p>

            </div>

            <div id="conversation-list" class="space-y-1">

                <button
                    class="w-full truncate rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-200"
                >
                    Avaliação facial
                </button>

                <button
                    class="w-full truncate rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-200"
                >
                    Sobre o ClearFace
                </button>

            </div>

        </div>

    </nav>


    <!-- Sidebar footer -->

    <div class="border-t border-gray-200 p-4">

        <div class="flex items-center gap-3">

            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                CF
            </div>

            <div class="min-w-0">

                <p class="truncate text-sm font-semibold">
                    ClearFace LM
                </p>

                <p class="mono text-[10px] text-gray-500">
                    research system
                </p>

            </div>

        </div>

    </div>


    </aside>
</template>