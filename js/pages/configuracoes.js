import { layoutShell } from "../core/layout.js";
import { clearToken } from "../core/auth.js";
import { navigate } from "../core/router.js";

export function renderConfiguracoes() {
  layoutShell(`
    <h2 class="section-title">Configurações</h2>

    <div class="config-card">

      <h3 class="config-title">Personalização</h3>

      <div class="config-item">
        <span>Tema Escuro</span>
        <label class="switch">
          <input type="checkbox" id="darkModeToggle">
          <span class="slider"></span>
        </label>
      </div>

      <div class="config-item">
        <span>Tamanho da Fonte</span>
        <select id="fontSizeSelect" class="form-input">
          <option value="16">Normal</option>
          <option value="18">Médio</option>
          <option value="20">Grande</option>
        </select>
      </div>

      <h3 class="config-title">Sistema</h3>

      <div class="config-item">
        <span>Notificações</span>
        <label class="switch">
          <input type="checkbox" id="notifToggle">
          <span class="slider"></span>
        </label>
      </div>

      <div class="config-item">
        <span>Vibração (Haptics)</span>
        <label class="switch">
          <input type="checkbox" id="vibToggle">
          <span class="slider"></span>
        </label>
      </div>

      <h3 class="config-title">Aplicativo</h3>

      <div class="config-item">
        <span>Versão</span>
        <span class="config-info">v1.0.0</span>
      </div>

      <div class="config-item clickable" onclick="limparCache()">
        <span>Limpar Dados Locais</span>
        <span class="config-info red">Limpar</span>
      </div>

      <div class="config-item clickable" onclick="logoutConfig()">
        <span>Sair da Conta</span>
        <span class="config-info red">Sair</span>
      </div>

    </div>
  `, "config");

  // Carrega valores salvos
  carregarConfiguracoes();

  // Deixa funções acessíveis globalmente
  window.logoutConfig = logoutConfig;
  window.limparCache = limparCache;
}

function carregarConfiguracoes() {
  // Dark Mode
  const darkMode = localStorage.getItem("dark_mode") === "1";
  document.getElementById("darkModeToggle").checked = darkMode;
  document.body.classList.toggle("dark", darkMode);

  document.getElementById("darkModeToggle").onchange = (e) => {
    const ativo = e.target.checked;
    localStorage.setItem("dark_mode", ativo ? "1" : "0");
    document.body.classList.toggle("dark", ativo);
  };

  // Fonte
  const fontSize = localStorage.getItem("font_size") || "16";
  document.getElementById("fontSizeSelect").value = fontSize;
  document.documentElement.style.fontSize = fontSize + "px";

  document.getElementById("fontSizeSelect").onchange = (e) => {
    localStorage.setItem("font_size", e.target.value);
    document.documentElement.style.fontSize = e.target.value + "px";
  };
}

function logoutConfig() {
  clearToken();
  navigate("login");
}

function limparCache() {
  localStorage.clear();
  alert("Dados locais apagados.");
  location.reload();
}
