

<template>
    <main class="min-h-screen bg-[#f3f5f2]">
    <!-- ===================================================== -->
    <!-- HERO -->
    <!-- ===================================================== -->

    <section class="relative overflow-hidden">

        <!-- Decorative background -->

        <div
            class="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gray-200/70 blur-3xl"
        ></div>

        <div
            class="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gray-200/60 blur-3xl"
        ></div>


        <div class="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">

            <div class="grid items-center gap-16 lg:grid-cols-2">


                <!-- HERO CONTENT -->

                <div>
                    <h1 class="max-w-3xl text-5xl font-bold tracking-[-0.04em] text-gray-900 sm:text-6xl lg:text-7xl">

                        ClearFace
                        <span class="text-gray-500">
                            LM
                        </span>

                    </h1>


                    <p class="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                        O ClearFace combina visão computacional e processamento
                        de linguagem natual para auxiliar na detecção, classificação e
                        acompanhamento da acne facial.
                    </p>


                    <!-- CTA -->

                    <div class="mt-9 flex flex-col gap-3 sm:flex-row">

                        <a
                            href="index.html"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
                        >

                            Experimentar ClearFace

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
                                    d="M5 12h14m-6-6 6 6-6 6"
                                />

                            </svg>

                        </a>


                        <a
                            href="#technology"
                            class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                            Conhecer o projeto
                        </a>

                    </div>


                    <p class="mt-5 text-[11px] text-gray-400">
                        Projeto de pesquisa • IFCE • 2026
                    </p>

                </div>


                <!-- HERO VISUAL -->

                <div class="relative">
                    <img src="../../../public/images/banner-image-1.png">
                </div>

            </div>

        </div>

    </section>


        <!-- ===================================================== -->
        <!-- INTRODUCTION -->
        <!-- ===================================================== -->

        <section
            id="technology"
            class="border-y border-gray-200 bg-white"
        >

            <div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">

                <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

                    <div>
                        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Do rosto aos dados.
                        </h2>

                    </div>


                    <div>

                        <p class="text-base leading-8 text-gray-600 sm:text-lg">

                            O ClearFace foi desenvolvido como uma plataforma
                            experimental para investigar como técnicas de
                            inteligência artificial podem auxiliar na análise
                            automatizada de manifestações de acne.

                        </p>

                        <p class="mt-5 text-base leading-8 text-gray-600 sm:text-lg">

                            A partir de uma imagem facial, o sistema pode
                            identificar diferentes tipos de lesões, relacioná-las
                            às regiões do rosto e produzir informações estruturadas
                            para acompanhamento.

                        </p>

                    </div>

                </div>

            </div>

        </section>


        <!-- ===================================================== -->
        <!-- PIPELINE -->
        <!-- ===================================================== -->

        <section class="bg-[#f3f5f2]">

            <div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">

                <div class="max-w-2xl">
                    <p class="mt-4 text-sm leading-7 text-gray-500">
                        O sistema combina diferentes componentes de inteligência
                        artificial para transformar uma imagem em informações
                        estruturadas.
                    </p>

                </div>


                <div class="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-4">


                    <!-- Step -->

                    <div class="bg-white p-7">

                        <div class="mt-8">

                            <h3 class="font-bold">
                                Imagem
                            </h3>

                            <p class="mt-3 text-sm leading-6 text-gray-500">
                                Uma fotografia facial é utilizada como entrada
                                para o processo de análise.
                            </p>

                        </div>

                    </div>


                    <!-- Step -->

                    <div class="bg-white p-7">


                        <div class="mt-8">

                            <h3 class="font-bold">
                                Detecção
                            </h3>

                            <p class="mt-3 text-sm leading-6 text-gray-500">
                                Modelos de visão computacional identificam
                                possíveis lesões e suas localizações.
                            </p>

                        </div>

                    </div>


                    <!-- Step -->

                    <div class="bg-white p-7">


                        <div class="mt-8">

                            <h3 class="font-bold">
                                Classificação
                            </h3>

                            <p class="mt-3 text-sm leading-6 text-gray-500">
                                As lesões detectadas são organizadas por tipo
                                e região facial.
                            </p>

                        </div>

                    </div>


                    <!-- Step -->

                    <div class="bg-white p-7">


                        <div class="mt-8">

                            <h3 class="font-bold">
                                Resultado
                            </h3>

                            <p class="mt-3 text-sm leading-6 text-gray-500">
                                Os dados são transformados em uma análise
                                compreensível para acompanhamento.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        <!-- ===================================================== -->
        <!-- Permiações -->
        <!-- ===================================================== -->

        <section id="awards" class="relative py-24 border-t border-gray-200/80">
            <div class="max-w-6xl mx-auto px-6 lg:px-8">

            <!-- Section header -->
            <div class="max-w-2xl mb-14">
                <h2 class="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
                    Premiações e reconhecimentos.
                </h2>
            </div>

            <!-- Awards -->
            <div class="gap-5">

                <!-- Award 01 -->
                <article class="group relative flex flex-col gap-7 overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 md:flex-row md:items-stretch">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-6">
                            <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-600 text-white shrink-0">
                                <span class="font-mono text-lg">#3</span>
                            </div>

                            <span class="font-mono text-xs uppercase tracking-widest text-gray-400">
                            08 / 12 / 2025
                            </span>
                        </div>

                        <div class="mt-8">

                            <h3 class="mt-2 text-xl font-semibold text-gray-900">
                                Prêmio ENICIT
                            </h3>

                            <p class="mt-3 text-sm leading-relaxed text-gray-500">
                                Atingimos Terceiro lugar no premio ENICIT 2025 na categoria de ciencias exatas e da terra. O evento ocorreu em fortaleza em fevereiro de 2026. 
                            </p>
                        </div>

                        <div class="mt-7 pt-5 border-t border-gray-100 flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                                ciencias exatas e da terra
                            </span>
                        </div>
                    </div>
                    <img
                        src="../../../public/images/banner-image-2.jpeg"
                        alt="Reconhecimento recebido pelo projeto ClearFace"
                        class="h-64 w-full rounded-2xl object-cover object-center md:h-auto md:w-1/2"
                    >
                </article>
            </div>
        </div>

        </section>

        <!-- ===================================================== -->
        <!-- DISCLAIMER -->
        <!-- ===================================================== -->

        <section class="border-t border-gray-200 bg-white">

            <div class="mx-auto max-w-4xl px-6 py-10 text-center">

                <p class="text-xs leading-6 text-gray-400">
                    O ClearFace é um projeto de pesquisa e desenvolvimento.
                    Seus resultados têm finalidade experimental e informativa,
                    não substituindo avaliação, diagnóstico ou orientação de
                    um profissional de saúde.
                </p>

            </div>

        </section>
    </main>
</template>