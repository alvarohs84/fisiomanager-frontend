import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";

let calendar = null;
let eventSelectedId = null;

export async function renderAgenda() {
  const html = `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>📅 Agenda</h2>
        <button id="btnNovoEvent" class="btn-primary" style="padding: 10px 20px;">+ Novo</button>
      </div>

      <div id="calendar" style="background: white; padding: 10px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-height: 600px;"></div>
    </div>

    <div id="modalAgenda" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);">
      <div style="background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 95%; max-width: 500px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
        <h3 id="modalTitle" style="margin-bottom: 20px;">Agendamento</h3>
        
        <label>Paciente:</label>
        <select id="agPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;"></select>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 140px;">
                <label>Início:</label>
                <input type="datetime-local" id="agInicio" style="width: 100%; margin-bottom: 15px;">
            </div>
            <div style="flex: 1; min-width: 140px;">
                <label>Fim:</label>
                <input type="datetime-local" id="agFim" style="width: 100%; margin-bottom: 15px;">
            </div>
        </div>

        <label>Status:</label>
        <select id="agStatus" style="width: 100%; margin-bottom: 25px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
          <option value="Agendado">Agendado</option>
          <option value="Realizado">Realizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button id="btnDeleteEvent" style="background: #fff; color: #dc3545; border: 1px solid #dc3545; padding: 10px; border-radius: 6px; cursor: pointer; display: none;">Excluir</button>
          
          <div style="display: flex; gap: 10px; margin-left: auto;">
            <button id="btnCloseModal" style="background: #e2e6ea; color: #333; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Cancelar</button>
            <button id="btnSaveEvent" class="btn-primary" style="padding: 10px 20px;">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  
  await carregarPacientesNoSelect();
  initFullCalendar();

  document.getElementById("btnNovoEvent").onclick = () => abrirModal();
  document.getElementById("btnCloseModal").onclick = fecharModal;
  document.getElementById("btnSaveEvent").onclick = salvarEvento;
  document.getElementById("btnDeleteEvent").onclick = deletarEvento;
}

function initFullCalendar() {
  const calendarEl = document.getElementById('calendar');
  
  // --- LÓGICA MOBILE ---
  const isMobile = window.innerWidth < 768;
  
  calendar = new FullCalendar.Calendar(calendarEl, {
    // Se for celular, mostra o Dia. Se for PC, mostra a Semana.
    initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
    
    // Ajusta a altura no mobile para não gerar scroll duplo
    height: isMobile ? 'auto' : 650,

    locale: 'pt-br',
    buttonText: {
      today:    'Hoje',
      month:    'Mês',
      week:     'Semana',
      day:      'Dia',
      list:     'Lista'
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: isMobile ? 'timeGridDay,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: "06:00:00",
    slotMaxTime: "22:00:00",
    allDaySlot: false,
    editable: true,
    selectable: true,

    events: async (info, success, failure) => {
      try {
        const data = await authFetch("/appointments/");
        const eventos = data.map(ev => ({
          id: ev.id,
          title: `${ev.patient_name} (${ev.status})`,
          start: ev.start_time,
          end: ev.end_time,
          backgroundColor: ev.status === 'Realizado' ? '#28a745' : (ev.status === 'Cancelado' ? '#dc3545' : '#007bff'),
          borderColor: 'transparent',
          extendedProps: {
              status: ev.status,
              patient_id: ev.patient_id
          }
        }));
        success(eventos);
      } catch (e) {
        failure(e);
        showToast("Erro ao carregar agenda", "error");
      }
    },

    eventClick: (info) => abrirModal(info.event),
    
    eventDrop: async (info) => {
      if (!confirm(`Mover atendimento de ${info.event.title}?`)) {
        info.revert();
        return;
      }
      try {
        await authFetch(`/appointments/${info.event.id}`, {
          method: "PATCH",
          body: JSON.stringify({ start_time: info.event.start, end_time: info.event.end })
        });
        showToast("Reagendado!", "success");
      } catch (e) {
        info.revert();
        showToast("Erro ao mover.", "error");
      }
    },

    eventResize: async (info) => {
      try {
        await authFetch(`/appointments/${info.event.id}`, {
            method: "PATCH",
            body: JSON.stringify({ start_time: info.event.start, end_time: info.event.end })
        });
        showToast("Horário atualizado!", "success");
      } catch(e) {
        info.revert();
      }
    },

    select: (info) => abrirModal(null, info.start, info.end)
  });

  calendar.render();
}

async function carregarPacientesNoSelect() {
  const select = document.getElementById("agPaciente");
  try {
    const pacientes = await authFetch("/patients/");
    if (pacientes.length === 0) {
        select.innerHTML = '<option value="">Sem pacientes</option>';
    } else {
        select.innerHTML = pacientes.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    }
  } catch (e) {
    showToast("Erro ao buscar pacientes.", "error");
  }
}

function abrirModal(event = null, start = null, end = null) {
  const modal = document.getElementById("modalAgenda");
  const btnDelete = document.getElementById("btnDeleteEvent");
  const btnSave = document.getElementById("btnSaveEvent");
  const modalTitle = document.getElementById("modalTitle");

  modal.style.display = "block";

  if (event) {
    eventSelectedId = event.id;
    modalTitle.innerText = "Editar Agendamento";
    btnSave.innerText = "Atualizar";
    btnSave.style.backgroundColor = "#007bff";

    if (event.extendedProps.patient_id) {
        document.getElementById("agPaciente").value = event.extendedProps.patient_id;
    }

    const isoStart = new Date(event.start.getTime() - (event.start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    const isoEnd = event.end ? new Date(event.end.getTime() - (event.end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : isoStart;
    document.getElementById("agInicio").value = isoStart;
    document.getElementById("agFim").value = isoEnd;

    if (event.extendedProps && event.extendedProps.status) {
         document.getElementById("agStatus").value = event.extendedProps.status;
    }
    btnDelete.style.display = "block";
  } else {
    eventSelectedId = null;
    modalTitle.innerText = "Novo Agendamento";
    btnSave.innerText = "Salvar";
    btnSave.style.backgroundColor = "#28a745";
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
    showToast("Preencha todos os campos!", "error");
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
      await authFetch(`/appointments/${eventSelectedId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      showToast("Atualizado!", "info");
    } else {
      await authFetch("/appointments/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showToast("Agendado!", "success");
    }
    fecharModal();
    calendar.refetchEvents();
  } catch (e) {
    showToast("Erro ao salvar.", "error");
  }
}

async function deletarEvento() {
  if (!confirm("Excluir agendamento?")) return;
  try {
    await authFetch(`/appointments/${eventSelectedId}`, { method: "DELETE" });
    fecharModal();
    calendar.refetchEvents();
    showToast("Excluído.", "info");
  } catch (e) {
    showToast("Erro ao excluir.", "error");
  }
}


