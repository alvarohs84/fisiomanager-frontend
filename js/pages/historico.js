import { renderLayout } from "../core/layout.js";

export function renderHistorico() {
  renderLayout(`<h2>Histórico</h2><p>Selecione um paciente.</p>`);
}

export function renderHistoricoPaciente(nome) {
  renderLayout(`<h2>Histórico de ${nome}</h2>`);
}

