<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { getAllInquiries } from '@/api/services/getInquiriesService';
    import type { InquiryResponse } from '@/api/services/getInquiriesService';
    import { handleModelDetection } from '@/api/services/detectionService';
    import { handleTextDescription } from '@/api/services/descriptionService';

    const route = useRoute();
    const activeAppointmentId = ref<number | null>(null);

    type ScoreSummary = {
        gagsScore: number | null;
        severity: string | null;
        lesionsCount: number | null;
    };

    function refreshActiveAppointment() {
        const appointmentId = Number(route.query.appointment_id);
        activeAppointmentId.value = Number.isInteger(appointmentId) && appointmentId > 0
            ? appointmentId
            : null;
    }

    refreshActiveAppointment();
    watch(() => route.query.appointment_id, async () => {
        refreshActiveAppointment();
        await loadActiveConversation();
    });
    
    /*
    * =========================================================
    * DOM
    * =========================================================
    */

    let chatForm: HTMLFormElement | null = null;
    let messageInput: HTMLInputElement | null = null;
    let messages: HTMLElement | null = null;
    let sendButton: HTMLButtonElement | null = null;
    let characterCount: HTMLElement | null = null;
    let clearChat: HTMLElement | null = null;
    let newChatButton: HTMLElement | null = null;



    let isProcessing = false;

    async function loadActiveConversation() {
        if (!messages || !activeAppointmentId.value) {
            return;
        }

        messages.innerHTML = '';

        try {
            const inquiries: InquiryResponse[] = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const pageData = await getAllInquiries({
                    page,
                    take: 100,
                    appointmentId: activeAppointmentId.value
                });

                inquiries.push(...pageData.inquiries);
                hasNextPage = pageData.hasNextPage;
                page += 1;
            }

            const inquiriesWithDescriptions = await Promise.all(
                inquiries.map(async (inquiry) => {
                    try {
                        if (inquiry.gags_score === null || inquiry.severity === null) {
                            return inquiry;
                        }

                        const description = await handleTextDescription({
                            inquiry_id: inquiry.id,
                            detection: {
                                gags_score: inquiry.gags_score,
                                gags_severity: inquiry.severity,
                                region_counts: getRegionCounts(inquiry),
                            },
                        });

                        return {
                            ...inquiry,
                            result_text: description.result_text || inquiry.result_text,
                        };
                    } catch (error) {
                        console.error(`Could not load description for inquiry ${inquiry.id}`, error);
                        return inquiry;
                    }
                })
            );

            inquiriesWithDescriptions
                .sort((first, second) => {
                    const firstDate = first.created_at ?? first.created_atm ?? '';
                    const secondDate = second.created_at ?? second.created_atm ?? '';
                    return new Date(firstDate).getTime() - new Date(secondDate).getTime();
                })
                .forEach(addInquiryToConversation);

            if (inquiries.length === 0) {
                addAssistantMessage('Nenhuma análise foi encontrada nesta conversa.');
            }
        } catch (error) {
            console.error('Could not load conversation inquiries', error);
            addAssistantMessage('Não foi possível carregar esta conversa.');
        }
    }

    /*
     * =========================================================
     * MESSAGE HELPERS
     * =========================================================
    */

    function escapeHTML(text: string) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    function addUserMessage(text: string) {

        const article = document.createElement("article");

        article.className = "message-enter flex justify-end";

        article.innerHTML = `
            <div class="max-w-[85%] sm:max-w-[75%]">

                <div class="rounded-2xl rounded-br-md bg-gray-900 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                    ${escapeHTML(text).replace(/\n/g, "<br>")}
                </div>

                <p class="mt-1 px-1 text-right text-[20px] text-gray-400">
                    Você
                </p>

            </div>
        `;

        messages?.appendChild(article);

        scrollToBottom();

    }

    async function sendPreMade(responseIndex: number) {
        await new Promise(resolve => setTimeout(resolve, 900));

        const responses = [
            "",
            `
                Entendi sua pergunta.

                Esta é uma resposta automática do ClearFace. Primeiro envie uma imagem do rosto, em um local claro e bem iluminado.

                O modelo irá responder com: um breve descrição do seu status de acne, um score matemático da sua condição dermatológica e uma imagem das lesões detectadas em sua face.
            `,
            `
                Entendi sua pergunta.

                Esta é uma resposta automática do ClearFace. Com o clearface você pode analisar a situação de acne facial do seu rosto através de algorítmos de visão computacional.

                A pontuação é calculada através do mecânismo IGA mundialmente usado para avaliar a condição dermatológica de pacientes.
            `,
            `
                Entendi sua pergunta.

                Esta é uma resposta automática do ClearFace. Utilizamos algorítmos complexos de visão computacional através do framework YOLO para detectar e classificar sua condição dermatológica

                Após esta etapa, usamos um algorítmo pré treinado para avaliar essa mesma condição e logo após um segundo algorítmo de aprendizado de máquina exibe uma resposta textual resumindo a análise!
                Os algorítmos forem treinados com um dataset pré processado que permitiu a segmentação das regiões do rosto permitindo uma análise ainda mais precisa. 
            `,
                `
                Entendi sua pergunta.

                Esta é uma resposta automática do ClearFace. A resposta simples é que não, este modelo não deve em hipotese alguma substituir a avaliação de um médico especialista na área. 

                Este projeto é apenas uma prova de conceito da possibilidade de desenvolvimentos de projetos do tipo. Nosso trabalho não foi validado por insituições médicas da área de dermatologia. 
                
                Consulte sempre um médico qualificado! <3
            `,
        ];

        return responses[responseIndex] ?? responses[1] ?? '';
    }

    async function selectSuggestion(event: Event) {
        if (activeAppointmentId.value || isProcessing) {
            return;
        }

        const button = event.currentTarget as HTMLElement;
        const responseIndex = Number(button.dataset.responseIndex);
        const message = button.dataset.message;

        if (!message) {
            return;
        }

        isProcessing = true;
        addUserMessage(message);
        addTypingIndicator();

        try {
            const response = await sendPreMade(responseIndex);
            removeTypingIndicator();
            addAssistantMessage(response);
        } finally {
            isProcessing = false;
        }
    }

    function addUserImageMessage(image: File) {
        const imageSource = URL.createObjectURL(image);
        const article = document.createElement('article');

        article.className = 'message-enter flex justify-end';
        article.innerHTML = `
            <div class="max-w-[85%] sm:max-w-[75%]">
                <div class="rounded-2xl rounded-br-md bg-gray-900 p-2 shadow-sm">
                    <img
                        src="${escapeHTML(imageSource)}"
                        alt="Imagem enviada para análise"
                        class="max-h-80 w-full rounded-xl object-cover"
                    >
                </div>
                <p class="mt-1 px-1 text-right text-[10px] text-gray-400">Você</p>
            </div>
        `;

        messages?.appendChild(article);
        scrollToBottom();
    }

    function toImageSource(image: string | null) {
        if (!image) {
            return null;
        }

        return image.startsWith('data:') ||
            image.startsWith('http://') ||
            image.startsWith('https://') ||
            image.startsWith('blob:')
            ? image
            : `data:image/jpeg;base64,${image}`;
    }

    function getResultText(inquiry: InquiryResponse) {
        let result = inquiry.result_text || '';

        if (!result && inquiry.result_json) {
            try {
                result = JSON.stringify(JSON.parse(inquiry.result_json), null, 2);
            } catch {
                result = inquiry.result_json;
            }
        }

        return result
            .split('\n')
            .filter(line => !/gags\s*score\s*:|severity\s*:/i.test(line))
            .join('\n')
            .trim();
    }

    function getRegionCounts(inquiry: InquiryResponse): Record<string, number> {
        if (inquiry.region_counts) {
            return inquiry.region_counts;
        }

        if (!inquiry.result_json) {
            return {};
        }

        try {
            const result = JSON.parse(inquiry.result_json) as {
                region_counts?: Record<string, number>;
            };

            return result.region_counts ?? {};
        } catch {
            return {};
        }
    }

    function addInquiryToConversation(inquiry: InquiryResponse) {
        const imageSource = toImageSource(inquiry.original_base64);
        const userArticle = document.createElement('article');

        userArticle.className = 'message-enter flex justify-end';
        userArticle.innerHTML = `
            <div class="max-w-[85%] sm:max-w-[75%]">
                <div class="rounded-2xl rounded-br-md bg-gray-900 p-2 shadow-sm">
                    ${imageSource ? `
                        <img
                            src="${escapeHTML(imageSource)}"
                            alt="Imagem enviada para análise"
                            class="max-h-80 w-full rounded-xl object-cover"
                        >
                    ` : `
                        <div class="rounded-xl bg-gray-800 px-4 py-8 text-center text-sm text-gray-300">
                            Imagem enviada para análise
                        </div>
                    `}
                </div>
                <p class="mt-1 px-1 text-right text-[10px] text-gray-400">Você</p>
            </div>
        `;
        messages?.appendChild(userArticle);

        addAssistantMessage(
            getResultText(inquiry) || `Análise ${inquiry.inquiry_status.toLowerCase()}.`,
            toImageSource(inquiry.result_base64),
            {
                gagsScore: inquiry.gags_score,
                severity: inquiry.severity,
                lesionsCount: inquiry.lesions_count,
            }
        );
    }


    function addAssistantMessage(
        text: string,
        imageSource: string | null = null,
        scores: ScoreSummary | null = null
    ) {
        const formattedText = escapeHTML(text.trim())
            .replace(/^[ \t]+/gm, '')
            .replace(/\n/g, '<br>');

        const article = document.createElement("article");

        article.className = "message-enter";

        article.innerHTML = `
            <div class="flex items-start gap-3">

                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                    CF
                </div>

                <div class="min-w-0 max-w-[85%]">

                    <div class="mb-1 flex items-center gap-2">

                        <span class="text-sm font-bold">
                            ClearFace LM
                        </span>

                        <span class="mono text-[9px] uppercase tracking-wider text-gray-400">
                            AI
                        </span>

                    </div>

                    <div class="rounded-2xl rounded-tl-md bg-slate-900 p-2 shadow-sm">
                        ${imageSource ? `
                            <div class="rounded-xl p-2">
                                <img
                                    src="${escapeHTML(imageSource)}"
                                    alt="Imagem processada pelo modelo"
                                    class="max-h-80 w-full rounded-lg object-cover"
                                >
                            </div>
                        ` : ''}

                        ${scores && (scores.gagsScore !== null || scores.severity || scores.lesionsCount !== null) ? `
                            <div class="mb-2 flex flex-wrap justify-end gap-2 border-b border-slate-700 px-2 pb-3">
                                ${scores.gagsScore !== null ? `
                                    <span class="rounded-lg bg-slate-800 px-3 py-1.5 text-right text-xs text-slate-300">
                                        <strong class="block text-[9px] uppercase tracking-wider text-slate-500">GAGS</strong>
                                        ${escapeHTML(String(scores.gagsScore))}
                                    </span>
                                ` : ''}
                                ${scores.severity ? `
                                    <span class="rounded-lg bg-slate-800 px-3 py-1.5 text-right text-xs text-slate-300">
                                        <strong class="block text-[9px] uppercase tracking-wider text-slate-500">Severidade</strong>
                                        ${escapeHTML(String(scores.severity))}
                                    </span>
                                ` : ''}
                                ${scores.lesionsCount !== null ? `
                                    <span class="rounded-lg bg-slate-800 px-3 py-1.5 text-right text-xs text-slate-300">
                                        <strong class="block text-[9px] uppercase tracking-wider text-slate-500">Lesões</strong>
                                        ${escapeHTML(String(scores.lesionsCount))}
                                    </span>
                                ` : ''}
                            </div>
                        ` : ''}

                        <div class="py-2 text-left whitespace-pre-wrap text-sm leading-7 text-gray-400">${formattedText}</div>
                    </div>

                </div>

            </div>
        `;

        messages?.appendChild(article);

        scrollToBottom();

    }


    function addTypingIndicator() {

        const article = document.createElement("article");

        article.id = "typing-indicator";

        article.className = "message-enter";

        article.innerHTML = `
            <div class="flex items-start gap-3">

                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                    CF
                </div>

                <div>

                    <div class="mb-2 text-sm font-bold">
                        ClearFace LM
                    </div>

                    <div class="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">

                        <span class="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                        <span class="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                        <span class="typing-dot h-1.5 w-1.5 rounded-full bg-gray-500"></span>

                    </div>

                </div>

            </div>
        `;

        messages?.appendChild(article);

        scrollToBottom();

    }


    function removeTypingIndicator() {

        const indicator = document.getElementById("typing-indicator");

        if (indicator) {
            indicator.remove();
        }

    }


    function scrollToBottom() {

        const container = document.getElementById("chat-container");

        requestAnimationFrame(() => {
            if (!container) {
                return;
            }

            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth"
            });

        });

    }


    /*
     * =========================================================
     * API
     * =========================================================
     *
     * Este é o ponto que você poderá conectar ao Flask.
     *
     * Exemplo futuro:
     *
     * POST /api/chat
     *
     * {
     *     "message": "Como funciona?",
     *     "conversation_id": "..."
     * }
     *
     * {
     *     "response": "...",
     *     "conversation_id": "..."
     * }
     *
     * =========================================================
     */
    /*
     * =========================================================
     * SEND MESSAGE
     * =========================================================
     */

    async function handleImage(image: File) {
        if (!activeAppointmentId.value || isProcessing) {
            if (!activeAppointmentId.value) {
                alert('Selecione uma conversa antes de enviar uma imagem.');
            }
            return;
        }

        isProcessing = true;
        if (!sendButton || !messageInput) {
            isProcessing = false;
            return;
        }

        sendButton.disabled = true;
        messageInput.disabled = true;
        addUserImageMessage(image);
        addTypingIndicator();

        try {
            await handleModelDetection({
                appointment_id: activeAppointmentId.value,
                image
            });
            await loadActiveConversation();
        } catch (error) {
            console.error(error);
            removeTypingIndicator();
            addAssistantMessage(
                'Não foi possível processar a imagem. Verifique a conexão com o servidor e tente novamente.'
            );
        } finally {
            isProcessing = false;
            sendButton.disabled = false;
            messageInput.disabled = false;
            messageInput.value = '';
        }
    }


    function updateCharacterCount() {

        if (!messageInput || !characterCount) {
            return;
        }

        const length = messageInput.value.length;

        characterCount.textContent = `${length} / 4000`;

    }


    /*
     * =========================================================
     * SUGGESTIONS
     * =========================================================
     */

    /*
     * =========================================================
     * CLEAR CHAT
     * =========================================================
     */

    function resetChat() {
        if (!messages || !messageInput) {
            return;
        }

        messages.innerHTML = `
            <article class="message-enter">

                <div class="flex items-start gap-3">

                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                        CF
                    </div>

                    <div class="max-w-2xl">

                        <div class="mb-1 text-sm font-bold">
                            ClearFace LM
                        </div>

                        <p class="text-sm leading-7 text-gray-700">
                            Nova conversa iniciada. Como posso ajudar?
                        </p>

                    </div>

                </div>

            </article>
        `;

        messageInput.value = "";

        updateCharacterCount();

        messageInput.focus();

    }


    function submitMessage(event: Event) {
        event.preventDefault();

        const image = messageInput?.files?.[0];
        if (image) {
            void handleImage(image);
        }
    }

    onMounted(() => {
        chatForm = document.getElementById("chat-form") as HTMLFormElement | null;
        messageInput = document.getElementById("message-input") as HTMLInputElement | null;
        messages = document.getElementById("messages");
        sendButton = document.getElementById("send-button") as HTMLButtonElement | null;
        characterCount = document.getElementById("character-count");
        clearChat = document.getElementById("clear-chat");
        newChatButton = document.getElementById("new-chat-button");

        chatForm?.addEventListener("submit", submitMessage);
        clearChat?.addEventListener("click", resetChat);
        newChatButton?.addEventListener("click", resetChat);
        updateCharacterCount();
        void loadActiveConversation();
    });

    onBeforeUnmount(() => {
        chatForm?.removeEventListener("submit", submitMessage);
        clearChat?.removeEventListener("click", resetChat);
        newChatButton?.removeEventListener("click", resetChat);
    });

