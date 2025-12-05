export const templates = {
    "Ortopedica": `
        <h4 style="color:#007bff; border-bottom:1px solid #eee; padding-bottom:5px;">Avaliação Ortopédica / Traumatológica</h4>
        <label>Queixa Principal (QP):</label>
        <textarea name="qp" class="u-full-width" rows="2"></textarea>
        
        <div class="row">
            <div class="col"><label>HDA (História Doença Atual):</label><textarea name="hda" class="u-full-width"></textarea></div>
            <div class="col"><label>HPP (Patológica Pregressa):</label><textarea name="hpp" class="u-full-width"></textarea></div>
        </div>

        <label style="font-weight:bold; margin-top:10px;">Exame Físico</label>
        <div class="row">
            <div class="col"><label>Inspeção/Postura:</label><input name="inspecao" class="u-full-width"></div>
            <div class="col"><label>Palpação/Edema:</label><input name="palpacao" class="u-full-width"></div>
        </div>

        <label>Amplitude de Movimento (Goniometria):</label>
        <textarea name="goniometria" class="u-full-width" placeholder="Ex: Ombro D Flexão 170º"></textarea>
        
        <label>Força Muscular (MRC):</label>
        <textarea name="forca" class="u-full-width" placeholder="Ex: Quadríceps G4"></textarea>

        <label>Testes Especiais:</label>
        <textarea name="testes_especiais" class="u-full-width" placeholder="Ex: Neer (+), Lachman (-)"></textarea>
        
        <label style="font-weight:bold; margin-top:10px;">Diagnóstico e Conduta</label>
        <div class="row">
            <div class="col"><label>Diag. Cinético-Funcional:</label><textarea name="diagnostico" class="u-full-width"></textarea></div>
            <div class="col"><label>Objetivos/Plano:</label><textarea name="plano" class="u-full-width"></textarea></div>
        </div>
    `,

    "NeuroAdulto": `
        <h4 style="color:#6f42c1; border-bottom:1px solid #eee; padding-bottom:5px;">Neurofuncional Adulto</h4>
        <div class="row">
            <div class="col"><label>Diagnóstico Médico:</label><input name="diag_medico" class="u-full-width"></div>
            <div class="col"><label>Tempo de Lesão:</label><input name="tempo_lesao" class="u-full-width"></div>
        </div>
        
        <label>Queixa Principal / AVDs:</label>
        <textarea name="qp_avds" class="u-full-width"></textarea>

        <label style="font-weight:bold; margin-top:10px;">Exame Neurológico</label>
        <div class="row">
            <div class="col"><label>Tônus (Ashworth):</label><input name="tonus" class="u-full-width"></div>
            <div class="col"><label>Reflexos:</label><input name="reflexos" class="u-full-width"></div>
        </div>
        <div class="row">
            <div class="col"><label>Sensibilidade:</label><input name="sensibilidade" class="u-full-width"></div>
            <div class="col"><label>Coordenação:</label><input name="coordenacao" class="u-full-width"></div>
        </div>

        <label>Controle Motor / Equilíbrio (Tronco/Ortostatismo):</label>
        <textarea name="equilibrio" class="u-full-width"></textarea>

        <label>Marcha (Padrão, Auxílios):</label>
        <textarea name="marcha" class="u-full-width"></textarea>

        <label>Objetivos e Conduta:</label>
        <textarea name="conduta" class="u-full-width"></textarea>
    `,

    "NeuroPediatrica": `
        <h4 style="color:#e83e8c; border-bottom:1px solid #eee; padding-bottom:5px;">Neurofuncional Pediátrica</h4>
        <div class="row">
            <div class="col"><label>Idade Gestacional:</label><input name="idade_gestacional" class="u-full-width"></div>
            <div class="col"><label>APGAR / Peso:</label><input name="apgar_peso" class="u-full-width"></div>
        </div>
        
        <label>História Gestacional e Parto:</label>
        <textarea name="historia_parto" class="u-full-width"></textarea>

        <label style="font-weight:bold; margin-top:10px;">Desenvolvimento Neuropsicomotor (DNPM)</label>
        <label>Marcos Motores (Controle cervical, rolar, sentar, andar):</label>
        <textarea name="marcos_motores" class="u-full-width"></textarea>

        <div class="row">
            <div class="col"><label>Reflexos Primitivos:</label><input name="reflexos" class="u-full-width"></div>
            <div class="col"><label>Tônus:</label><input name="tonus" class="u-full-width"></div>
        </div>

        <label>Objetivos (Lúdico/Funcional):</label>
        <textarea name="objetivos" class="u-full-width"></textarea>
    `,

    "Respiratoria": `
        <h4 style="color:#17a2b8; border-bottom:1px solid #eee; padding-bottom:5px;">Fisioterapia Respiratória</h4>
        <div class="row">
            <div class="col"><label>Sinais: PA / FC / FR / SpO2:</label><input name="sinais_vitais" class="u-full-width"></div>
            <div class="col"><label>Uso de O2?</label><input name="uso_o2" class="u-full-width"></div>
        </div>

        <label>Ausculta Pulmonar:</label>
        <textarea name="ausculta" class="u-full-width" placeholder="Ex: MV+, Roncos em base..."></textarea>

        <div class="row">
            <div class="col"><label>Padrão Respiratório:</label><input name="padrao" class="u-full-width"></div>
            <div class="col"><label>Expansibilidade:</label><input name="expansibilidade" class="u-full-width"></div>
        </div>

        <label>Tosse e Secreção (Aspecto/Quantidade):</label>
        <input name="secrecao" class="u-full-width">

        <label>Conduta (Higiene brônquica, Reexpansão):</label>
        <textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Cardiovascular": `
        <h4 style="color:#dc3545; border-bottom:1px solid #eee; padding-bottom:5px;">Reabilitação Cardiovascular</h4>
        <label>Diagnóstico / Evento Cardíaco:</label>
        <input name="diag_cardio" class="u-full-width">

        <label>Fatores de Risco:</label>
        <textarea name="fatores_risco" class="u-full-width" placeholder="HAS, DM, Tabagismo, Sedentarismo..."></textarea>

        <div class="row">
            <div class="col"><label>PA Repouso:</label><input name="pa" class="u-full-width"></div>
            <div class="col"><label>FC Repouso:</label><input name="fc" class="u-full-width"></div>
        </div>

        <label>Capacidade Funcional / Sintomas (Dispneia/Angina):</label>
        <textarea name="capacidade" class="u-full-width"></textarea>

        <label>Plano de Treino (Fase):</label>
        <textarea name="plano" class="u-full-width"></textarea>
    `,

    "Uroginecologica": `
        <h4 style="color:#d63384; border-bottom:1px solid #eee; padding-bottom:5px;">Saúde da Mulher / Pélvica</h4>
        <div class="row">
            <div class="col"><label>Gestações/Partos:</label><input name="gpa" class="u-full-width"></div>
            <div class="col"><label>Cirurgias Pélvicas:</label><input name="cirurgias" class="u-full-width"></div>
        </div>

        <label>Queixa Principal (Incontinência, Dor, Prolapso):</label>
        <textarea name="qp" class="u-full-width"></textarea>

        <label>História Miccional/Intestinal:</label>
        <textarea name="historia_miccional" class="u-full-width"></textarea>

        <label>Avaliação Muscular (MAP - Força/Resistência):</label>
        <input name="map" class="u-full-width">

        <label>Conduta:</label>
        <textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Dermatofuncional": `
        <h4 style="color:#fd7e14; border-bottom:1px solid #eee; padding-bottom:5px;">Dermatofuncional</h4>
        <label>Queixa Principal (Estética/Reparadora):</label>
        <textarea name="qp" class="u-full-width"></textarea>

        <label>Avaliação da Pele / Tecido:</label>
        <textarea name="pele" class="u-full-width" placeholder="Hidratação, Cicatriz, Fibrose..."></textarea>

        <label>Edema (Local/Grau):</label>
        <input name="edema" class="u-full-width">

        <label>Perimetria (Medidas):</label>
        <textarea name="perimetria" class="u-full-width"></textarea>

        <label>Objetivos:</label>
        <textarea name="objetivos" class="u-full-width"></textarea>
    `,

    "Esportiva": `
        <h4 style="color:#20c997; border-bottom:1px solid #eee; padding-bottom:5px;">Fisioterapia Esportiva</h4>
        <div class="row">
            <div class="col"><label>Modalidade:</label><input name="esporte" class="u-full-width"></div>
            <div class="col"><label>Posição/Nível:</label><input name="posicao" class="u-full-width"></div>
        </div>

        <label>Histórico de Lesões:</label>
        <textarea name="lesoes" class="u-full-width"></textarea>

        <label>Gesto Esportivo / Biomecânica:</label>
        <textarea name="gesto" class="u-full-width"></textarea>

        <label>Testes Funcionais (Salto, Aterrissagem, Core):</label>
        <textarea name="testes" class="u-full-width"></textarea>

        <label>Fase de Retorno (RTP):</label>
        <input name="rtp" class="u-full-width">
    `,

    "Geriatrica": `
        <h4 style="color:#6c757d; border-bottom:1px solid #eee; padding-bottom:5px;">Gerontologia</h4>
        <label>Queixas Principais / Doenças Crônicas:</label>
        <textarea name="comorbidades" class="u-full-width"></textarea>

        <label>Histórico de Quedas (Último ano):</label>
        <textarea name="quedas" class="u-full-width"></textarea>

        <label>Avaliação Funcional (AVDs - Katz/Lawton):</label>
        <textarea name="avds" class="u-full-width"></textarea>

        <div class="row">
            <div class="col"><label>Equilíbrio (Berg/TUG):</label><input name="equilibrio" class="u-full-width"></div>
            <div class="col"><label>Marcha:</label><input name="marcha" class="u-full-width"></div>
        </div>

        <label>Conduta (Prevenção/Manutenção):</label>
        <textarea name="conduta" class="u-full-width"></textarea>
    `,

    "Ergonomia": `
        <h4 style="color:#343a40; border-bottom:1px solid #eee; padding-bottom:5px;">Ergonomia e Trabalho</h4>
        <div class="row">
            <div class="col"><label>Função/Cargo:</label><input name="funcao" class="u-full-width"></div>
            <div class="col"><label>Jornada/Pausas:</label><input name="jornada" class="u-full-width"></div>
        </div>

        <label>Descrição da Tarefa (Real x Prescrito):</label>
        <textarea name="tarefa" class="u-full-width"></textarea>

        <label>Análise do Posto de Trabalho:</label>
        <textarea name="posto" class="u-full-width" placeholder="Mobiliário, Equipamentos..."></textarea>

        <label>Queixas Osteomusculares (LER/DORT):</label>
        <textarea name="queixas" class="u-full-width"></textarea>

        <label>Recomendações Ergonômicas:</label>
        <textarea name="recomendacoes" class="u-full-width"></textarea>
    `
};