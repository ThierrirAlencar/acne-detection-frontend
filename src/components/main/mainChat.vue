<script setup>
    import { onBeforeUnmount, onMounted } from 'vue';
    
    /*
    * =========================================================
    * DOM
    * =========================================================
    */

    let chatForm = null;
    let messageInput = null;
    let messages = null;
    let sendButton = null;
    let characterCount = null;
    let clearChat = null;
    let newChatButton = null;



    let isProcessing = false;

    /*
     * =========================================================
     * MESSAGE HELPERS
     * =========================================================
    */

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    function addUserMessage(text) {

        const article = document.createElement("article");

        article.className = "message-enter flex justify-end";

        article.innerHTML = `
            <div class="max-w-[85%] sm:max-w-[75%]">

                <div class="rounded-2xl rounded-br-md bg-gray-900 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                    ${escapeHTML(text).replace(/\n/g, "<br>")}
                </div>

                <p class="mt-1 px-1 text-right text-[10px] text-gray-400">
                    Você
                </p>

            </div>
        `;

        messages.appendChild(article);

        scrollToBottom();

    }


    function addAssistantMessage(text) {

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

                    <div class="text-sm leading-7 text-gray-700">
                        ${escapeHTML(text).replace(/\n/g, "<br>")}
                    </div>

                </div>

            </div>
        `;

        messages.appendChild(article);

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

        messages.appendChild(article);

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
    async function sendPreMade(ext){

      //Delay fake
      await new Promise(resolve => setTimeout(resolve, 1500));
      const opt = [
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
      ]
      return opt[ext]
    }
    async function sendToAPI(message) {

        /*
         * Quando o backend estiver pronto, substitua a
         * implementação simulada por:
         *
         * const response = await fetch("/api/chat", {
         *     method: "POST",
         *     headers: {
         *         "Content-Type": "application/json"
         *     },
         *     body: JSON.stringify({
         *         message: message
         *     })
         * });
         *
         * if (!response.ok) {
         *     throw new Error("Erro ao comunicar com a API.");
         * }
         *
         * const data = await response.json();
         *
         * return data.response;
         */


        await new Promise(resolve => setTimeout(resolve, 900));




        return "";
    }


    /*
     * =========================================================
     * SEND MESSAGE
     * =========================================================
     */

    async function handleMessage(message, preMadeResponseIndex = null) {

        message = message.trim();

        if (!message || isProcessing) {
            return;
        }


        isProcessing = true;

        sendButton.disabled = true;

        messageInput.disabled = true;


        addUserMessage(message);

        messageInput.value = "";

        updateCharacterCount();


        addTypingIndicator();


        try {

            const response = preMadeResponseIndex === null
                ? await sendToAPI(message)
                : await sendPreMade(preMadeResponseIndex);

            removeTypingIndicator();

            addAssistantMessage(response);

        } catch (error) {

            console.error(error);

            removeTypingIndicator();

            addAssistantMessage(
                "Não foi possível processar sua mensagem. Verifique a conexão com o servidor e tente novamente."
            );

        } finally {

            isProcessing = false;

            sendButton.disabled = false;

            messageInput.disabled = false;

            messageInput.focus();

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


    function submitMessage(event) {
        event.preventDefault();

        if (messageInput) {
            handleMessage(messageInput.value);
        }
    }

    function handleKeydown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            chatForm?.requestSubmit();
        }
    }

    function resizeMessageInput() {
        if (!messageInput) {
            return;
        }

        messageInput.style.height = "auto";
        messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + "px";
        updateCharacterCount();
    }

    function selectSuggestion(event) {
        const button = event.currentTarget;
        const message = button.dataset.message;
        const responseIndex = Number(button.dataset.responseIndex);

        if (message) {
            handleMessage(message, responseIndex);
        }
    }

    onMounted(() => {
        chatForm = document.getElementById("chat-form");
        messageInput = document.getElementById("message-input");
        messages = document.getElementById("messages");
        sendButton = document.getElementById("send-button");
        characterCount = document.getElementById("character-count");
        clearChat = document.getElementById("clear-chat");
        newChatButton = document.getElementById("new-chat-button");

        chatForm?.addEventListener("submit", submitMessage);
        messageInput?.addEventListener("keydown", handleKeydown);
        messageInput?.addEventListener("input", resizeMessageInput);
        clearChat?.addEventListener("click", resetChat);
        newChatButton?.addEventListener("click", resetChat);
        updateCharacterCount();
    });

    onBeforeUnmount(() => {
        chatForm?.removeEventListener("submit", submitMessage);
        messageInput?.removeEventListener("keydown", handleKeydown);
        messageInput?.removeEventListener("input", resizeMessageInput);
        clearChat?.removeEventListener("click", resetChat);
        newChatButton?.removeEventListener("click", resetChat);
    });

</script>

<template>
    <!-- ===================================================== -->
    <!-- MAIN CHAT -->
    <!-- ===================================================== -->

    <main class="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
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

                        <div class="mt-6 grid gap-3 sm:grid-cols-2">

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

        <section class="sticky bottom-0 bg-gradient-to-t from-[#f3f5f2] via-[#f3f5f2] to-transparent px-4 pb-4 pt-6 sm:px-6">

            <div class="mx-auto w-full max-w-3xl">

                <form id="chat-form">

                    <div class="relative rounded-2xl border border-gray-300 bg-white shadow-sm transition focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-200">

                        <label
                            for="file-input"
                            class="sr-only"
                        >
                            Envie sua Selfie!
                        </label>

                        <input
                            id="message-input"
                            type="file"
                            accept="image/*" 
                            placeholder="Envie uma selfie do rosto para analise!...."
                            class="block max-h-40 min-h-[56px] w-full resize-none rounded-2xl bg-transparent px-4 py-4 pr-14 text-sm outline-none placeholder:text-gray-400"
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