<script setup lang="ts">
    import { onBeforeUnmount, onMounted } from 'vue';

    type ConsultationStatus = "completado" | "processando" | "erro";
    type ConsultationSeverity = "leve" | "moderada" | "grave";

    type Consultation = {
        id: string;
        date: string;
        status: ConsultationStatus;
        severity: ConsultationSeverity | null;
        gags: number | null;
        lesions: number | null;
        title: string;
        description: string;
        image: string | null;
    };

    /*
    * =============================================================
    * SAMPLE DATA
    * =============================================================
    *
    * Esta estrutura pode posteriormente ser substituída por:
    *
    * GET /inquiry
    *
    * ou

        type ConsultationStatus = "completado" | "processando" | "erro";
        type ConsultationSeverity = "leve" | "moderada" | "grave";

        type Consultation = {
            id: string;
            date: string;
            status: ConsultationStatus;
            severity: ConsultationSeverity | null;
            gags: number | null;
            lesions: number | null;
            title: string;
            description: string;
            image: string | null;
        };
    *
    * GET /api/inquiries
    *
    */

    const consultations: Consultation[] = [

        {
            id: "inq-001",
            date: "2026-09-20T14:32:00",
            status: "completado",
            severity: "moderada",
            gags: 12,
            lesions: 18,
            title: "Avaliação facial",
            description: "Análise facial realizada através do pipeline de detecção do ClearFace.",
            image: null
        },

        {
            id: "inq-002",
            date: "2026-09-18T10:15:00",
            status: "completado",
            severity: "leve",
            gags: 6,
            lesions: 9,
            title: "Avaliação facial",
            description: "Nova análise realizada para acompanhamento do quadro.",
            image: null
        },

        {
            id: "inq-003",
            date: "2026-09-14T16:47:00",
            status: "completado",
            severity: "moderada",
            gags: 10,
            lesions: 14,
            title: "Acompanhamento",
            description: "Consulta de acompanhamento da análise anterior.",
            image: null
        },

        {
            id: "inq-004",
            date: "2026-09-10T09:20:00",
            status: "erro",
            severity: null,
            gags: null,
            lesions: null,
            title: "Avaliação facial",
            description: "Não foi possível concluir o processamento da imagem.",
            image: null
        }

    ];


    let filteredConsultations = [...consultations];

    let sortDescending = true;


    /*
    * =============================================================
    * DOM
    * =============================================================
    */

    let consultationList: HTMLElement | null = null;
    let emptyState: HTMLElement | null = null;
    let searchInput: HTMLInputElement | null = null;
    let severityFilter: HTMLSelectElement | null = null;
    let statusFilter: HTMLSelectElement | null = null;
    let resultCount: HTMLElement | null = null;
    let sortButton: HTMLButtonElement | null = null;


    /*
    * =============================================================
    * FORMATTERS
    * =============================================================
    */

    function formatDate(date: string) {

        return new Intl.DateTimeFormat(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date(date));

    }


    function severityLabel(severity: ConsultationSeverity | null) {

        if (!severity) {
            return "Não calculada";
        }

        const labels = {
            leve: "Leve",
            moderada: "Moderada",
            grave: "Grave"
        };

        return labels[severity] ?? "Não calculada";

    }


    function statusLabel(status: ConsultationStatus) {

        const labels = {
            completado: "Completado",
            processando: "Processando",
            erro: "Erro"
        };

        return labels[status] ?? status;

    }


    function statusClass(status: ConsultationStatus) {

        const classes = {

            completado:
                "bg-green-100 text-green-700",

            processando:
                "bg-yellow-100 text-yellow-700",

            erro:
                "bg-red-100 text-red-700"

        };

        return classes[status] ??
            "bg-gray-100 text-gray-600";

    }


    function severityClass(severity: ConsultationSeverity | null) {

        if (!severity) {
            return "bg-gray-100 text-gray-500";
        }

        const classes = {

            leve:
                "bg-green-100 text-green-700",

            moderada:
                "bg-yellow-100 text-yellow-700",

            grave:
                "bg-red-100 text-red-700"

        };

        return classes[severity] ??
            "bg-gray-100 text-gray-500";

    }


    /*
    * =============================================================
    * RENDER
    * =============================================================
    */

    function renderConsultations() {

        if (!consultationList || !emptyState || !resultCount) {
            return;
        }

        consultationList.innerHTML = "";


        if (filteredConsultations.length === 0) {

            emptyState.classList.remove("hidden");

            resultCount.textContent =
                "Nenhuma consulta encontrada";

            return;

        }


        emptyState.classList.add("hidden");


        resultCount.textContent =
            `${filteredConsultations.length} ${
                filteredConsultations.length === 1
                    ? "consulta encontrada"
                    : "consultas encontradas"
            }`;


        filteredConsultations.forEach(consultation => {

            const article =
                document.createElement("article");


            article.className =
                "card-transition cursor-pointer rounded-2xl border border-gray-200 bg-white";


            article.dataset.id =
                consultation.id;


            article.innerHTML = `

                <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">


                    <!-- IMAGE -->

                    <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">

                        ${
                            consultation.image

                            ? `
                                <img
                                    src="${consultation.image}"
                                    alt="Imagem analisada"
                                    class="h-full w-full object-cover"
                                >
                            `

                            : `

                                <svg
                                    class="h-7 w-7 text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >

                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                                    />

                                </svg>

                            `
                        }

                    </div>


                    <!-- MAIN INFO -->

                    <div class="min-w-0 flex-1">

                        <div class="flex flex-wrap items-center gap-2">

                            <h3 class="text-sm font-bold">
                                ${consultation.title}
                            </h3>

                            <span
                                class="rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(consultation.status)}"
                            >
                                ${statusLabel(consultation.status)}
                            </span>

                        </div>


                        <p class="mt-1 truncate text-xs text-gray-500">
                            ${consultation.description}
                        </p>


                        <div class="mt-3 flex flex-wrap items-center gap-3">

                            <span class="text-[11px] text-gray-400">
                                ${formatDate(consultation.date)}
                            </span>

                            ${
                                consultation.gags !== null

                                ? `
                                    <span class="h-1 w-1 rounded-full bg-gray-300"></span>

                                    <span class="text-[11px] text-gray-500">
                                        GAGS:
                                        <strong class="text-gray-800">
                                            ${consultation.gags}
                                        </strong>
                                    </span>
                                `

                                : ""
                            }

                            ${
                                consultation.lesions !== null

                                ? `
                                    <span class="h-1 w-1 rounded-full bg-gray-300"></span>

                                    <span class="text-[11px] text-gray-500">
                                        ${consultation.lesions} lesões
                                    </span>
                                `

                                : ""
                            }

                        </div>

                    </div>


                    <!-- SEVERITY -->

                    <div class="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                        <span
                            class="rounded-full px-3 py-1 text-[10px] font-semibold ${severityClass(consultation.severity)}"
                        >
                            ${severityLabel(consultation.severity)}
                        </span>


                        <button
                            type="button"
                            class="details-button flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900"
                            data-id="${consultation.id}"
                        >

                            Ver detalhes

                            <svg
                                class="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >

                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />

                            </svg>

                        </button>

                    </div>

                </div>

            `;


            consultationList?.appendChild(article);

        });


        document
            .querySelectorAll<HTMLButtonElement>(".details-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openDetails(button.dataset.id);

                    }
                );

            });


        document
            .querySelectorAll<HTMLElement>("#consultation-list article")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => openDetails(card.dataset.id)
                );

            });

    }


    /*
    * =============================================================
    * FILTERS
    * =============================================================
    */

    function applyFilters() {

        if (!searchInput || !severityFilter || !statusFilter) {
            return;
        }

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const severity =
            severityFilter.value;


        const status =
            statusFilter.value;


        filteredConsultations =
            consultations.filter(item => {


                const matchesSearch =
                    !search ||

                    item.title
                        .toLowerCase()
                        .includes(search) ||

                    item.description
                        .toLowerCase()
                        .includes(search);


                const matchesSeverity =
                    severity === "all" ||
                    item.severity === severity;


                const matchesStatus =
                    status === "all" ||
                    item.status === status;


                return (
                    matchesSearch &&
                    matchesSeverity &&
                    matchesStatus
                );

            });


        sortConsultations();

        renderConsultations();

    }


    /*
    * =============================================================
    * SORT
    * =============================================================
    */

    function sortConsultations() {

        filteredConsultations.sort(
            (a, b) => {

                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();


                return sortDescending
                    ? dateB - dateA
                    : dateA - dateB;

            }
        );

    }


    function toggleSort() {
        sortDescending = !sortDescending;

        if (sortButton) {
            sortButton.textContent = sortDescending
                ? "Mais recentes"
                : "Mais antigas";
        }

        sortConsultations();
        renderConsultations();
    }


    /*
    * =============================================================
    * DETAILS
    * =============================================================
    */

    function openDetails(id: string | undefined) {

        const consultation =
            consultations.find(
                item => item.id === id
            );


        if (!consultation) {
            return;
        }


        /*
        * Futuramente:
        *
        * window.location.href =
        *     `consultation.html?id=${consultation.id}`;
        *
        */


        alert(
            `Consulta ${consultation.id}\n\n` +
            `Data: ${formatDate(consultation.date)}\n` +
            `Status: ${statusLabel(consultation.status)}\n` +
            `Severidade: ${severityLabel(consultation.severity)}\n` +
            `GAGS: ${consultation.gags ?? "N/A"}\n` +
            `Lesões: ${consultation.lesions ?? "N/A"}`
        );

    }
    /*
    * =============================================================
    * STATISTICS
    * =============================================================
    */

    function updateStatistics() {

        const completed =
            consultations.filter(
                item =>
                    item.status === "completado"
            );


        const validGags =
            completed
                .filter(
                    (item): item is Consultation & { gags: number } =>
                        item.gags !== null
                )
                .map(
                    item =>
                        item.gags
                );


        const averageGags =
            validGags.length
                ? (
                    validGags.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    )
                    / validGags.length
                ).toFixed(1)

                : "—";


        const totalConsultations = document.getElementById("total-consultations");
        const completedConsultations = document.getElementById("completed-consultations");
        const averageGagsElement = document.getElementById("average-gags");

        if (totalConsultations) {
            totalConsultations.textContent = String(consultations.length);
        }

        if (completedConsultations) {
            completedConsultations.textContent = String(completed.length);
        }

        if (averageGagsElement) {
            averageGagsElement.textContent = averageGags;
        }

    }


    /*
    * =============================================================
    * INITIALIZATION
    * =============================================================
    */

    onMounted(() => {
        consultationList = document.getElementById("consultation-list");
        emptyState = document.getElementById("empty-state");
        searchInput = document.getElementById("search-input") as HTMLInputElement | null;
        severityFilter = document.getElementById("severity-filter") as HTMLSelectElement | null;
        statusFilter = document.getElementById("status-filter") as HTMLSelectElement | null;
        resultCount = document.getElementById("result-count");
        sortButton = document.getElementById("sort-button") as HTMLButtonElement | null;

        searchInput?.addEventListener("input", applyFilters);
        severityFilter?.addEventListener("change", applyFilters);
        statusFilter?.addEventListener("change", applyFilters);
        sortButton?.addEventListener("click", toggleSort);

        updateStatistics();
        sortConsultations();
        renderConsultations();
    });

    onBeforeUnmount(() => {
        searchInput?.removeEventListener("input", applyFilters);
        severityFilter?.removeEventListener("change", applyFilters);
        statusFilter?.removeEventListener("change", applyFilters);
        sortButton?.removeEventListener("click", toggleSort);
    });

