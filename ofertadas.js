/**
 * ofertadas.js
 * Aba "Ofertadas DEMAT": matriz semanal pra apoiar o planejamento da oferta do departamento.
 *
 * Dois modos:
 *  - Oficial: sempre o horário fixo de horarios-oficiais.js — igual pra qualquer pessoa que
 *    abrir o site, é a "fonte da verdade".
 *  - Minha proposta: um rascunho separado (guardado à parte no navegador), onde dá pra editar
 *    dia/horário/turma/professor de cada disciplina obrigatória do DEMAT e de cada optativa, sem
 *    afetar o horário oficial nem o horário pessoal de nenhum aluno. Tem uma Lista editável por
 *    período, uma Matriz (igual à oficial, mas refletindo a proposta) e uma aba de configuração
 *    de Optativas, além de um botão que gera automaticamente uma sugestão de reorganização pros
 *    períodos 7º/8º/9º, tentando concentrar o máximo possível das aulas de manhã/início de tarde
 *    pra dentro da janela 16h–19h — a ideia é liberar a manhã desses períodos finais pro aluno
 *    estagiar.
 *
 * Escopo em ambos os modos: disciplinas obrigatórias do DEMAT (depto === "materiais" em
 * data.js) + as optativas ATIVAS (só as marcadas como visíveis na configuração da proposta,
 * mais as customizadas criadas por quem está planejando — ver seção "Config de optativas").
 * A Lista da proposta também tem um bloco somente-leitura opcional com todas as disciplinas do
 * currículo (qualquer departamento) ofertadas oficialmente naquele período, pra dar visão do
 * quadro completo ao reorganizar horário.
 */

