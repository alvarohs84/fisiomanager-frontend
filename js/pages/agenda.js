import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

let calendar = null;
let eventSelectedId = null;

export async function renderAgenda() {
  const html = `
    <div class="container" style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>📅 Agenda Interativa</h2>
        <button id="btnNovoEvent" style="background: #007bff; color: white; padding: 10px 20px; border:none; border-radius: 5px; cursor: pointer;">
          + Novo Agendamento
        </button>
      </div>

      <div id="calendar" style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-height: 600px;"></div>
    </div>

    <div id="modalAgenda" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);">
      <div style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 90%; max-width: 500px; border-radius: 8px;">
        <h3 id="modalTitle">Detalhes do Agendamento</h3>
        
        <label>Paciente:</label>
        <select id="agPaciente" style="width: 100%; padding: 8px; margin-bottom: 10px;"></select>

        <label>Início:</label>
        <input type="datetime-local" id="agInicio" style="width: 100%; padding: 8px; margin-bottom: 10px;">

        <label>Fim:</label>
        <input type="datetime-local" id="agFim" style="width: 100%; padding: 8px; margin-bottom: 10px;">

        <label>Status:</label>
        <select id="agStatus" style="width: 100%; padding: 8px; margin-bottom: 20px;">
          <option value="Agendado">Agendado</option>
          <option value="Realizado">Realizado (Verde)</option>
          <option value="Cancelado">Cancelado (Vermelho)</option>
        </select>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="btnDeleteEvent" style="background: #dc3545; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; display: none;">Excluir</button>
          <button id="btnCloseModal" style="background: #6c757d; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Cancelar</button>
          <button id="btnSaveEvent" style="background: #28a745; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Salvar</button>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  
  // Inicializa
  await carregarPacientesNoSelect();
  initFullCalendar();

  // Eventos
  document.getElementById("btnNovoEvent").onclick = () => abrirModal();
  document.getElementById("btnCloseModal").onclick = fecharModal;
  document.getElementById("btnSaveEvent").onclick = salvarEvento;
  document.getElementById("btnDeleteEvent").onclick = deletarEvento;
}

function initFullCalendar() {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: "06:00:00",
    slotMaxTime: "22:00:00",
    allDaySlot: false,
    editable: true, // HABILITA DRAG & DROP
    selectable: true,

    // CARREGAR DO BANCO
    events: async (info, success, failure) => {
      try {
        const data = await authFetch("/appointments/");
        const eventos = data.map(ev => ({
          id: ev.id,
          title: `${ev.patient_name} - ${ev.status}`,
          start: ev.start_time,
          end: ev.end_time,
          backgroundColor: ev.status === 'Realizado' ? '#28a745' : (ev.status === 'Cancelado' ? '#dc3545' : '#007bff')
        }));
        success(eventos);
      } catch (e) {
        failure(e);
      }
    },

    // CLICAR NO EVENTO (EDITAR)
    eventClick: (info) => {
      abrirModal(info.event);
    },

    // ARRASTAR E SOLTAR (ATUALIZAR DATA)
    eventDrop: async (info) => {
      if (!confirm("Mover agendamento?")) {
        info.revert();
        return;
      }
      try {
        await authFetch(`/appointments/${info.event.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            start_time: info.event.start,
            end_time: info.event.end
          })
        });
      } catch (e) {
        info.revert();
        alert("Erro ao mover.");
      }
    },

    // REDIMENSIONAR (AUMENTAR TEMPO)
    eventResize: async (info) => {
      await authFetch(`/appointments/${info.event.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          start_time: info.event.start,
          end_time: info.event.end
        })
      });
    },

    // CLICAR NA GRADE (CRIAR NOVO)
    select: (info) => {
      abrirModal(null, info.start, info.end);
    }
  });

  calendar.render();
}

async function carregarPacientesNoSelect() {
  const select = document.getElementById("agPaciente");
  try {
    const pacientes = await authFetch("/patients/");
    select.innerHTML = pacientes.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  } catch (e) {
    console.error("Erro ao carregar pacientes", e);
  }
}

function abrirModal(event = null, start = null, end = null) {
  const modal = document.getElementById("modalAgenda");
  const btnDelete = document.getElementById("btnDeleteEvent");
  modal.style.display = "block";

  if (event) {
    // MODO EDIÇÃO
    eventSelectedId = event.id;
    // Tenta achar o ID do paciente pelo título (forma simples) ou teria que buscar no backend.
    // Para simplificar, deixamos o select como está, mas idealmente buscaríamos o dado completo.
    
    // Formatar datas para datetime-local (YYYY-MM-DDTHH:MM)
    const isoStart = new Date(event.start.getTime() - (event.start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    const isoEnd = event.end ? new Date(event.end.getTime() - (event.end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : isoStart;

    document.getElementById("agInicio").value = isoStart;
    document.getElementById("agFim").value = isoEnd;
    btnDelete.style.display = "block";
  } else {
    // MODO NOVO
    eventSelectedId = null;
    btnDelete.style.display = "none";
    
    if (start && end) {
      const isoStart = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      const isoEnd = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      document.getElementById("agInicio").value = isoStart;
      document.getElementById("agFim").value = isoEnd;
    } else {
      document.getElementById("agInicio").value = "";
      document.getElementById("agFim").value = "";
    }
  }
}

function fecharModal() {
  document.getElementById("modalAgenda").style.display = "none";
}

async function salvarEvento() {
  const pacienteId = document.getElementById("agPaciente").value;
  const inicio = document.getElementById("agInicio").value;
  const fim = document.getElementById("agFim").value;
  const status = document.getElementById("agStatus").value;

  if (!pacienteId || !inicio || !fim) {
    alert("Preencha todos os campos");
    return;
  }

  const payload = {
    patient_id: pacienteId,
    start_time: inicio,
    end_time: fim,
    status: status
  };

  try {
    if (eventSelectedId) {
      // EDITAR
      await authFetch(`/appointments/${eventSelectedId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    } else {
      // CRIAR
      await authFetch("/appointments/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    fecharModal();
    calendar.refetchEvents(); // Atualiza calendário
  } catch (e) {
    alert("Erro ao salvar.");
  }
}

async function deletarEvento() {
  if (!confirm("Excluir agendamento?")) return;
  try {
    await authFetch(`/appointments/${eventSelectedId}`, { method: "DELETE" });
    fecharModal();
    calendar.refetchEvents();
  } catch (e) {
    alert("Erro ao excluir.");
  }
}


