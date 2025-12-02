export const templates = {
    "Completa": `
        <div class="tab-container">
            <button type="button" class="tab-btn active" onclick="window.mudarAba(1)">1. Anamnese</button>
            <button type="button" class="tab-btn" onclick="window.mudarAba(2)">2. Dor (EVA)</button>
            <button type="button" class="tab-btn" onclick="window.mudarAba(3)">3. Sinais Vitais</button>
            <button type="button" class="tab-btn" onclick="window.mudarAba(4)">4. Postura</button>
            <button type="button" class="tab-btn" onclick="window.mudarAba(5)">5. Exame Físico</button>
            <button type="button" class="tab-btn" onclick="window.mudarAba(6)">6. Diagnóstico</button>
        </div>

        <div id="tab-1" class="tab-content active">
            <h4>Histórico Clínico</h4>
            <label>Queixa Principal (QP)</label>
            <input name="qp" class="u-full-width" placeholder="Ex: Dor no ombro direito">
            
            <label>História da Doença Atual (HDA)</label>
            <textarea name="hda" class="u-full-width" rows="4"></textarea>
            
            <label style="margin-top:15px; font-weight:bold;">História Patológica Pregressa (HPP)</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <label><input type="checkbox" name="hpp_has" value="Sim"> Hipertensão</label>
                <label><input type="checkbox" name="hpp_dm" value="Sim"> Diabetes</label>
                <label><input type="checkbox" name="hpp_cardio" value="Sim"> Cardiopatia</label>
                <label><input type="checkbox" name="hpp_trauma" value="Sim"> Traumas/Fraturas</label>
            </div>
            <label>Cirurgias Prévias (Quais/Data)</label>
            <input name="cirurgias" class="u-full-width">

            <label>Medicamentos em uso</label>
            <textarea name="medicamentos" class="u-full-width" placeholder="Nome, Dosagem, Frequência"></textarea>

            <label>Ocupação / Trabalho</label>
            <input name="ocupacao" class="u-full-width">
        </div>

        <div id="tab-2" class="tab-content">
            <h4>Avaliação da Dor</h4>
            
            <label>Intensidade (EVA 0-10): <span id="evaValor" style="font-weight:bold; color:#007bff; font-size:1.2rem;">0</span></label>
            <input type="range" name="eva" min="0" max="10" value="0" oninput="document.getElementById('evaValor').innerText = this.value">
            <div class="eva-labels">
                <span>Sem dor</span><span>Dor insuportável</span>
            </div>

            <div class="row">
                <div class="col">
                    <label>Localização</label>
                    <select name="dor_local" class="u-full-width">
                        <option value="">Selecione...</option>
                        <option value="Cervical">Cervical</option>
                        <option value="Ombro D">Ombro D</option>
                        <option value="Ombro E">Ombro E</option>
                        <option value="Lombar">Lombar</option>
                        <option value="Joelho D">Joelho D</option>
                        <option value="Joelho E">Joelho E</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>
                <div class="col">
                    <label>Tipo/Caráter</label>
                    <select name="dor_tipo" class="u-full-width">
                        <option value="Queimação">Queimação</option>
                        <option value="Pontada">Pontada</option>
                        <option value="Latejante">Latejante</option>
                        <option value="Peso">Peso</option>
                        <option value="Formigamento">Formigamento</option>
                    </select>
                </div>
            </div>

            <label>Fatores Agravantes</label>
            <input name="agrava" class="u-full-width" placeholder="Ex: Subir escadas, Frio">
            
            <label>Fatores de Alívio</label>
            <input name="alivia" class="u-full-width" placeholder="Ex: Repouso, Gelo">
        </div>

        <div id="tab-3" class="tab-content">
            <h4>Sinais Vitais e Antropometria</h4>
            <div class="row">
                <div class="col"><label>PA (mmHg)</label><input name="pa" class="u-full-width"></div>
                <div class="col"><label>FC (bpm)</label><input type="number" name="fc" class="u-full-width"></div>
                <div class="col"><label>FR (rpm)</label><input type="number" name="fr" class="u-full-width"></div>
                <div class="col"><label>SpO2 (%)</label><input type="number" name="spo2" class="u-full-width"></div>
            </div>
            
            <div class="row" style="margin-top: 15px; background: #f1f3f5; padding: 15px; border-radius: 8px;">
                <div class="col">
                    <label>Peso (kg)</label>
                    <input type="number" id="peso" name="peso" class="u-full-width" oninput="window.calcIMC()">
                </div>
                <div class="col">
                    <label>Altura (m)</label>
                    <input type="number" id="altura" name="altura" step="0.01" class="u-full-width" oninput="window.calcIMC()">
                </div>
                <div class="col">
                    <label>IMC</label>
                    <input type="text" id="imc" name="imc" class="u-full-width" readonly style="font-weight:bold; color:#28a745;">
                </div>
            </div>
        </div>

        <div id="tab-4" class="tab-content">
            <h4>Avaliação Postural</h4>
            <div class="row">
                <div class="col">
                    <label>Cabeça</label>
                    <select name="postura_cabeca" class="u-full-width">
                        <option value="Alinhada">Alinhada</option>
                        <option value="Protrusa">Protrusa</option>
                        <option value="Inclinada D">Inclinada D</option>
                        <option value="Inclinada E">Inclinada E</option>
                    </select>
                </div>
                <div class="col">
                    <label>Ombros</label>
                    <select name="postura_ombros" class="u-full-width">
                        <option value="Nivelados">Nivelados</option>
                        <option value="Elevado D">Elevado D</option>
                        <option value="Elevado E">Elevado E</option>
                        <option value="Protusos">Protusos</option>
                    </select>
                </div>
            </div>
            
            <div class="row">
                <div class="col">
                    <label>Coluna</label>
                    <select name="postura_coluna" class="u-full-width">
                        <option value="Preservada">Preservada</option>
                        <option value="Hipercifose T">Hipercifose Torácica</option>
                        <option value="Hiperlordose L">Hiperlordose Lombar</option>
                        <option value="Escoliose">Escoliose</option>
                    </select>
                </div>
                <div class="col">
                    <label>Pelve/Pés</label>
                    <select name="postura_pes" class="u-full-width">
                        <option value="Neutro">Neutro</option>
                        <option value="Pé Plano/Valgo">Pé Plano/Valgo</option>
                        <option value="Pé Cavo/Varo">Pé Cavo/Varo</option>
                    </select>
                </div>
            </div>
            <label>Observações Adicionais</label>
            <textarea name="postura_obs" class="u-full-width"></textarea>
        </div>

        <div id="tab-5" class="tab-content">
            <h4>Exame Físico Dinâmico</h4>
            
            <label style="font-weight:bold;">Goniometria (ADM)</label>
            <textarea name="adm" class="u-full-width" placeholder="Ex: Ombro Flexão 160° (Ref 180°)"></textarea>
            
            <label style="font-weight:bold;">Força Muscular (MRC 0-5)</label>
            <textarea name="forca" class="u-full-width" placeholder="Ex: Quadríceps D: grau 4"></textarea>
            
            <label style="font-weight:bold;">Testes Especiais</label>
            <div class="row">
                <div class="col"><input name="teste1_nome" placeholder="Nome do Teste 1" class="u-full-width"></div>
                <div class="col"><select name="teste1_result" class="u-full-width"><option value="Negativo">Negativo (-)</option><option value="Positivo">Positivo (+)</option></select></div>
            </div>
            <div class="row">
                <div class="col"><input name="teste2_nome" placeholder="Nome do Teste 2" class="u-full-width"></div>
                <div class="col"><select name="teste2_result" class="u-full-width"><option value="Negativo">Negativo (-)</option><option value="Positivo">Positivo (+)</option></select></div>
            </div>
        </div>

        <div id="tab-6" class="tab-content">
            <h4>Conclusão</h4>
            
            <label>Diagnóstico Cinético-Funcional</label>
            <textarea name="diagnostico" class="u-full-width" rows="3"></textarea>
            
            <label>CIF (Classificação Internacional)</label>
            <input name="cif" class="u-full-width" placeholder="Ex: b280 (Dor), s730 (Estrutura ombro)">
            
            <label>Objetivos do Tratamento</label>
            <textarea name="objetivos" class="u-full-width" placeholder="Curto, médio e longo prazo"></textarea>
            
            <label>Plano de Tratamento (Conduta)</label>
            <textarea name="conduta" class="u-full-width" placeholder="Recursos e técnicas"></textarea>
        </div>
    `,
    
    // Mantenha os outros se quiser, ou use este "Completa" para tudo.
    "Simplificada": "<h4>Avaliação Rápida</h4><label>Queixa</label><textarea name='qp' class='u-full-width'></textarea><label>Conduta</label><textarea name='conduta' class='u-full-width'></textarea>"
};