# Fisiomanager Frontend

Frontend do sistema **Fisiomanager**, uma aplicação desenvolvida para auxiliar fisioterapeutas na gestão completa de atendimentos, pacientes, agenda, finanças e evolução clínica.  
Este repositório contém toda a interface do usuário construída em **HTML, CSS e JavaScript puro**, com um design intuitivo e focado em usabilidade.

---

## 🚀 Funcionalidades

### 📅 Agenda
- Visualização de consultas por dia e horário  
- Organização dos atendimentos  
- Marcação e edição rápida de sessões  

### 🧑‍⚕️ Pacientes
- Cadastro de pacientes  
- Visualização de informações clínicas  
- Histórico do paciente  

### 📝 Evoluções
- Registro de evolução clínica  
- Histórico detalhado por sessão  

### 💰 Financeiro
- Controle de receitas e despesas  
- Visualização de relatórios financeiros  
- Interface para registro rápido de movimento  

### 🔐 Autenticação
- Login simples via frontend  
- Gestão de rotas protegidas  

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- Estrutura modular organizada em pastas
- Design responsivo

---

## 📁 Estrutura de Pastas

```bash
fisiomanager-frontend/
│
├── index.html
├── styles.css
│
└── js/
    ├── main.js
    ├── core/
    │   ├── auth.js
    │   ├── layout.js
    │   └── router.js
    │
    └── pages/
        ├── agenda.js
        ├── configuracoes.js
        ├── dashboard.js
        ├── evolucoes.js
        ├── financeiro.js
        ├── historico.js
        ├── login.js
        ├── pacientes.js
        └── perfil.js
