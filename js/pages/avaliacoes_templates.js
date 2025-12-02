export const templates = {
    "Ortopedica": `
        <h4>1. Identificação</h4>
        <div class="row"><div class="col"><label>Profissão</label><input name="profissao" class="u-full-width"></div>
        <div class="col"><label>Dominância</label><select name="dominancia" class="u-full-width"><option value="Direita">Direita</option><option value="Esquerda">Esquerda</option></select></div></div>
        
        <h4>2. Queixa Principal</h4>
        <label>QP</label><textarea name="qp" class="u-full-width"></textarea>
        <div class="row">
            <div class="col"><label>Início</label><select name="inicio" class="u-full-width"><option value="Súbito">Súbito</option><option value="Insidioso">Insidioso</option></select></div>
            <div class="col"><label>Tempo evolução</label><input name="tempo_evolucao" class="u-full-width"></div>
        </div>
        <label>Localização / Irradiação</label><input name="local_dor" class="u-full-width">
        <label>Característica</label><select name="caracteristica" class="u-full-width"><option value="Queimação">Queimação</option><option value="Peso">Peso</option><option value="Pontada">Pontada</option></select>
        <label>Intensidade (EVA 0-10)</label><input type="number" name="eva" class="u-full-width">
        <label>Fatores Piora/Melhora</label><input name="fatores" class="u-full-width">

        <h4>3. HDA e Antecedentes</h4>
        <label>Tratamentos Prévios/Cirurgias</label><textarea name="hda" class="u-full-width"></textarea>
        <label>Comorbidades/Medicações</label><textarea name="antecedentes" class="u-full-width"></textarea>

        <h4>5. Exame Físico</h4>
        <label>Postura / Edema / Deformidades</label><textarea name="inspecao" class="u-full-width"></textarea>
        <label>Palpação</label><textarea name="palpacao" class="u-full-width"></textarea>
        <label>ADM (Goniometria)</label><textarea name="adm" class="u-full-width"></textarea>
        <label>Força (MRC)</label><textarea name="forca" class="u-full-width"></textarea>
        <label>Testes Especiais</label><textarea name="testes" class="u-full-width"></textarea>

        <h4>8. Diagnóstico e Plano</h4>
        <label>Diagnóstico Cinético-Funcional</label><textarea name="diagnostico" class="u-full-width"></textarea>
        <label>Objetivos e Conduta</label><textarea name="conduta" class="u-full-width"></textarea>
    `,

    "NeuroAdulto": `
        <h4>Neurofuncional Adulto</h4>
        <label>Diagnóstico Médico / Data Evento</label><input name="diag_medico" class="u-full-width">
        <label>Queixa Principal / AVDs</label><textarea name="qp" class="u-full-width"></textarea>
        <label>HDA / História Funcional</label><textarea name="hda" class="u-full-width"></textarea>
        
        <h4>Exame Neurológico</h4>
        <label>Consciência / Cognição</label><input name="cognicao" class="u-full-width">
        <label>Tônus (Ashworth)</label><input name="tonus" class="u-full-width">
        <label>Sensibilidade</label><input name="sensibilidade" class="u-full-width">
        <label>Equilíbrio (Sentado/Em pé)</label><textarea name="equilibrio" class="u-full-width"></textarea>
        <label>Marcha (Dispositivos/Distância)</label><textarea name="marcha" class="u-full-width"></textarea>
        
        <h4>Plano</h4>
        <label>Objetivos Motores</label><textarea name="objetivos" class="u-full-width"></textarea>
    `,

    "NeuroPediatrica": `
        <h4>Neuro Pediátrica</h4>
        <label>Idade Gestacional / Parto</label><input name="parto" class="u-full-width">
        <label>Marcos do Desenvolvimento</label><textarea name="marcos" class="u-full-width"></textarea>
        <label>Tônus e Reflexos</label><textarea name="tonus" class="u-full-width"></textarea>
        <label>Avaliação Motora (Escalas)</label><textarea name="motor" class="u-full-width"></textarea>
        <label>Objetivos / Orientações Família</label><textarea name="objetivos" class="u-full-width"></textarea>
    `,

    "Respiratoria": `
        <h4>Respiratória</h4>
        <label>Uso de O2?</label><select name="o2" class="u-full-width"><option value="Não">Não</option><option value="Sim">Sim</option></select>
        <div class="row">
            <div class="col"><label>PA</label><input name="pa" class="u-full-width"></div>
            <div class="col"><label>FC</label><input name="fc" class="u-full-width"></div>
            <div class="col"><label>FR</label><input name="fr" class="u-full-width"></div>
            <div class="col"><label>SpO2</label><input name="spo2" class="u-full-width"></div>
        </div>
        <label>Ausculta Pulmonar</label><textarea name="ausculta" class="u-full-width"></textarea>
        <label>Padrão Respiratório / Expansibilidade</label><textarea name="padrao" class="u-full-width"></textarea>
        <label>Tosse / Secreção</label><textarea name="tosse" class="u-full-width"></textarea>
        <label>Conduta</label><textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Cardiovascular": `
        <h4>Cardiovascular</h4>
        <label>Fatores de Risco</label><textarea name="risco" class="u-full-width"></textarea>
        <label>Capacidade ao Esforço / Sintomas</label><textarea name="esforco" class="u-full-width"></textarea>
        <label>Sinais Vitais Repouso</label><input name="sinais" class="u-full-width">
        <label>Edema / Perfusão</label><input name="edema" class="u-full-width">
        <label>Plano de Reabilitação</label><textarea name="plano" class="u-full-width"></textarea>
    `,

    "Uroginecologica": `
        <h4>Uroginecológica</h4>
        <label>Gestações / Partos</label><input name="gestacoes" class="u-full-width">
        <label>Queixa (Incontinência/Dor)</label><textarea name="queixa" class="u-full-width"></textarea>
        <label>História Miccional/Intestinal</label><textarea name="historia" class="u-full-width"></textarea>
        <label>Avaliação MAP (Força/Resistência)</label><textarea name="map" class="u-full-width"></textarea>
        <label>Conduta</label><textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Dermatofuncional": `
        <h4>Dermatofuncional</h4>
        <label>Queixa Principal</label><textarea name="qp" class="u-full-width"></textarea>
        <label>Cirurgias / Procedimentos Prévios</label><textarea name="hda" class="u-full-width"></textarea>
        <label>Exame Físico (Pele/Cicatriz/Edema)</label><textarea name="exame" class="u-full-width"></textarea>
        <label>Perimetria</label><textarea name="perimetria" class="u-full-width"></textarea>
        <label>Conduta</label><textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Esportiva": `
        <h4>Esportiva</h4>
        <label>Modalidade / Posição</label><input name="modalidade" class="u-full-width">
        <label>Histórico de Lesões</label><textarea name="lesoes" class="u-full-width"></textarea>
        <label>Volume de Treino</label><input name="treino" class="u-full-width">
        <label>Avaliação Funcional / Gesto Esportivo</label><textarea name="funcional" class="u-full-width"></textarea>
        <label>Objetivos (Retorno ao esporte)</label><textarea name="objetivos" class="u-full-width"></textarea>
    `,

    "Geriatrica": `
        <h4>Geriátrica</h4>
        <label>Queixa (Quedas/Dor/AVDs)</label><textarea name="qp" class="u-full-width"></textarea>
        <label>Histórico de Quedas / Doenças</label><textarea name="hda" class="u-full-width"></textarea>
        <label>Equilíbrio / Marcha</label><textarea name="equilibrio" class="u-full-width"></textarea>
        <label>Avaliação Funcional (Katz/Lawton)</label><textarea name="funcional" class="u-full-width"></textarea>
        <label>Conduta</label><textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Ergonomia": `
        <h4>Ergonomia</h4>
        <label>Função / Setor</label><input name="funcao" class="u-full-width">
        <label>Descrição da Tarefa</label><textarea name="tarefa" class="u-full-width"></textarea>
        <label>Postura / Esforço Físico</label><textarea name="postura" class="u-full-width"></textarea>
        <label>Sintomas (Dor/Fadiga)</label><textarea name="sintomas" class="u-full-width"></textarea>
        <label>Recomendações</label><textarea name="recomendacoes" class="u-full-width"></textarea>
    `
};