
<script setup lang="ts">
    import { ref } from 'vue';

    const isBannerVisible = ref(true);
</script>

<template>
    <!-- ================================================= -->
        <!-- MARKETING BANNER -->
        <!-- ================================================= -->

        <div
            v-if="isBannerVisible"
            id="marketing-banner"
            class="mx-4 mb-3 flex items-center justify-between gap-4 rounded-xl bg-gray-800 px-4 py-3 text-white shadow-sm"
        >

            <div class="flex min-w-0 items-center gap-3">

                <div class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 sm:flex">

                    <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v18M3 12h18"
                        />
                    </svg>

                </div>

                <p class="text-xs leading-relaxed text-gray-200 sm:text-sm">

                    Nossa pesquisa estará no

                    <a
                        href="https://www.even3.com.br/connepi-fortaleza-2026/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-semibold text-white underline underline-offset-2 hover:text-gray-300"
                    >
                        XV Congresso Norte Nordeste de Pesquisa e Inovação (CONNEPI)
                    </a>.

                    Venha nos prestigiar!
                </p>

            </div>


            <button
                id="close-banner"
                type="button"
                @click="isBannerVisible = false"
                class="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar aviso"
            >

                <svg
                    class="h-4 w-4"
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
</template>