</script>

<template>
    <!-- ===================================================== -->
    <!-- MAIN CHAT -->
    <!-- ===================================================== -->

    <main class="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
        <div
            v-if="activeAppointmentId"
            class="border-b border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-500 sm:px-6"
        >
            Conversa #{{ activeAppointmentId }}
        </div>
        <!-- Chat messages -->
        <section
            id="chat-container"
            class="chat-scroll flex-1 overflow-y-auto px-4 py-8 sm:px-6"
            aria-label="Conversa com ClearFace LM"
        >

            <div
                id="messages"
                class="mx-auto flex w-full max-w-3xl flex-col gap-8"
            >

                <!-- Welcome message -->

                <article class="message-enter">

                    <div class="mb-4 flex items-center gap-3">

                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                            CF
                        </div>

                        <div>

                            <p class="text-sm font-bold">
                                ClearFace LM
                            </p>

                            <p class="mono text-[10px] uppercase tracking-wider text-gray-400">
                                v1.2.25
                            </p>

                        </div>

                    </div>


                    <div class="pl-12">


                        <p class="max-w-2xl leading-7 text-gray-600">
                            Este é um sistema automatizado desenvolvido por alunos do IFCE Campus Cedro para auxiliar
                            na detecção e classificação de lesões causadas pela acne
                            facial utilizando inteligência artificial.
                        </p>


                        <!-- Suggested prompts -->

                        <div v-if="!activeAppointmentId" class="mt-6 grid gap-3 sm:grid-cols-2">

                            <button
                                class="suggestion rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
                                data-message="Como funciona a análise de acne facial?"
                                data-response-index="1"
                                @click="selectSuggestion"
                            >

                                <span class="mb-1 block text-sm font-semibold">
                                    Como funciona?
                                </span>

                                <span class="text-xs text-gray-500">
                                    Conheça o funcionamento do sistema.
                                </span>

                            </button>


                            <button
                                class="suggestion rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
                                data-message="Quais informações o ClearFace LM consegue analisar?"
                                data-response-index="2"
                                @click="selectSuggestion"
                            >

                                <span class="mb-1 block text-sm font-semibold">
                                    O que posso analisar?
                                </span>

                                <span class="text-xs text-gray-500">
                                    Veja quais informações podem ser avaliadas.
                                </span>

                            </button>
                            <button
                                class="suggestion rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
                                data-message="Como fizemos esse sistema funcionar?"
                                data-response-index="3"
                                @click="selectSuggestion"
                            >

                                <span class="mb-1 block text-sm font-semibold">
                                    Como foi feito?
                                </span>

                                <span class="text-xs text-gray-500">
                                    Como fizemos esse sistema funcionar?
                                </span>
                            </button>

                            <button
                                class="suggestion rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
                                data-message="Devo utilizar o clearfaceLm para tratamento médico da Acne?"
                                data-response-index="4"
                                @click="selectSuggestion"
                            >

                                <span class="mb-1 block text-sm font-semibold">
                                    Posso utilizar esse sistema?
                                </span>

                                <span class="text-xs text-gray-500">
                                    Você deveria utilizar Clearface para tratamento?
                                </span>

                            </button>
                        </div>

                    </div>

                </article>

            </div>

        </section>


        <!-- ================================================= -->
        <!-- CHAT INPUT -->
        <!-- ================================================= -->

        <section class="sticky bottom-0 bg-linear-to-t from-[#f3f5f2] via-[#f3f5f2] to-transparent px-4 pb-4 pt-6 sm:px-6">

            <div class="mx-auto w-full max-w-3xl">

                <form id="chat-form">

                    <div class="relative rounded-2xl border border-gray-300 bg-white shadow-sm transition focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-200">

                        <label
                            for="message-input"
                            class="sr-only"
                        >
                            Envie sua Selfie!
                        </label>

                        <input
                            id="message-input"
                            type="file"
                            accept="image/*" 
                            placeholder="Envie uma selfie do rosto para analise!...."
                            class="block max-h-40 min-h-14 w-full resize-none rounded-2xl bg-transparent px-4 py-4 pr-14 text-sm outline-none placeholder:text-gray-400"
                        ></input>


                        <button
                            id="send-button"
                            type="submit"
                            class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Enviar mensagem"
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
                                    d="M5 12h14M13 6l6 6-6 6"
                                />
                            </svg>

                        </button>

                    </div>

                </form>


                <div class="mt-2 flex items-center justify-between px-1">

                    <p class="text-[10px] text-gray-400">
                        ClearFace LM pode cometer erros. As respostas não substituem avaliação médica.
                    </p>

                    <span
                        id="character-count"
                        class="mono hidden text-[10px] text-gray-400 sm:block"
                    >
                        0 / 4000
                    </span>

                </div>

            </div>

        </section>

    </main>
</template>