</script>

<template>
    <main class="flex-1">

        <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">


            <!-- ================================================= -->
            <!-- PAGE TITLE -->
            <!-- ================================================= -->

            <section class="mb-8">

                <p class="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    Patient / Analysis
                </p>

                <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                    Histórico
                </h1>

                <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Consulte os resultados das análises realizadas
                    anteriormente pelo ClearFace LM.
                </p>

            </section>


            <!-- ================================================= -->
            <!-- SUMMARY -->
            <!-- ================================================= -->

            <section class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                <!-- Total -->

                <div class="rounded-2xl border border-gray-200 bg-white p-5">

                    <p class="text-xs font-medium text-gray-500">
                        Total de consultas
                    </p>

                    <p
                        id="total-consultations"
                        class="mt-2 text-2xl font-bold"
                    >
                        12
                    </p>

                    <p class="mt-1 text-[11px] text-gray-400">
                        análises registradas
                    </p>

                </div>


                <!-- Completed -->

                <div class="rounded-2xl border border-gray-200 bg-white p-5">

                    <p class="text-xs font-medium text-gray-500">
                        Concluídas
                    </p>

                    <p
                        id="completed-consultations"
                        class="mt-2 text-2xl font-bold"
                    >
                        10
                    </p>

                    <p class="mt-1 text-[11px] text-gray-400">
                        análises processadas
                    </p>

                </div>


                <!-- Average GAGS -->

                <div class="rounded-2xl border border-gray-200 bg-white p-5">

                    <p class="text-xs font-medium text-gray-500">
                        GAGS médio
                    </p>

                    <p
                        id="average-gags"
                        class="mt-2 text-2xl font-bold"
                    >
                        8.4
                    </p>

                    <p class="mt-1 text-[11px] text-gray-400">
                        últimas consultas
                    </p>

                </div>


                <!-- Last analysis -->

                <div class="rounded-2xl border border-gray-200 bg-white p-5">

                    <p class="text-xs font-medium text-gray-500">
                        Última análise
                    </p>

                    <p
                        id="last-analysis"
                        class="mt-2 text-lg font-bold"
                    >
                        Hoje
                    </p>

                    <p class="mt-1 text-[11px] text-gray-400">
                        14:32
                    </p>

                </div>

            </section>


            <!-- ================================================= -->
            <!-- FILTERS -->
            <!-- ================================================= -->

            <section class="mb-6 rounded-2xl border border-gray-200 bg-white p-4">

                <div class="flex flex-col gap-3 lg:flex-row lg:items-center">


                    <!-- Search -->

                    <div class="relative flex-1">

                        <svg
                            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >

                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                            />

                        </svg>


                        <input
                            id="search-input"
                            type="search"
                            placeholder="Buscar consultas..."
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                        >

                    </div>


                    <!-- Severity -->

                    <select
                        id="severity-filter"
                        class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                    >

                        <option value="all">
                            Todas as severidades
                        </option>

                        <option value="leve">
                            Leve
                        </option>

                        <option value="moderada">
                            Moderada
                        </option>

                        <option value="grave">
                            Grave
                        </option>

                    </select>


                    <!-- Status -->

                    <select
                        id="status-filter"
                        class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                    >

                        <option value="all">
                            Todos os status
                        </option>

                        <option value="completado">
                            Completado
                        </option>

                        <option value="processando">
                            Processando
                        </option>

                        <option value="erro">
                            Erro
                        </option>

                    </select>

                </div>

            </section>


            <!-- ================================================= -->
            <!-- CONSULTATIONS -->
            <!-- ================================================= -->

            <section>

                <div class="mb-4 flex items-center justify-between">

                    <div>

                        <h2 class="text-sm font-bold">
                            Consultas recentes
                        </h2>

                        <p
                            id="result-count"
                            class="mt-1 text-xs text-gray-400"
                        >
                            4 consultas encontradas
                        </p>

                    </div>


                    <button
                        id="sort-button"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100"
                    >
                        Mais recentes
                    </button>

                </div>


                <!-- List -->

                <div
                    id="consultation-list"
                    class="space-y-3"
                ></div>


                <!-- Empty -->

                <div
                    id="empty-state"
                    class="hidden rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center"
                >

                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                        <svg
                            class="h-6 w-6 text-gray-400"
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

                    </div>

                    <h3 class="mt-4 text-sm font-semibold">
                        Nenhuma consulta encontrada
                    </h3>

                    <p class="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-500">
                        As consultas realizadas aparecerão aqui.
                    </p>

                </div>

            </section>


            <!-- ================================================= -->
            <!-- PAGINATION -->
            <!-- ================================================= -->

            <nav class="mt-6 flex items-center justify-between">

                <p class="text-xs text-gray-400">
                    Página 1 de 1
                </p>

                <div class="flex gap-2">

                    <button
                        type="button"
                        disabled
                        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-300"
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        disabled
                        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-300"
                    >
                        Próxima
                    </button>

                </div>

            </nav>

        </div>

    </main>
</template>