const OfertadasDemat = (() => {
  let elementoRaiz = null;
  let modo = "oficial"; // "oficial" | "proposta"
  let modoProposta = "lista"; // "lista" | "matriz" | "optativas" — só relevante quando modo === "proposta"
  let periodoFiltro = "todos"; // "todos" | 1..10 — escopo das duas matrizes (oficial e proposta)
  let periodoListaProposta = 7; // período mostrado na Lista da proposta
  let proposta = {};
  let configOptativas = {}; // { selecionadas: [codigo,...], customizadas: [{codigo,nome,creditos}], proximoId }
  let ultimoResumoSugestao = null; // HTML do resumo da última geração automática

  const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const JANELA_TARDE_INICIO = "16:00";
  const JANELA_TARDE_FIM = "19:00";

  function faixas() {
    return (typeof Horarios !== "undefined" && Horarios.FAIXAS) || [];
  }

  function init(root) {
    elementoRaiz = root;
    proposta = Estado.carregarPropostaDemat();
    configOptativas = Estado.carregarConfigOptativasDemat();
    semearConfigOptativasSeNecessario();
    semearPropostaSeNecessario();
    render();
  }

  // ---------- Config de optativas (quais aparecem + customizadas) ----------

  function optativasBase() {
    return typeof OPTATIVAS !== "undefined" ? OPTATIVAS : [];
  }

  function semearConfigOptativasSeNecessario() {
    let mudou = false;
    if (!Array.isArray(configOptativas.selecionadas)) {
      configOptativas.selecionadas = optativasBase().map((d) => d.codigo);
      mudou = true;
    }
    if (!Array.isArray(configOptativas.customizadas)) {
      configOptativas.customizadas = [];
      mudou = true;
    }
    if (!configOptativas.proximoId) {
      configOptativas.proximoId = 1;
      mudou = true;
    }
    if (mudou) Estado.salvarConfigOptativasDemat(configOptativas);
  }

  function optativasCustomizadas() {
    return (configOptativas.customizadas || []).map((c) => ({
      codigo: c.codigo,
      nome: c.nome,
      creditos: c.creditos,
      depto: "materiais",
      departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS",
      customizada: true,
    }));
  }

  // só as optativas marcadas como ativas (+ as customizadas, sempre ativas) aparecem no site
  function optativasAtivas() {
    const selecionadas = configOptativas.selecionadas || [];
    return [...optativasBase().filter((d) => selecionadas.includes(d.codigo)), ...optativasCustomizadas()];
  }

  function onToggleOptativaAtiva(codigo) {
    const selecionadas = configOptativas.selecionadas || [];
    const idx = selecionadas.indexOf(codigo);
    if (idx >= 0) selecionadas.splice(idx, 1);
    else selecionadas.push(codigo);
    configOptativas.selecionadas = selecionadas;
    Estado.salvarConfigOptativasDemat(configOptativas);
    render();
  }

  function onCriarOptativaCustom(nome, creditosStr) {
    const nomeLimpo = (nome || "").trim();
    if (!nomeLimpo) return;
    const creditos = Number(creditosStr) || 4;
    const codigo = "OPTX" + configOptativas.proximoId;
    configOptativas.proximoId += 1;
    configOptativas.customizadas = configOptativas.customizadas || [];
    configOptativas.customizadas.push({ codigo, nome: nomeLimpo, creditos });
    Estado.salvarConfigOptativasDemat(configOptativas);

    if (proposta[codigo] === undefined) {
      proposta[codigo] = [];
      Estado.salvarPropostaDemat(proposta);
    }
    render();
  }

  function onRemoverOptativaCustom(codigo) {
    configOptativas.customizadas = (configOptativas.customizadas || []).filter((c) => c.codigo !== codigo);
    Estado.salvarConfigOptativasDemat(configOptativas);
    render();
  }

  // Botão "remover da lista" no card da Lista: pras 16 optativas padrão é reversível (mesmo efeito
  // de desmarcar em "⚙ Optativas" — dá pra marcar de novo depois). Pras customizadas não tem como
  // "desmarcar" (não existem fora da proposta), então remover apaga elas de vez — por isso confirma antes.
  function onRemoverOptativaDaLista(codigo, ehCustomizada) {
    if (ehCustomizada) {
      if (elementoRaiz.ownerDocument.defaultView.confirm) {
        const ok = elementoRaiz.ownerDocument.defaultView.confirm(
          "Essa optativa foi criada por você e não está no cadastro padrão — remover apaga ela de vez, sem como recuperar. Continuar?"
        );
        if (!ok) return;
      }
      onRemoverOptativaCustom(codigo);
    } else {
      onToggleOptativaAtiva(codigo);
    }
  }

  // ---------- Escopo de disciplinas ----------

  function disciplinasEscopo() {
    const mandatorias = (typeof DISCIPLINAS !== "undefined" ? DISCIPLINAS : []).filter((d) => d.depto === "materiais");
    return [...mandatorias, ...optativasAtivas()];
  }

  function ehOptativa(disciplina) {
    return disciplina.periodo === undefined;
  }

  function focoReorganizacao(disciplina) {
    return ehOptativa(disciplina) || [7, 8, 9].includes(disciplina.periodo);
  }

  // ---------- Dados oficiais ----------

  function entradasOficiaisDe(codigo) {
    const ofertas = (typeof HORARIOS_OFICIAIS !== "undefined" && HORARIOS_OFICIAIS[codigo]) || [];
    const entradas = [];
    ofertas.forEach((oferta) => {
      (oferta.slots || []).forEach((slot) => {
        entradas.push({
          dia: slot.dia,
          inicio: slot.inicio,
          fim: slot.fim,
          sala: "",
          turma: oferta.turma !== undefined && oferta.turma !== null ? String(oferta.turma) : "",
          professor: oferta.docentes || "",
          obs: slot.obs || "",
        });
      });
    });
    return entradas;
  }

  // ---------- Proposta: persistência ----------

  function semearPropostaSeNecessario() {
    let mudou = false;
    disciplinasEscopo().forEach((d) => {
      if (proposta[d.codigo] !== undefined) return;
      proposta[d.codigo] = entradasOficiaisDe(d.codigo);
      mudou = true;
    });
    if (mudou) Estado.salvarPropostaDemat(proposta);
  }

  function entradasPropostaDe(codigo) {
    return proposta[codigo] || [];
  }

  function salvarProposta(codigo, entradas) {
    proposta = Estado.salvarTurmaPropostaDemat(codigo, entradas);
  }

  function novaEntradaProposta() {
    return { dia: "Segunda", inicio: "16:00", fim: "17:00", sala: "", turma: "", professor: "", obs: "" };
  }

  // ---------- Proposta: ações de edição ----------

  function onAdicionarSlotProposta(codigo) {
    salvarProposta(codigo, [...entradasPropostaDe(codigo), novaEntradaProposta()]);
    render();
  }

  function onRemoverSlotProposta(codigo, idx) {
    salvarProposta(
      codigo,
      entradasPropostaDe(codigo).filter((_, i) => i !== idx)
    );
    render();
  }

  function onRestaurarOficialProposta(codigo) {
    salvarProposta(codigo, entradasOficiaisDe(codigo));
    render();
  }

  function onMudarCampoProposta(codigo, idx, campo, valor) {
    const entradas = entradasPropostaDe(codigo).map((e, i) => (i === idx ? { ...e, [campo]: valor } : e));
    salvarProposta(codigo, entradas);
    indicarSalvoProposta(codigo);
  }

  function indicarSalvoProposta(codigo) {
    const badge = elementoRaiz.querySelector('.badge-salvo[data-codigo="' + codigo + '"]');
    if (!badge) return;
    badge.classList.add("visivel");
    clearTimeout(badge._timeout);
    badge._timeout = setTimeout(() => badge.classList.remove("visivel"), 1200);
  }

  function onDescartarProposta() {
    if (elementoRaiz.ownerDocument.defaultView.confirm) {
      const ok = elementoRaiz.ownerDocument.defaultView.confirm(
        "Isso apaga toda a sua proposta de reorganização e volta pro horário oficial. Continuar?"
      );
      if (!ok) return;
    }
    Estado.limparPropostaDemat();
    proposta = {};
    semearPropostaSeNecessario();
    ultimoResumoSugestao = null;
    render();
  }

  // ---------- Janela-alvo (final da tarde) ----------

  function estaNaJanelaTarde(entrada) {
    if (!entrada.dia || entrada.dia === "Sábado") return true;
    if (entrada.inicio >= "19:00") return true; // já é noite
    return entrada.inicio >= JANELA_TARDE_INICIO && entrada.fim <= JANELA_TARDE_FIM;
  }

  // ---------- Geração automática de sugestão (períodos 7º/8º/9º + optativas) ----------

  function horarioParaMinutos(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function conflitaComOcupados(dia, inicio, fim, ocupados) {
    const lista = ocupados[dia] || [];
    return lista.some((o) => inicio < o.fim && fim > o.inicio);
  }

  function registrarOcupado(dia, inicio, fim, ocupados) {
    if (!dia || !inicio || !fim) return;
    if (!ocupados[dia]) ocupados[dia] = [];
    ocupados[dia].push({ inicio, fim });
  }

  function clonarOcupados(origem) {
    const copia = {};
    Object.keys(origem).forEach((dia) => {
      copia[dia] = origem[dia].slice();
    });
    return copia;
  }

  function agruparPorTurma(entradas) {
    const porTurma = new Map();
    entradas.forEach((e) => {
      const chave = e.turma || "_sem_turma_" + porTurma.size;
      if (!porTurma.has(chave)) porTurma.set(chave, []);
      porTurma.get(chave).push(e);
    });
    return porTurma;
  }

  // Um aluno no fluxo normal cursa só as obrigatórias de UM período final por vez — então as
  // obrigatórias do 7º não precisam evitar as do 8º/9º, só as do próprio período. Já as optativas
  // podem ser combinadas com qualquer um dos três (é o aluno que escolhe qual optativa cursar em
  // cada período), então elas evitam as obrigatórias dos três períodos e também umas às outras.
  function gerarSugestaoAutomatica() {
    const FAIXAS_T = faixas().filter((f) => f.turno === "T"); // slots de tarde, já em ordem (13h → 18h)
    const escopo = disciplinasEscopo();
    const mandatoriasAlvo = escopo.filter((d) => !ehOptativa(d) && [7, 8, 9].includes(d.periodo));
    const optativasAlvo = escopo.filter(ehOptativa);

    const ocupadosBase = {};
    escopo.forEach((d) => {
      if (!ehOptativa(d) && [7, 8, 9].includes(d.periodo)) return; // é alvo, tratado abaixo
      entradasPropostaDe(d.codigo).forEach((e) => registrarOcupado(e.dia, e.inicio, e.fim, ocupadosBase));
    });

    const ocupadosPorPeriodo = {
      7: clonarOcupados(ocupadosBase),
      8: clonarOcupados(ocupadosBase),
      9: clonarOcupados(ocupadosBase),
    };
    const ocupadosOptativas = clonarOcupados(ocupadosBase);

    let movidas = 0;
    let mantidas = 0;
    const detalhes = [];

    function processarGrupo(d, grupo, mapasParaChecar, mapasParaAtualizar) {
      const moviveis = grupo.filter((e) => e.dia && e.dia !== "Sábado" && e.inicio && e.inicio < "19:00");
      const precisaMover = moviveis.some((e) => !estaNaJanelaTarde(e));

      if (!precisaMover) {
        grupo.forEach((e) => mapasParaAtualizar.forEach((m) => registrarOcupado(e.dia, e.inicio, e.fim, m)));
        return grupo;
      }

      const duracaoMin = horarioParaMinutos(moviveis[0].fim) - horarioParaMinutos(moviveis[0].inicio);
      const duracaoSlots = Math.max(1, Math.round(duracaoMin / 60));
      const diasMoviveis = [...new Set(moviveis.map((e) => e.dia))];

      let encontrado = null;
      for (let idx = FAIXAS_T.length - duracaoSlots; idx >= 0; idx--) {
        const inicioCand = FAIXAS_T[idx].inicio;
        const fimCand = FAIXAS_T[idx + duracaoSlots - 1].fim;
        const semChoque = diasMoviveis.every((dia) =>
          mapasParaChecar.every((m) => !conflitaComOcupados(dia, inicioCand, fimCand, m))
        );
        if (semChoque) {
          encontrado = { inicio: inicioCand, fim: fimCand };
          break;
        }
      }

      if (encontrado) {
        movidas++;
        detalhes.push(
          d.codigo +
            " — " +
            d.nome +
            (grupo[0].turma ? " (T" + grupo[0].turma + ")" : "") +
            ": " +
            diasMoviveis.join("/") +
            " → " +
            encontrado.inicio +
            "–" +
            encontrado.fim
        );
      } else {
        mantidas++;
      }

      const novoGrupo = grupo.map((e) => {
        const movivel = e.dia && e.dia !== "Sábado" && e.inicio && e.inicio < "19:00";
        return movivel && encontrado ? { ...e, inicio: encontrado.inicio, fim: encontrado.fim } : { ...e };
      });
      novoGrupo.forEach((e) => mapasParaAtualizar.forEach((m) => registrarOcupado(e.dia, e.inicio, e.fim, m)));
      return novoGrupo;
    }

    mandatoriasAlvo.forEach((d) => {
      const entradas = entradasPropostaDe(d.codigo);
      if (!entradas.length) return;
      const mapaPeriodo = ocupadosPorPeriodo[d.periodo];
      const novasEntradas = [];
      agruparPorTurma(entradas).forEach((grupo) => {
        novasEntradas.push(...processarGrupo(d, grupo, [mapaPeriodo], [mapaPeriodo]));
      });
      proposta[d.codigo] = novasEntradas;
    });

    optativasAlvo.forEach((d) => {
      const entradas = entradasPropostaDe(d.codigo);
      if (!entradas.length) return;
      const mapasCompartilhados = [ocupadosPorPeriodo[7], ocupadosPorPeriodo[8], ocupadosPorPeriodo[9], ocupadosOptativas];
      const novasEntradas = [];
      agruparPorTurma(entradas).forEach((grupo) => {
        novasEntradas.push(...processarGrupo(d, grupo, mapasCompartilhados, mapasCompartilhados));
      });
      proposta[d.codigo] = novasEntradas;
    });

    Estado.salvarPropostaDemat(proposta);

    ultimoResumoSugestao =
      "<strong>Sugestão gerada.</strong> " +
      movidas +
      " turma(s) movida(s) pro final da tarde (16h–19h). " +
      mantidas +
      " não coube(ram) sem gerar choque e continua(m) no horário original — mova manualmente se quiser. " +
      "As obrigatórias de um período só evitam choque com o próprio período (um aluno em fluxo normal não cursa " +
      "dois períodos finais ao mesmo tempo); as optativas evitam os três períodos e umas às outras, já que " +
      "qualquer uma pode ser escolhida em qualquer um deles. Não verifica choque com outros departamentos." +
      (detalhes.length
        ? '<details class="detalhes-sugestao"><summary>Ver o que mudou (' +
          detalhes.length +
          ")</summary><ul>" +
          detalhes.map((t) => "<li>" + t + "</li>").join("") +
          "</ul></details>"
        : "");

    render();
  }

  // ---------- Render: cartões editáveis da proposta (Lista) ----------

  function htmlSlotProposta(entrada, idx, foraDoAlvo) {
    const opcoesDias = DIAS.map(
      (d) => '<option value="' + d + '" ' + (entrada.dia === d ? "selected" : "") + ">" + d + "</option>"
    ).join("");
    return (
      '<div class="linha-horario' + (foraDoAlvo ? " linha-fora-alvo" : "") + '">' +
        '<select data-campo="dia" data-idx="' + idx + '">' + opcoesDias + "</select>" +
        '<input type="time" data-campo="inicio" data-idx="' + idx + '" value="' + entrada.inicio + '" />' +
        '<span class="ate">até</span>' +
        '<input type="time" data-campo="fim" data-idx="' + idx + '" value="' + entrada.fim + '" />' +
        '<input type="text" data-campo="turma" data-idx="' + idx + '" value="' + (entrada.turma || "") + '" placeholder="Turma" class="campo-turma" />' +
        '<input type="text" data-campo="professor" data-idx="' + idx + '" value="' + (entrada.professor || "") + '" placeholder="Professor(a)" class="campo-professor" />' +
        (foraDoAlvo ? '<span class="chip-fora-alvo" title="Fora da janela 16h–19h">fora do alvo</span>' : "") +
        '<button class="btn-remover-slot-proposta" data-idx="' + idx + '" title="Remover horário">✕</button>' +
      "</div>"
    );
  }

  // Agrupa as linhas de horário pela turma quando a disciplina tem mais de uma cadastrada na
  // proposta — mesmo tratamento usado na aba Horários: com só uma turma (ou nenhuma), mantém a
  // lista simples; com 2+, separa em blocos "Turma X".
  function agruparEntradasPropostaPorTurma(entradas) {
    const grupos = new Map();
    entradas.forEach((e, idx) => {
      const chave = (e.turma || "").trim() || "_sem_turma_";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push({ entrada: e, idx });
    });
    return grupos;
  }

  function htmlGrupoTurmaProposta(chave, itens, foco) {
    const titulo = chave === "_sem_turma_" ? "Sem turma definida" : "Turma " + chave;
    return (
      '<div class="grupo-turma">' +
        '<div class="titulo-grupo-turma">' + titulo + '</div>' +
        itens
          .map(({ entrada, idx }) => htmlSlotProposta(entrada, idx, foco && !estaNaJanelaTarde(entrada)))
          .join("") +
      '</div>'
    );
  }

  function htmlListaSlotsProposta(entradas, foco) {
    const grupos = agruparEntradasPropostaPorTurma(entradas);
    if (grupos.size <= 1) {
      return entradas.map((e, i) => htmlSlotProposta(e, i, foco && !estaNaJanelaTarde(e))).join("");
    }
    return [...grupos.entries()].map(([chave, itens]) => htmlGrupoTurmaProposta(chave, itens, foco)).join("");
  }

  function htmlCardProposta(disciplina) {
    const entradas = entradasPropostaDe(disciplina.codigo);
    const foco = focoReorganizacao(disciplina);
    const slotsHtml = entradas.length
      ? htmlListaSlotsProposta(entradas, foco)
      : '<p class="sem-horario">Sem horário na proposta.</p>';
    const botaoRemoverOptativa = ehOptativa(disciplina)
      ? '<button class="btn-remover-optativa-lista" data-codigo="' +
        disciplina.codigo +
        '" data-custom="' +
        (disciplina.customizada ? "true" : "false") +
        '" title="Remover esta optativa da lista">✕ remover da lista</button>'
      : "";
    return (
      '<div class="cartao-horario cartao-proposta" data-codigo="' + disciplina.codigo + '">' +
        '<div class="cartao-horario-topo">' +
          "<div>" +
            '<span class="card-codigo">' + disciplina.codigo + "</span>" +
            "<strong>" + disciplina.nome + "</strong>" +
            '<span class="card-creditos">' + disciplina.creditos + "cr</span>" +
          "</div>" +
          '<span class="badge-salvo" data-codigo="' + disciplina.codigo + '">salvo ✓</span>' +
        "</div>" +
        '<div class="lista-slots">' + slotsHtml + "</div>" +
        '<div class="acoes-cartao-horario">' +
          '<button class="btn-add-slot-proposta" data-codigo="' + disciplina.codigo + '">+ adicionar horário</button>' +
          '<button class="btn-restaurar-oficial-proposta" data-codigo="' + disciplina.codigo + '">↺ restaurar oficial</button>' +
          botaoRemoverOptativa +
        "</div>" +
      "</div>"
    );
  }

  function htmlCardSomenteLeitura(disciplina) {
    const entradas = entradasOficiaisDe(disciplina.codigo);
    const linhas = entradas.length
      ? entradas
          .map(
            (e) =>
              '<div class="linha-horario-leitura">' +
              e.dia +
              " " +
              e.inicio +
              "–" +
              e.fim +
              (e.turma ? " · T" + e.turma : "") +
              (e.professor ? " · " + e.professor : "") +
              "</div>"
          )
          .join("")
      : '<p class="sem-horario">Sem horário oficial cadastrado.</p>';
    return (
      '<div class="cartao-horario cartao-somente-leitura">' +
        '<div class="cartao-horario-topo">' +
          "<div>" +
            '<span class="card-codigo">' + disciplina.codigo + "</span>" +
            "<strong>" + disciplina.nome + "</strong>" +
            '<span class="card-creditos">' + disciplina.creditos + "cr</span>" +
          "</div>" +
          '<span class="card-departamento">' + (disciplina.departamento || "") + "</span>" +
        "</div>" +
        '<div class="lista-slots-leitura">' + linhas + "</div>" +
      "</div>"
    );
  }

  function renderListaProposta(container) {
    const mandatoriasDoPeriodo = (typeof DISCIPLINAS !== "undefined" ? DISCIPLINAS : [])
      .filter((d) => d.depto === "materiais" && d.periodo === periodoListaProposta)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    const optativas = optativasAtivas();

    const cardsObrigatorias = mandatoriasDoPeriodo.map(htmlCardProposta).join("");
    const cardsOptativas = optativas.map(htmlCardProposta).join("");

    const todasDoPeriodo = (typeof DISCIPLINAS !== "undefined" ? DISCIPLINAS : [])
      .filter((d) => d.periodo === periodoListaProposta)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    const cardsTodasPeriodo = todasDoPeriodo.map(htmlCardSomenteLeitura).join("");

    const seletorPeriodos = Array.from({ length: 10 }, (_, i) => i + 1)
      .map(
        (p) =>
          '<button class="btn-periodo ' +
          (p === periodoListaProposta ? "ativo" : "") +
          '" data-periodo-lista-proposta="' +
          p +
          '">' +
          p +
          "°</button>"
      )
      .join("");

    const resumoHtml = ultimoResumoSugestao ? '<div class="resumo-sugestao">' + ultimoResumoSugestao + "</div>" : "";

    container.innerHTML =
      '<div class="seletor-periodos">' + seletorPeriodos + "</div>" +
      '<p class="dica-horarios">Edite dia, horário, turma e professor de cada disciplina — fica salvo só nesta ' +
      '<strong>proposta</strong>, separada do horário oficial. Linhas marcadas em laranja (nos períodos 7º, 8º, 9º ' +
      "e nas optativas) estão fora da janela 16h–19h que libera a manhã pro estágio. Use a aba " +
      '"⚙ Optativas" pra escolher quais optativas aparecem aqui ou criar novas.</p>' +
      resumoHtml +
      '<div class="cartoes-do-grupo">' +
      (cardsObrigatorias || '<p class="sem-horario">Nenhuma disciplina obrigatória do DEMAT neste período.</p>') +
      "</div>" +
      '<h3 class="titulo-departamento">Optativas ativas (configure em "⚙ Optativas")</h3>' +
      '<div class="cartoes-do-grupo">' +
      (cardsOptativas || '<p class="sem-horario">Nenhuma optativa ativa no momento.</p>') +
      "</div>" +
      '<details class="bloco-todas-periodo">' +
        '<summary>Todas as disciplinas ofertadas no ' +
        periodoListaProposta +
        "º período (todos os departamentos) — " +
        todasDoPeriodo.length +
        "</summary>" +
        '<p class="dica-horarios">Lista somente leitura com o horário oficial de cada disciplina do currículo ' +
        "ofertada neste período, incluindo outros departamentos — útil pra checar conflito antes de mover uma " +
        "turma do DEMAT pro final da tarde.</p>" +
        '<div class="cartoes-do-grupo">' +
        (cardsTodasPeriodo || '<p class="sem-horario">Nenhuma disciplina cadastrada para este período.</p>') +
        "</div>" +
      "</details>";

    container.querySelectorAll("[data-periodo-lista-proposta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        periodoListaProposta = Number(btn.dataset.periodoListaProposta);
        render();
      });
    });
    container.querySelectorAll(".btn-add-slot-proposta").forEach((btn) => {
      btn.addEventListener("click", () => onAdicionarSlotProposta(btn.dataset.codigo));
    });
    container.querySelectorAll(".btn-restaurar-oficial-proposta").forEach((btn) => {
      btn.addEventListener("click", () => onRestaurarOficialProposta(btn.dataset.codigo));
    });
    container.querySelectorAll(".btn-remover-optativa-lista").forEach((btn) => {
      btn.addEventListener("click", () => onRemoverOptativaDaLista(btn.dataset.codigo, btn.dataset.custom === "true"));
    });
    container.querySelectorAll(".cartao-proposta").forEach((cartao) => {
      const codigo = cartao.dataset.codigo;
      cartao.querySelectorAll(".btn-remover-slot-proposta").forEach((btn) => {
        btn.addEventListener("click", () => onRemoverSlotProposta(codigo, Number(btn.dataset.idx)));
      });
      cartao.querySelectorAll("[data-campo]").forEach((campo) => {
        const evento = campo.tagName === "SELECT" ? "change" : "input";
        campo.addEventListener(evento, () =>
          onMudarCampoProposta(codigo, Number(campo.dataset.idx), campo.dataset.campo, campo.value)
        );
      });
    });
  }

  // ---------- Render: Config de optativas ----------

  function renderConfigOptativas(container) {
    const base = optativasBase();
    const selecionadas = configOptativas.selecionadas || [];
    const linhasBase = base
      .map((d) => {
        const marcada = selecionadas.includes(d.codigo);
        return (
          '<label class="linha-optativa-config">' +
            '<input type="checkbox" data-toggle-optativa="' + d.codigo + '" ' + (marcada ? "checked" : "") + " />" +
            '<span class="card-codigo">' + d.codigo + "</span>" +
            '<span class="nome-optativa-config">' + d.nome + "</span>" +
            '<span class="card-creditos">' + d.creditos + "cr</span>" +
          "</label>"
        );
      })
      .join("");

    const customizadas = configOptativas.customizadas || [];
    const linhasCustom = customizadas
      .map(
        (c) =>
          '<div class="linha-optativa-config linha-optativa-custom">' +
            '<span class="card-codigo">' + c.codigo + "</span>" +
            '<span class="nome-optativa-config">' + c.nome + "</span>" +
            '<span class="card-creditos">' + c.creditos + "cr</span>" +
            '<button class="btn-remover-optativa-custom" data-codigo="' + c.codigo + '">✕ remover</button>' +
          "</div>"
      )
      .join("");

    container.innerHTML =
      '<p class="dica-horarios">Escolha quais optativas cadastradas aparecem na Lista e na Matriz desta proposta, ' +
      "e crie novas optativas que ainda não existem no cadastro padrão. Desmarcar uma optativa não apaga o " +
      "horário dela — só esconde da visualização (dá pra marcar de novo depois).</p>" +
      '<h3 class="titulo-departamento">Optativas cadastradas (marque as que devem aparecer)</h3>' +
      '<div class="lista-optativas-config">' + linhasBase + "</div>" +
      '<h3 class="titulo-departamento">Optativas criadas por você</h3>' +
      '<div class="lista-optativas-config">' +
      (linhasCustom || '<p class="sem-horario">Nenhuma optativa customizada criada ainda.</p>') +
      "</div>" +
      '<form class="form-nova-optativa">' +
        '<input type="text" name="nome" placeholder="Nome da nova optativa" required />' +
        '<input type="number" name="creditos" placeholder="Créditos" min="1" max="12" value="4" required />' +
        '<button type="submit">+ criar optativa</button>' +
      "</form>";

    container.querySelectorAll("[data-toggle-optativa]").forEach((chk) => {
      chk.addEventListener("change", () => onToggleOptativaAtiva(chk.dataset.toggleOptativa));
    });
    container.querySelectorAll(".btn-remover-optativa-custom").forEach((btn) => {
      btn.addEventListener("click", () => onRemoverOptativaCustom(btn.dataset.codigo));
    });
    const form = container.querySelector(".form-nova-optativa");
    if (form) {
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const nome = form.elements["nome"].value;
        const creditos = form.elements["creditos"].value;
        onCriarOptativaCustom(nome, creditos);
        form.reset();
      });
    }
  }

  // ---------- Render: Matriz (compartilhada entre Oficial e Proposta) ----------

  function sobrepoe(entrada, faixa) {
    return entrada.inicio < faixa.fim && entrada.fim > faixa.inicio;
  }

  function coletarOfertas(fonte) {
    const lista = [];
    disciplinasEscopo().forEach((d) => {
      if (periodoFiltro !== "todos" && !ehOptativa(d) && d.periodo !== periodoFiltro) return;
      const entradas = fonte === "proposta" ? entradasPropostaDe(d.codigo) : entradasOficiaisDe(d.codigo);
      entradas.forEach((e) => {
        if (!e.dia || !e.inicio || !e.fim) return;
        lista.push({
          codigo: d.codigo,
          nome: d.nome,
          optativa: ehOptativa(d),
          customizada: !!d.customizada,
          turma: e.turma,
          docentes: e.professor || e.docentes,
          dia: e.dia,
          inicio: e.inicio,
          fim: e.fim,
          foraDoAlvo: focoReorganizacao(d) && !estaNaJanelaTarde(e),
        });
      });
    });
    return lista;
  }

  // permitirRemover: só true na Matriz da proposta — na Oficial não faz sentido remover nada.
  function htmlCelulaOferta(o, permitirRemover) {
    const professor = o.docentes && o.docentes.trim() ? o.docentes : "professor não informado";
    const botaoRemover =
      permitirRemover && o.optativa
        ? '<button class="btn-remover-optativa-matriz" data-codigo="' +
          o.codigo +
          '" data-custom="' +
          (o.customizada ? "true" : "false") +
          '" title="Remover esta optativa da matriz">✕</button>'
        : "";
    return (
      botaoRemover +
      '<div class="aula-nome">' + o.nome + (o.foraDoAlvo ? ' <span class="marca-fora-alvo" title="Fora da janela 16h–19h">⏰</span>' : "") + "</div>" +
      '<div class="aula-codigo">' + o.codigo + (o.turma !== undefined && o.turma !== null && o.turma !== "" ? " · T" + o.turma : "") + "</div>" +
      '<div class="aula-professor">' + professor + "</div>"
    );
  }

  function renderMatrizGenerica(container, fonte, descricaoEscopo) {
    const FAIXAS = faixas();
    const ofertas = coletarOfertas(fonte);
    const permitirRemover = fonte === "proposta";

    const grade = {};
    DIAS.forEach((dia) => {
      grade[dia] = FAIXAS.map(() => []);
    });
    ofertas.forEach((o) => {
      if (!grade[o.dia]) return;
      FAIXAS.forEach((faixa, i) => {
        if (sobrepoe(o, faixa)) grade[o.dia][i].push(o);
      });
    });

    let linhasHtml = "";
    let turnoAnterior = null;
    for (let i = 0; i < FAIXAS.length; i++) {
      const faixa = FAIXAS[i];
      const quebraTurno = turnoAnterior && turnoAnterior !== faixa.turno;
      turnoAnterior = faixa.turno;
      const naJanelaTarde = faixa.turno === "T" && faixa.inicio >= JANELA_TARDE_INICIO;

      let celulas = '<th class="th-horario">' + faixa.inicio + "–" + faixa.fim + "</th>";
      DIAS.forEach((dia) => {
        const ocupantes = grade[dia][i];
        if (grade[dia][i] === "consumida" || grade[dia][i] === "consumida-livre") {
          return;
        }
        const classeJanela = naJanelaTarde ? " col-janela-tarde" : "";
        if (!ocupantes.length) {
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            if (Array.isArray(prox) && prox.length === 0) {
              grade[dia][j] = "consumida-livre";
              span++;
            } else break;
          }
          celulas += '<td class="td-matriz td-vazia' + classeJanela + '" rowspan="' + span + '">Livre</td>';
          return;
        }
        if (ocupantes.length === 1) {
          const o = ocupantes[0];
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            if (Array.isArray(prox) && prox.length === 1 && prox[0] === o) {
              grade[dia][j] = "consumida";
              span++;
            } else break;
          }
          celulas +=
            '<td class="td-matriz td-aula ' +
            (o.optativa ? "dcor-optativa" : "dcor-materiais") +
            classeJanela +
            '" rowspan="' +
            span +
            '">' +
            htmlCelulaOferta(o, permitirRemover) +
            "</td>";
        } else {
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            const mesmoConjunto =
              Array.isArray(prox) && prox.length === ocupantes.length && prox.every((p) => ocupantes.includes(p));
            if (mesmoConjunto) {
              grade[dia][j] = "consumida";
              span++;
            } else break;
          }
          const mesmaDisciplina = ocupantes.every((o) => o.codigo === ocupantes[0].codigo);
          if (mesmaDisciplina) {
            // Mesma disciplina, turmas diferentes no mesmo horário — não é um choque real.
            // Mostra cada turma separada dentro da célula, com a cor normal (não laranja).
            const primeira = ocupantes[0];
            celulas +=
              '<td class="td-matriz td-aula ' +
              (primeira.optativa ? "dcor-optativa" : "dcor-materiais") +
              classeJanela +
              '" rowspan="' +
              span +
              '">' +
              '<div class="aula-nome">' +
              primeira.nome +
              (primeira.foraDoAlvo ? ' <span class="marca-fora-alvo" title="Fora da janela 16h–19h">⏰</span>' : "") +
              "</div>" +
              '<div class="aula-codigo">' + primeira.codigo + "</div>" +
              '<div class="itens-multi-turma">' +
              ocupantes
                .map((o) => {
                  const professor = o.docentes && o.docentes.trim() ? o.docentes : "professor não informado";
                  const botaoRemover =
                    permitirRemover && o.optativa
                      ? '<button class="btn-remover-optativa-matriz" data-codigo="' +
                        o.codigo +
                        '" data-custom="' +
                        (o.customizada ? "true" : "false") +
                        '" title="Remover esta optativa da matriz">✕</button>'
                      : "";
                  return (
                    '<div class="item-multi-turma">' +
                    botaoRemover +
                    '<span class="badge-turma">' + (o.turma ? "Turma " + o.turma : "Turma") + "</span>" +
                    '<div class="aula-professor">' + professor + "</div>" +
                    "</div>"
                  );
                })
                .join("") +
              "</div>" +
              "</td>";
          } else {
            celulas +=
              '<td class="td-matriz td-conflito' + classeJanela + '" rowspan="' + span + '">' +
              ocupantes
                .map(
                  (o) =>
                    '<div class="aula-conflito-item ' + (o.optativa ? "dcor-optativa" : "dcor-materiais") + '">' +
                    htmlCelulaOferta(o, permitirRemover) +
                    "</div>"
                )
                .join("") +
              "</td>";
          }
        }
      });

      linhasHtml += '<tr class="' + (quebraTurno ? "linha-quebra-turno" : "") + '">' + celulas + "</tr>";
    }

    const cabecalhoDias = DIAS.map((d) => "<th>" + d + "</th>").join("");

    container.innerHTML =
      '<p class="dica-horarios">' +
      descricaoEscopo +
      ' Mostra turma e professor de cada oferta. A faixa 16h–19h vem marcada (fundo levemente diferente) — é a janela-alvo pra concentrar disciplinas do 7º/8º/9º período e liberar a manhã pro estágio; ⏰ marca quem ainda está fora dela.</p>' +
      '<div class="legenda-ofertadas">' +
      '<span class="chip-legenda dcor-materiais">Obrigatória do DEMAT</span>' +
      '<span class="chip-legenda dcor-optativa">Optativa</span>' +
      '<span class="chip-legenda chip-legenda-conflito">Conflito — 2+ disciplinas diferentes no mesmo horário</span>' +
      '<span class="chip-legenda chip-legenda-janela">16h–19h (janela-alvo)</span>' +
      "</div>" +
      '<div class="tabela-scroll">' +
      '<table class="tabela-matriz">' +
      '<thead><tr><th class="th-horario"></th>' +
      cabecalhoDias +
      "</tr></thead>" +
      "<tbody>" +
      linhasHtml +
      "</tbody>" +
      "</table>" +
      "</div>";

    if (permitirRemover) {
      container.querySelectorAll(".btn-remover-optativa-matriz").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          onRemoverOptativaDaLista(btn.dataset.codigo, btn.dataset.custom === "true");
        });
      });
    }
  }

  function renderMatrizOficial(container) {
    const descricaoEscopo =
      "Grade oficial e fixa (não depende de nenhuma edição) com " +
      (periodoFiltro === "todos"
        ? "todas as disciplinas obrigatórias do DEMAT, de qualquer período, mais as optativas ativas."
        : "as disciplinas obrigatórias do DEMAT do " + periodoFiltro + "° período, mais as optativas ativas (sem período fixo).");
    renderMatrizGenerica(container, "oficial", descricaoEscopo);
  }

  function renderMatrizProposta(container) {
    const descricaoEscopo =
      "Grade da sua <strong>proposta</strong> (só neste navegador) com " +
      (periodoFiltro === "todos"
        ? "todas as disciplinas obrigatórias do DEMAT, de qualquer período, mais as optativas ativas."
        : "as disciplinas obrigatórias do DEMAT do " + periodoFiltro + "° período, mais as optativas ativas (sem período fixo).");
    renderMatrizGenerica(container, "proposta", descricaoEscopo);
  }

  // ---------- Render principal ----------

  function seletorPeriodosMatriz() {
    return (
      '<button class="btn-periodo ' + (periodoFiltro === "todos" ? "ativo" : "") + '" data-periodo-ofertadas="todos">Todos</button>' +
      Array.from({ length: 10 }, (_, i) => i + 1)
        .map(
          (p) =>
            '<button class="btn-periodo ' + (p === periodoFiltro ? "ativo" : "") + '" data-periodo-ofertadas="' + p + '">' + p + "°</button>"
        )
        .join("")
    );
  }

  function render() {
    const barraModo =
      '<div class="seletor-modo">' +
      '<button class="btn-modo ' + (modo === "oficial" ? "ativo" : "") + '" data-modo-ofertadas="oficial">Oficial</button>' +
      '<button class="btn-modo ' + (modo === "proposta" ? "ativo" : "") + '" data-modo-ofertadas="proposta">Minha proposta</button>' +
      "</div>";

    let barraSecundaria = "";
    if (modo === "oficial") {
      barraSecundaria = '<div class="seletor-periodos">' + seletorPeriodosMatriz() + "</div>";
    } else {
      barraSecundaria =
        '<div class="seletor-modo">' +
        '<button class="btn-modo ' + (modoProposta === "lista" ? "ativo" : "") + '" data-modo-proposta="lista">☰ Lista</button>' +
        '<button class="btn-modo ' + (modoProposta === "matriz" ? "ativo" : "") + '" data-modo-proposta="matriz">▦ Matriz</button>' +
        '<button class="btn-modo ' + (modoProposta === "optativas" ? "ativo" : "") + '" data-modo-proposta="optativas">⚙ Optativas</button>' +
        "</div>" +
        (modoProposta === "matriz" ? '<div class="seletor-periodos">' + seletorPeriodosMatriz() + "</div>" : "");
    }

    const acoesProposta =
      modo === "proposta"
        ? '<div class="acoes-proposta-topo">' +
          '<button class="btn-sugestao-automatica">Gerar sugestão automática (7º/8º/9º → final da tarde)</button>' +
          '<button class="btn-descartar-proposta">Descartar toda a proposta</button>' +
          "</div>"
        : "";

    elementoRaiz.innerHTML =
      '<div class="barra-controle-horarios">' + barraModo + barraSecundaria + "</div>" +
      acoesProposta +
      '<div class="painel-modo-horarios"></div>';

    elementoRaiz.querySelectorAll("[data-modo-ofertadas]").forEach((btn) => {
      btn.addEventListener("click", () => {
        modo = btn.dataset.modoOfertadas;
        render();
      });
    });
    elementoRaiz.querySelectorAll("[data-modo-proposta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        modoProposta = btn.dataset.modoProposta;
        render();
      });
    });
    elementoRaiz.querySelectorAll("[data-periodo-ofertadas]").forEach((btn) => {
      btn.addEventListener("click", () => {
        periodoFiltro = btn.dataset.periodoOfertadas === "todos" ? "todos" : Number(btn.dataset.periodoOfertadas);
        render();
      });
    });
    const btnSugestao = elementoRaiz.querySelector(".btn-sugestao-automatica");
    if (btnSugestao) btnSugestao.addEventListener("click", gerarSugestaoAutomatica);
    const btnDescartar = elementoRaiz.querySelector(".btn-descartar-proposta");
    if (btnDescartar) btnDescartar.addEventListener("click", onDescartarProposta);

    const painel = elementoRaiz.querySelector(".painel-modo-horarios");
    if (modo === "oficial") {
      renderMatrizOficial(painel);
    } else if (modoProposta === "matriz") {
      renderMatrizProposta(painel);
    } else if (modoProposta === "optativas") {
      renderConfigOptativas(painel);
    } else {
      renderListaProposta(painel);
    }
  }

  return { init, render };
})();
