// ARQUIVO: js/core/voice.js

export function ativarVoz(inputId) {
    // Verifica se o navegador suporta
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn("Seu navegador não suporta reconhecimento de voz.");
        return; // Sai silenciosamente se não suportar
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    // Cria o botão de microfone
    const input = document.getElementById(inputId);
    if (!input) return;

    const btnMic = document.createElement("button");
    btnMic.type = "button"; // Importante para não enviar form
    btnMic.innerHTML = "🎤";
    btnMic.className = "btn-mic";
    btnMic.title = "Clique para ditar";
    
    // Estilo do botão (flutuante ou ao lado)
    btnMic.style.cssText = `
        margin-left: 5px;
        border: none;
        background: transparent;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.2s;
    `;

    // Insere o botão logo após o input
    input.parentNode.insertBefore(btnMic, input.nextSibling);
    // Se o input estiver num div flex, isso ajuda a alinhar

    // Eventos
    btnMic.onclick = () => {
        if (btnMic.classList.contains("ouvindo")) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    recognition.onstart = () => {
        btnMic.classList.add("ouvindo");
        btnMic.innerHTML = "🔴 Ouvindo...";
        btnMic.style.color = "red";
    };

    recognition.onend = () => {
        btnMic.classList.remove("ouvindo");
        btnMic.innerHTML = "🎤";
        btnMic.style.color = "";
    };

    recognition.onresult = (event) => {
        const textoFalado = event.results[0][0].transcript;
        
        // Insere o texto onde o cursor está ou no final
        const valorAtual = input.value;
        input.value = valorAtual ? `${valorAtual} ${textoFalado}` : textoFalado;
    };

    recognition.onerror = (event) => {
        console.error("Erro voz:", event.error);
        btnMic.innerHTML = "❌ Erro";
        setTimeout(() => btnMic.innerHTML = "🎤", 2000);
    };
}