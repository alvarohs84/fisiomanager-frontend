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
        <h4 style="color:#17a2b8; border-bottom:2px solid #17a2b8; padding-bottom:5px; margin-bottom:15px;">Ficha de Avaliação Respiratória</h4>
        
        <div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px;">
            <label style="font-weight:bold; color:#333;">1. Identificação Clínica</label>
            <div class="row">
                <div class="col"><label>Data:</label><input type="date" name="data_av" class="u-full-width"></div>
                <div class="col"><label>Leito / Setor:</label><input name="leito" class="u-full-width"></div>
            </div>
            <label>Diagnóstico Clínico:</label><input name="diag_clinico" class="u-full-width">
            <div class="row">
                <div class="col"><label>Encaminhado por:</label><input name="encaminhado" class="u-full-width"></div>
                <div class="col"><label>Início sintomas:</label><input type="date" name="data_sintomas" class="u-full-width"></div>
            </div>
        </div>

        <label style="font-weight:bold; color:#0056b3;">2. Queixa Principal</label>
        <div style="display: flex; gap: 15px; flex-wrap:wrap; margin-bottom:10px;">
            <label><input type="checkbox" name="qp_dispneia" value="Sim"> Dispneia</label>
            <label><input type="checkbox" name="qp_tosse" value="Sim"> Tosse</label>
            <label><input type="checkbox" name="qp_dor" value="Sim"> Dor torácica</label>
            <label><input type="checkbox" name="qp_cansaco" value="Sim"> Cansaço</label>
            <label><input type="checkbox" name="qp_expect" value="Sim"> Expectoração</label>
        </div>
        <input name="qp_outro" class="u-full-width" placeholder="Outro...">

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">3. História da Doença Atual (HDA)</label>
        <textarea name="hda" class="u-full-width" rows="3" placeholder="Evolução, tratamentos prévios, oxigenoterapia..."></textarea>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">4. Antecedentes e Hábitos</label>
        <div style="display: flex; gap: 10px; flex-wrap:wrap;">
            <label><input type="checkbox" name="ant_dpoc" value="Sim"> DPOC</label>
            <label><input type="checkbox" name="ant_asma" value="Sim"> Asma</label>
            <label><input type="checkbox" name="ant_ic" value="Sim"> Insuf. Cardíaca</label>
            <label><input type="checkbox" name="ant_pneumonia" value="Sim"> Pneumonia prévia</label>
        </div>
        <div class="row">
            <div class="col"><label>Cirurgias:</label><input name="cirurgias" class="u-full-width"></div>
            <div class="col"><label>Alergias:</label><input name="alergias" class="u-full-width"></div>
        </div>
        <div class="row">
            <div class="col"><label>Tabagismo:</label><select name="tabagismo" class="u-full-width"><option value="Não">Não</option><option value="Sim">Sim</option><option value="Ex">Ex-tabagista</option></select></div>
            <div class="col"><label>Carga (maços/ano):</label><input name="carga_tabagica" class="u-full-width"></div>
        </div>
        <div class="row">
            <div class="col"><label>Etilismo:</label><select name="etilismo" class="u-full-width"><option value="Não">Não</option><option value="Sim">Sim</option></select></div>
            <div class="col"><label>Ativ. Física:</label><select name="ativ_fisica" class="u-full-width"><option value="Não">Não</option><option value="Sim">Sim</option></select></div>
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">5. Sinais Vitais</label>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
            <div><label>FC (bpm)</label><input type="number" name="fc" class="u-full-width"></div>
            <div><label>FR (rpm)</label><input type="number" name="fr" class="u-full-width"></div>
            <div><label>PA (mmHg)</label><input name="pa" class="u-full-width"></div>
            <div><label>SpO2 (%)</label><input type="number" name="spo2" class="u-full-width"></div>
            <div><label>Temp (°C)</label><input name="temp" class="u-full-width"></div>
            <div><label>PFE (L/min)</label><input name="pfe" class="u-full-width"></div>
        </div>

        <h5 style="color:#17a2b8; margin-top:20px; border-bottom:1px solid #eee;">6. Avaliação Física</h5>
        
        <label style="font-weight:bold;">6.1 Inspeção</label>
        <div class="row">
            <div class="col">
                <label>Tipo:</label>
                <select name="tipo_torax" class="u-full-width">
                    <option value="Costoabdominal">Costoabdominal</option>
                    <option value="Torácico">Torácico Sup.</option>
                    <option value="Abdominal">Abdominal</option>
                </select>
            </div>
            <div class="col">
                <label>Padrão:</label>
                <select name="padrao_resp" class="u-full-width">
                    <option value="Eupneico">Eupneico</option>
                    <option value="Taquipneico">Taquipneico</option>
                    <option value="Bradipneico">Bradipneico</option>
                    <option value="Irregular">Irregular</option>
                </select>
            </div>
        </div>
        <div style="display: flex; gap: 15px; flex-wrap:wrap;">
            <label><input type="checkbox" name="musc_acessoria"> Musc. Acessória</label>
            <label><input type="checkbox" name="cianose"> Cianose</label>
            <label><input type="checkbox" name="tiragem"> Tiragem</label>
            <label><input type="checkbox" name="exp_diminuida"> Expansib. Diminuída</label>
        </div>
        <label>Deformidades:</label><input name="deformidades" class="u-full-width">

        <label style="font-weight:bold; margin-top:10px;">6.2 Palpação e Percussão</label>
        <div class="row">
            <div class="col"><label>Mobilidade:</label><select name="mobilidade" class="u-full-width"><option value="Simétrica">Simétrica</option><option value="Assimétrica">Assimétrica</option></select></div>
            <div class="col"><label>FTV:</label><select name="ftv" class="u-full-width"><option value="Normal">Normal</option><option value="Aumentado">Aumentado</option><option value="Diminuído">Diminuído</option></select></div>
            <div class="col"><label>Som:</label><select name="som_percussao" class="u-full-width"><option value="Claro Pulmonar">Claro Pulmonar</option><option value="Hipersonoridade">Hipersonoridade</option><option value="Macicez">Macicez</option></select></div>
        </div>

        <label style="font-weight:bold; margin-top:10px;">6.4 Ausculta Pulmonar</label>
        <table width="100%" style="font-size:0.8rem; margin-bottom:10px;">
            <tr style="background:#eee;"><th>Região</th><th>Som Respiratório</th><th>Ruídos</th></tr>
            <tr><td>Apical</td><td><input name="ap_som" class="u-full-width"></td><td><input name="ap_ruido" class="u-full-width"></td></tr>
            <tr><td>Média</td><td><input name="md_som" class="u-full-width"></td><td><input name="md_ruido" class="u-full-width"></td></tr>
            <tr><td>Basal</td><td><input name="bs_som" class="u-full-width"></td><td><input name="bs_ruido" class="u-full-width"></td></tr>
        </table>
        <label>Ruídos Predominantes:</label>
        <div style="display: flex; gap: 10px; flex-wrap:wrap;">
            <label><input type="checkbox" name="ra_sibilos"> Sibilos</label>
            <label><input type="checkbox" name="ra_estertores"> Estertores</label>
            <label><input type="checkbox" name="ra_roncos"> Roncos</label>
            <label><input type="checkbox" name="ra_ausencia"> Ausência</label>
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">7. Tosse e Secreção</label>
        <div class="row">
            <div class="col"><label>Tosse:</label><select name="tosse_tipo" class="u-full-width"><option value="Eficaz">Eficaz</option><option value="Ineficaz">Ineficaz</option><option value="Seca">Seca</option><option value="Produtiva">Produtiva</option></select></div>
            <div class="col"><label>Volume:</label><select name="sec_volume" class="u-full-width"><option value="Escasso">Escasso</option><option value="Moderado">Moderado</option><option value="Abundante">Abundante</option></select></div>
        </div>
        <div class="row">
            <div class="col"><label>Cor:</label><input name="sec_cor" class="u-full-width"></div>
            <div class="col"><label>Viscosidade:</label><select name="sec_visc" class="u-full-width"><option value="Fluida">Fluida</option><option value="Espessa">Espessa</option></select></div>
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">8. Exames Complementares</label>
        <label>RX / TC:</label><input name="exame_imagem" class="u-full-width">
        <label>Gasometria (pH / PaO2 / PaCO2 / HCO3 / SaO2):</label>
        <input name="gasometria" class="u-full-width" placeholder="Ex: 7.35 / 80 / 40 / 24 / 98%">

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">9. Diagnóstico Fisioterapêutico</label>
        <textarea name="diagnostico_fisio" class="u-full-width" rows="3"></textarea>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">10. Conduta</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
            <label><input type="checkbox" name="cdt_higiene"> Higiene Brônquica</label>
            <label><input type="checkbox" name="cdt_ex_vent"> Exerc. Ventilatórios</label>
            <label><input type="checkbox" name="cdt_tmi"> Treino Musc. Resp.</label>
            <label><input type="checkbox" name="cdt_vni"> VNI</label>
            <label><input type="checkbox" name="cdt_motor"> Mobilização/Motor</label>
        </div>
        <label>Obs:</label><input name="conduta_obs" class="u-full-width">
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