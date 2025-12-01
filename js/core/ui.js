// =========================================================
// UI HELPERS (Notificações, Loaders, etc)
// =========================================================

export function showToast(message, type = "success") {
    // Cores baseadas no tipo
    let backgroundColor;
    
    switch(type) {
        case "error":
            backgroundColor = "#dc3545"; // Vermelho
            break;
        case "info":
            backgroundColor = "#007bff"; // Azul
            break;
        default:
            backgroundColor = "#28a745"; // Verde (Success)
    }

    // Chama a biblioteca Toastify (que já carregamos no HTML)
    Toastify({
        text: message,
        duration: 3000,       // 3 segundos
        close: true,          // Botão de fechar
        gravity: "top",       // Topo
        position: "right",    // Direita
        backgroundColor: backgroundColor,
        stopOnFocus: true,    // Para de contar o tempo se passar o mouse
        style: {
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem"
        }
    }).showToast();
}