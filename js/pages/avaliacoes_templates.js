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
        <h4 style="color:#17a2b8; border-bottom:2px solid #17a2b8; padding-bottom:5px; margin-bottom:15px;">Protocolo de Reabilitação Pulmonar</h4>
        
        <div class="tab-container">
            <div class="tab-btn active" onclick="window.mudarAba(1)">1. História</div>
            <div class="tab-btn" onclick="window.mudarAba(2)">2. Exame Físico</div>
            <div class="tab-btn" onclick="window.mudarAba(3)">3. Funcional / TC6</div>
            <div class="tab-btn" onclick="window.mudarAba(4)">4. Escalas e Exames</div>
            <div class="tab-btn" onclick="window.mudarAba(5)">5. Nutri / Psico / Risco</div>
            <div class="tab-btn" onclick="window.mudarAba(6)">6. Plano</div>
        </div>

        <div id="tab-1" class="tab-content active">
            <h5 style="color:#0056b3;">1. Identificação e Queixa</h5>
            <div class="row">
                <div class="col"><label>Profissão:</label><input name="profissao" class="u-full-width"></div>
                <div class="col"><label>Diagnóstico Principal:</label><input name="diag_medico" class="u-full-width"></div>
            </div>
            <div class="row">
                <div class="col"><label>Tempo de Doença:</label><input name="tempo_doenca" class="u-full-width"></div>
                <div class="col"><label>Comorbidades:</label><input name="comorbidades" class="u-full-width"></div>
            </div>
            <label>Queixa Principal / Expectativa:</label>
            <textarea name="qp" class="u-full-width" placeholder="Dispneia? Cansaço? O que espera da reabilitação?"></textarea>

            <h5 style="color:#0056b3; margin-top:15px;">2. História Clínica Dirigida</h5>
            <label>História da Doença Respiratória (Início, Padrão, Fatores):</label>
            <textarea name="hda" class="u-full-width" placeholder="Crônico? Progressivo? Fatores desencadeantes?"></textarea>
            
            <label>Exacerbações (Último ano / Internações / UTI):</label>
            <input name="exacerbacoes" class="u-full-width">

            <label style="font-weight:bold; margin-top:10px;">Hábitos:</label>
            <div class="row">
                <div class="col">
                    <label>Tabagismo:</label>
                    <select name="tabagismo" class="u-full-width">
                        <option value="Nao">Não</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Ex">Ex-tabagista</option>
                        <option value="Passivo">Passivo</option>
                    </select>
                </div>
                <div class="col"><label>Carga (maços/ano):</label><input name="carga_tabagica" class="u-full-width"></div>
                <div class="col"><label>Sono:</label><input name="sono" class="u-full-width" placeholder="Apneia? Ortopneia?"></div>
            </div>
            <label>Exposição Ocupacional:</label><input name="exposicao" class="u-full-width" placeholder="Poeira, químicos...">

            <label style="font-weight:bold; margin-top:10px;">Medicamentos:</label>
            <textarea name="medicacoes" class="u-full-width" placeholder="Broncodilatadores, O2 domiciliar, Aderência..."></textarea>
        </div>

        <div id="tab-2" class="tab-content" style="display:none;">
            <h5 style="color:#0056b3;">3. Exame Físico Respiratório</h5>
            
            <label style="font-weight:bold;">3.1 Sinais Vitais (Repouso)</label>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
                <div><label>FC (bpm)</label><input name="fc_rep" class="u-full-width"></div>
                <div><label>PA (mmHg)</label><input name="pa_rep" class="u-full-width"></div>
                <div><label>FR (rpm)</label><input name="fr_rep" class="u-full-width"></div>
                <div><label>SpO2 (%)</label><input name="spo2_rep" class="u-full-width"></div>
                <div><label>Temp (°C)</label><input name="temp" class="u-full-width"></div>
                <div><label>O2 (L/min)</label><input name="o2_basal" class="u-full-width" placeholder="Ar amb."></div>
            </div>

            <label style="font-weight:bold; margin-top:15px;">3.2 Inspeção</label>
            <div class="row">
                <div class="col">
                    <label>Padrão Respiratório:</label>
                    <select name="padrao_resp" class="u-full-width">
                        <option value="Toracoabdominal">Toracoabdominal</option>
                        <option value="Apical">Apical</option>
                        <option value="Paradoxal">Paradoxal</option>
                        <option value="Musc Acessoria">Uso Musc. Acessória</option>
                    </select>
                </div>
                <div class="col">
                    <label>Tipo de Tórax:</label>
                    <input name="tipo_torax" class="u-full-width" placeholder="Enfisematoso, Cifoescoliose...">
                </div>
            </div>
            <div style="display: flex; gap: 15px; flex-wrap:wrap;">
                <label><input type="checkbox" name="sinal_cianose" value="Sim"> Cianose</label>
                <label><input type="checkbox" name="sinal_baqueteamento" value="Sim"> Baqueteamento</label>
                <label><input type="checkbox" name="sinal_edema" value="Sim"> Edema MMII</label>
            </div>
            <label>Estado Geral (Caquético/Obeso):</label><input name="estado_geral" class="u-full-width">

            <label style="font-weight:bold; margin-top:15px;">3.3 Palpação / Ausculta</label>
            <label>Ausculta Pulmonar:</label>
            <textarea name="ausculta" class="u-full-width" placeholder="MV, Sibilos, Roncos, Estertores..."></textarea>
            <div class="row">
                <div class="col"><label>Expansibilidade:</label><input name="expansibilidade" class="u-full-width"></div>
                <div class="col"><label>Percussão:</label><input name="percussao" class="u-full-width"></div>
            </div>
        </div>

        <div id="tab-3" class="tab-content" style="display:none;">
            <h5 style="color:#0056b3;">4. Capacidade de Exercício</h5>

            <div style="border: 2px solid #007bff; border-radius: 8px; padding: 15px; background-color: #f0f8ff;">
                <h5 style="color: #0056b3; font-weight: bold; margin-bottom: 10px;">🚶 TC6 - Teste de Caminhada</h5>
                
                <div class="row" style="margin-bottom: 10px;">
                    <div class="col"><label>Sexo</label><select id="tc6_sexo" name="tc6_sexo" class="u-full-width" onchange="window.calcularTC6()"><option value="">Selecione...</option><option value="M">M</option><option value="F">F</option></select></div>
                    <div class="col"><label>Idade</label><input type="number" id="tc6_idade" name="tc6_idade" class="u-full-width" oninput="window.calcularTC6()"></div>
                    <div class="col"><label>Altura (cm)</label><input type="number" id="tc6_altura" name="tc6_altura" class="u-full-width" placeholder="175" oninput="window.calcularTC6()"></div>
                    <div class="col"><label>Peso (kg)</label><input type="number" id="tc6_peso" name="tc6_peso" class="u-full-width" oninput="window.calcularTC6()"></div>
                </div>

                <table width="100%" style="font-size:0.85rem; margin-bottom: 10px; background:white;">
                    <tr style="background:#e9ecef;"><th>Parâmetro</th><th>Repouso</th><th>6º Minuto</th></tr>
                    <tr><td>FC</td><td><input name="tc6_fc_ini" class="u-full-width"></td><td><input name="tc6_fc_fim" class="u-full-width"></td></tr>
                    <tr><td>SpO2</td><td><input name="tc6_spo2_ini" class="u-full-width"></td><td><input name="tc6_spo2_fim" class="u-full-width"></td></tr>
                    <tr><td>Borg (Dispn.)</td><td><input name="tc6_borg_d_ini" class="u-full-width"></td><td><input name="tc6_borg_d_fim" class="u-full-width"></td></tr>
                    <tr><td>Borg (MMII)</td><td><input name="tc6_borg_m_ini" class="u-full-width"></td><td><input name="tc6_borg_m_fim" class="u-full-width"></td></tr>
                    <tr><td>PA</td><td><input name="tc6_pa_ini" class="u-full-width"></td><td><input name="tc6_pa_fim" class="u-full-width"></td></tr>
                </table>

                <div style="background: #e7f1ff; padding: 10px; border-radius: 5px; border: 1px solid #b6d4fe; margin-bottom:10px;">
                    <div class="row">
                        <div class="col"><label style="font-weight:bold; color: #0056b3;">Distância (m)</label><input type="number" id="tc6_distancia" name="tc6_distancia" class="u-full-width" style="border: 2px solid #0056b3;" oninput="window.calcularTC6()"></div>
                        <div class="col"><label>Previsto:</label><input type="text" id="tc6_previsto" name="tc6_previsto" class="u-full-width" readonly style="background: #eee; font-weight: bold;"></div>
                        <div class="col"><label>%:</label><input type="text" id="tc6_porcentagem" name="tc6_porcentagem" class="u-full-width" readonly style="background: #d4edda; color: #155724; font-weight: bold;"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="col"><label>O2 Durante?</label><input name="tc6_o2_durante" class="u-full-width" placeholder="Não ou X L/min"></div>
                    <div class="col"><label>Pausas?</label><input name="tc6_pausas" class="u-full-width"></div>
                </div>
                <label>Sintomas / Obs:</label><input name="tc6_sintomas" class="u-full-width">
            </div>

            <label style="margin-top:15px; font-weight:bold;">Outros Testes (Se não TC6):</label>
            <input name="outros_testes" class="u-full-width" placeholder="ISWT, Degrau...">
        </div>

        <div id="tab-4" class="tab-content" style="display:none;">
            <h5 style="color:#0056b3;">5. Escalas e Qualidade de Vida</h5>
            <div class="row">
                <div class="col">
                    <label>Dispneia mMRC (0-4):</label>
                    <select name="mmrc" class="u-full-width"><option value="0">0 - Exercício intenso</option><option value="1">1 - Apressar passo</option><option value="2">2 - Anda devagar</option><option value="3">3 - Para p/ respirar</option><option value="4">4 - Não sai de casa</option></select>
                </div>
                <div class="col">
                    <label>Score CAT / SGRQ / ACT:</label>
                    <input name="score_qv" class="u-full-width">
                </div>
            </div>

            <h5 style="color:#0056b3; margin-top:15px;">6. Função Pulmonar (Exames)</h5>
            <div class="row">
                <div class="col"><label>Espirometria (VEF1/CVF):</label><input name="espirometria" class="u-full-width"></div>
                <div class="col"><label>Gasometria:</label><input name="gasometria" class="u-full-width"></div>
            </div>
            <label>Imagem (RX/TC):</label><input name="imagem_torax" class="u-full-width">
        </div>

        <div id="tab-5" class="tab-content" style="display:none;">
            <h5 style="color:#0056b3;">7. Avaliação Muscular</h5>
            <label>Musculatura Periférica (Força/Tônus/Trofismo):</label>
            <textarea name="aval_musc_perif" class="u-full-width" placeholder="Handgrip, Sentar-levantar, MRC..."></textarea>
            
            <label>Musculatura Respiratória:</label>
            <div class="row">
                <div class="col"><label>PImáx:</label><input name="pimax" class="u-full-width"></div>
                <div class="col"><label>PEmáx:</label><input name="pemax" class="u-full-width"></div>
            </div>

            <h5 style="color:#0056b3; margin-top:15px;">8. Nutricional e Psicossocial</h5>
            <div class="row">
                <div class="col"><label>IMC:</label><input name="imc_resp" class="u-full-width"></div>
                <div class="col"><label>Perda Peso Recente?</label><input name="perda_peso" class="u-full-width"></div>
            </div>
            <label>Psicossocial (Ansiedade/Depressão/Apoio):</label>
            <textarea name="psicossocial" class="u-full-width"></textarea>

            <h5 style="color:#dc3545; margin-top:15px;">10. Análise de Risco</h5>
            <textarea name="risco_seguranca" class="u-full-width" placeholder="Angina, Arritmias, Descompensação, Aptidão..."></textarea>
        </div>

        <div id="tab-6" class="tab-content" style="display:none;">
            <h5 style="color:#28a745;">11. Objetivos e Plano</h5>
            <label>Objetivos Gerais:</label>
            <textarea name="obj_gerais" class="u-full-width" placeholder="Reduzir dispneia, Aumentar tolerância..."></textarea>
            
            <label>Objetivos Específicos (Metas):</label>
            <textarea name="obj_especificos" class="u-full-width" placeholder="Aumentar TC6 em 30m, Reduzir mMRC..."></textarea>

            <label>Plano Inicial de Treino:</label>
            <textarea name="plano_treino" class="u-full-width" rows="4" placeholder="Tipo (Aeróbio/Força), Frequência, Intensidade, O2 no treino..."></textarea>
        </div>
    `,

    "Cardiovascular": `
        <h4 style="color:#dc3545; border-bottom:2px solid #dc3545; padding-bottom:5px; margin-bottom:15px;">Ficha de Avaliação Cardiopulmonar</h4>

        <div style="background:#f8f9fa; padding:15px; border-radius:6px; border:1px solid #eee; margin-bottom:20px;">
            <label style="font-weight:bold; color:#333; margin-bottom:10px;">1. Dados de Identificação</label>
            <div class="row">
                <div class="col"><label>Data da Avaliação:</label><input type="date" name="data_av" class="u-full-width"></div>
                <div class="col"><label>Leito / Setor:</label><input name="leito" class="u-full-width"></div>
            </div>
            <label>Diagnóstico Clínico:</label><input name="diag_clinico" class="u-full-width">
            <div class="row">
                <div class="col"><label>Encaminhado por:</label><input name="encaminhado" class="u-full-width"></div>
                <div class="col"><label>Data Início Sintomas/Internação:</label><input type="date" name="data_inicio" class="u-full-width"></div>
            </div>
            <label>Profissão:</label><input name="profissao" class="u-full-width">
            <label>Acompanhante:</label><input name="acompanhante" class="u-full-width">
        </div>

        <label style="font-weight:bold; color:#0056b3;">2. Queixa Principal</label>
        <textarea name="qp" class="u-full-width" rows="2"></textarea>

        <label style="font-weight:bold; color:#0056b3;">3. História da Doença Atual (HDA)</label>
        <textarea name="hda" class="u-full-width" rows="3" placeholder="Início, fatores desencadeantes, progressão..."></textarea>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">4. Antecedentes Pessoais</label>
        
        <div style="background:#fff3cd; padding:10px; border-radius:5px; margin-bottom:10px;">
            <strong style="color:#856404; font-size:0.8rem;">CARDÍACOS</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <label><input type="checkbox" name="ant_has" value="Sim"> HAS</label>
                <label><input type="checkbox" name="ant_coronaria" value="Sim"> D. Coronariana</label>
                <label><input type="checkbox" name="ant_arritmia" value="Sim"> Arritmias</label>
                <label><input type="checkbox" name="ant_ic" value="Sim"> Insuf. Cardíaca</label>
            </div>
            <div class="row" style="margin-top:5px;">
                <div class="col"><label>IAM Prévio (Data):</label><input name="data_iam" class="u-full-width"></div>
                <div class="col"><label>Cirurgias Cardíacas:</label><input name="cirur_cardio" class="u-full-width"></div>
            </div>
        </div>

        <div style="background:#e2e3e5; padding:10px; border-radius:5px; margin-bottom:10px;">
            <strong style="color:#383d41; font-size:0.8rem;">PULMONARES</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <label><input type="checkbox" name="ant_asma" value="Sim"> Asma</label>
                <label><input type="checkbox" name="ant_dpoc" value="Sim"> DPOC</label>
                <label><input type="checkbox" name="ant_bronqui" value="Sim"> Bronquiectasias</label>
                <label><input type="checkbox" name="ant_tb" value="Sim"> Tuberculose</label>
            </div>
        </div>

        <div style="background:#d1e7dd; padding:10px; border-radius:5px;">
            <strong style="color:#0f5132; font-size:0.8rem;">OUTROS / HÁBITOS</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <label><input type="checkbox" name="ant_dm" value="Sim"> Diabetes</label>
                <label><input type="checkbox" name="ant_obesidade" value="Sim"> Obesidade</label>
            </div>
            <label style="margin-top:5px;">Tabagismo:</label>
            <select name="tabagismo" class="u-full-width"><option value="Nao">Não</option><option value="Atual">Atual</option><option value="Ex">Ex-Tabagista</option></select>
            <input name="carga_tabagica" class="u-full-width" placeholder="Carga tabágica (maços/ano)">
            <label>Etilismo:</label><input name="etilismo" class="u-full-width">
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">5. Medicações em Uso</label>
        <textarea name="medicacoes" class="u-full-width"></textarea>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">6. Exames Complementares</label>
        <div class="row">
            <div class="col"><label>ECG:</label><input name="ex_ecg" class="u-full-width"></div>
            <div class="col"><label>Ecocardiograma:</label><input name="ex_eco" class="u-full-width"></div>
        </div>
        <div class="row">
            <div class="col"><label>Teste Ergométrico:</label><input name="ex_ergo" class="u-full-width"></div>
            <div class="col"><label>Espirometria:</label><input name="ex_espiro" class="u-full-width"></div>
        </div>
        <label>RX / TC Tórax:</label><input name="ex_imagem" class="u-full-width">

        <label style="font-weight:bold; color:#dc3545; margin-top:15px;">7. Sinais Vitais (Repouso)</label>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
            <div><label>PA (mmHg)</label><input name="pa" class="u-full-width"></div>
            <div><label>FC (bpm)</label><input name="fc" class="u-full-width"></div>
            <div><label>FR (irpm)</label><input name="fr" class="u-full-width"></div>
            <div><label>SpO2 (%)</label><input name="spo2" class="u-full-width"></div>
            <div><label>Temp (°C)</label><input name="temp" class="u-full-width"></div>
            <div><label>O2 (L/min)</label><input name="o2_basal" class="u-full-width" placeholder="Ar amb."></div>
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">8. Inspeção Geral</label>
        <div style="display: flex; gap: 10px; flex-wrap:wrap;">
            <label><input type="checkbox" name="insp_cianose" value="Sim"> Cianose</label>
            <label><input type="checkbox" name="insp_edema" value="Sim"> Edema</label>
            <label><input type="checkbox" name="insp_jugular" value="Sim"> Turgência Jugular</label>
            <label><input type="checkbox" name="insp_musc" value="Sim"> Musc. Acessória</label>
            <label><input type="checkbox" name="insp_ortopneia" value="Sim"> Ortopneia</label>
        </div>
        <label>Estado Geral:</label><input name="estado_geral" class="u-full-width">

        <h5 style="color:#17a2b8; border-bottom:1px solid #eee; margin-top:20px;">9. Avaliação Respiratória</h5>
        <div class="row">
            <div class="col"><label>Tipo:</label><select name="tipo_resp" class="u-full-width"><option value="Misto">Misto</option><option value="Toracico">Torácico</option><option value="Abdominal">Abdominal</option></select></div>
            <div class="col"><label>Ritmo:</label><input name="ritmo_resp" class="u-full-width"></div>
        </div>
        <label>Palpação (Expansibilidade / Frêmito):</label><input name="palpacao_torax" class="u-full-width">
        <label>Percussão (Sons):</label><input name="percussao" class="u-full-width">
        
        <label style="font-weight:bold; margin-top:5px;">Ausculta:</label>
        <div class="row">
            <div class="col"><label>MV:</label><select name="mv" class="u-full-width"><option value="Presente">Presente</option><option value="Diminuido">Diminuído</option></select></div>
            <div class="col"><label>Ruídos:</label><input name="ruidos_adv" class="u-full-width" placeholder="Sibilos, estertores..."></div>
        </div>
        <label>Secreção (Cor/Qtd/Visc):</label><input name="secrecao" class="u-full-width">

        <h5 style="color:#dc3545; border-bottom:1px solid #eee; margin-top:20px;">10. Avaliação Cardiovascular</h5>
        <label>Ausculta Cardíaca (Bulhas/Sopros):</label><input name="ausculta_cardio" class="u-full-width">
        <div class="row">
            <div class="col"><label>Perfusão Periférica:</label><input name="perfusao" class="u-full-width"></div>
            <div class="col"><label>Pulsos:</label><input name="pulsos" class="u-full-width"></div>
        </div>
        <label>Dispneia mMRC (0-4):</label>
        <select name="mmrc" class="u-full-width"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>

        <div style="border: 2px solid #007bff; border-radius: 8px; padding: 15px; margin-top: 20px; background-color: #f0f8ff;">
            <h5 style="color: #0056b3; font-weight: bold; margin-bottom: 10px;">11. Teste de Caminhada (TC6)</h5>
            
            <div class="row" style="margin-bottom: 10px;">
                <div class="col"><label>Sexo</label><select id="tc6_sexo" name="tc6_sexo" class="u-full-width" onchange="window.calcularTC6()"><option value="">Selecione...</option><option value="M">M</option><option value="F">F</option></select></div>
                <div class="col"><label>Idade</label><input type="number" id="tc6_idade" name="tc6_idade" class="u-full-width" oninput="window.calcularTC6()"></div>
                <div class="col"><label>Altura (cm)</label><input type="number" id="tc6_altura" name="tc6_altura" class="u-full-width" placeholder="175" oninput="window.calcularTC6()"></div>
                <div class="col"><label>Peso (kg)</label><input type="number" id="tc6_peso" name="tc6_peso" class="u-full-width" oninput="window.calcularTC6()"></div>
            </div>

            <table width="100%" style="font-size:0.85rem; margin-bottom: 10px; background:white;">
                <tr style="background:#e9ecef;"><th>Variável</th><th>Inicial</th><th>Final (6')</th></tr>
                <tr><td>FC</td><td><input name="tc6_fc_ini" class="u-full-width"></td><td><input name="tc6_fc_fim" class="u-full-width"></td></tr>
                <tr><td>SpO2</td><td><input name="tc6_spo2_ini" class="u-full-width"></td><td><input name="tc6_spo2_fim" class="u-full-width"></td></tr>
                <tr><td>Borg Dispneia</td><td><input name="tc6_borg_d_ini" class="u-full-width"></td><td><input name="tc6_borg_d_fim" class="u-full-width"></td></tr>
                <tr><td>Borg Fadiga</td><td><input name="tc6_borg_m_ini" class="u-full-width"></td><td><input name="tc6_borg_m_fim" class="u-full-width"></td></tr>
            </table>

            <div style="background: #e7f1ff; padding: 10px; border-radius: 5px; border: 1px solid #b6d4fe; margin-bottom:10px;">
                <div class="row">
                    <div class="col"><label style="font-weight:bold; color: #0056b3;">Distância (m)</label><input type="number" id="tc6_distancia" name="tc6_distancia" class="u-full-width" style="border: 2px solid #0056b3;" oninput="window.calcularTC6()"></div>
                    <div class="col"><label>% Previsto:</label><input type="text" id="tc6_porcentagem" name="tc6_porcentagem" class="u-full-width" readonly style="background: #d4edda; font-weight: bold;"></div>
                    <input type="hidden" id="tc6_previsto" name="tc6_previsto"> </div>
            </div>

            <div class="row">
                <div class="col"><label>Uso de O2 (L/min):</label><input name="tc6_o2" class="u-full-width"></div>
                <div class="col"><label>Nº de Paradas:</label><input name="tc6_paradas" class="u-full-width"></div>
                <div class="col"><label>SpO2 Mínima:</label><input name="tc6_spo2_min" class="u-full-width"></div>
            </div>
            
            <label style="margin-top:10px; font-weight:bold;">Força Muscular Respiratória:</label>
            <div class="row">
                <div class="col"><label>Pimáx:</label><input name="pimax" class="u-full-width" placeholder="cmH2O"></div>
                <div class="col"><label>Pemáx:</label><input name="pemax" class="u-full-width" placeholder="cmH2O"></div>
            </div>
        </div>

        <label style="font-weight:bold; color:#0056b3; margin-top:15px;">12. Diagnóstico Fisioterapêutico</label>
        <textarea name="diagnostico_fisio" class="u-full-width"></textarea>

        <label style="font-weight:bold; color:#0056b3;">13. Objetivos (Curto/Médio/Longo)</label>
        <textarea name="objetivos" class="u-full-width"></textarea>

        <label style="font-weight:bold; color:#0056b3;">14. Plano de Tratamento</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
            <label><input type="checkbox" name="cond_aerobio" value="Sim"> Treino Aeróbio</label>
            <label><input type="checkbox" name="cond_forca" value="Sim"> Força Periférica</label>
            <label><input type="checkbox" name="cond_tmi" value="Sim"> TMI (Respiratório)</label>
            <label><input type="checkbox" name="cond_higiene" value="Sim"> Higiene Brônquica</label>
            <label><input type="checkbox" name="cond_expansao" value="Sim"> Expansão Pulmonar</label>
            <label><input type="checkbox" name="cond_educacao" value="Sim"> Educação em Saúde</label>
        </div>
        <div class="row">
            <div class="col"><label>Frequência Semanal:</label><input name="freq_semanal" class="u-full-width"></div>
        </div>

        <label style="font-weight:bold; color:#0056b3;">15. Observações Gerais</label>
        <textarea name="obs_gerais" class="u-full-width"></textarea>
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