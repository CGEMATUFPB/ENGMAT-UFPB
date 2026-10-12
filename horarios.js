/**
 * horarios.js
 * Tela de horários: por período, mostra o horário oficial de cada disciplina (turma, dia,
 * horário e professor) já pré-preenchido a partir de horarios-oficiais.js, mas continua
 * totalmente editável — o aluno pode apagar a turma que não vai cursar, ajustar sala,
 * ou adicionar um horário novo.
 *
 * Duas formas de visualizar:
 *  - Lista: cartões por período, agrupados por departamento responsável pela disciplina.
 *  - Matriz: grade semanal (dia x horário), com opção de ver "Todos os períodos" (útil pra
 *    conferir a grade completa e possíveis choques) ou um período específico. Colorida por
 *    departamento, com filtro pra mostrar/esconder departamentos. Horários sem aula aparecem
 *    marcados como "Livre".
 *
 * Tudo é salvo em localStorage via state.js — pensado para no futuro trocar por chamadas
 * a uma API (ex: GET/POST /horarios) sem precisar reescrever a UI.
 */

const Horarios = (() => {
  let elementoRaiz = null;
  let periodoAtual = 1; // período selecionado no modo Lista
  let periodoMatriz = "todos"; // "todos" | 1..10 — escopo do modo Matriz
  let horarios = {};
  let modoVisualizacao = "lista"; // "lista" | "matriz"
  let departamentosOcultos = new Set(); // códigos "cor" de DEPARTAMENTOS_INFO escondidos na matriz

  const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  // Faixas de horário: aulas diurnas (manhã/tarde) duram 1h cada, corridas, sem intervalo.
  // Aulas noturnas duram 50min, com intervalo entre a 2ª e a 3ª (mesma lógica usada pra
  // interpretar os códigos SIGAA na geração de horarios-oficiais.js).
  const FAIXAS = [
    { inicio: "07:00", fim: "08:00", turno: "M" },
    { inicio: "08:00", fim: "09:00", turno: "M" },
    { inicio: "09:00", fim: "10:00", turno: "M" },
    { inicio: "10:00", fim: "11:00", turno: "M" },
    { inicio: "11:00", fim: "12:00", turno: "M" },
    { inicio: "12:00", fim: "13:00", turno: "M" },
    { inicio: "13:00", fim: "14:00", turno: "T" },
    { inicio: "14:00", fim: "15:00", turno: "T" },
    { inicio: "15:00", fim: "16:00", turno: "T" },
    { inicio: "16:00", fim: "17:00", turno: "T" },
    { inicio: "17:00", fim: "18:00", turno: "T" },
    { inicio: "18:00", fim: "19:00", turno: "T" },
    { inicio: "19:00", fim: "19:50", turno: "N" },
    { inicio: "19:50", fim: "20:40", turno: "N" },
    { inicio: "20:50", fim: "21:40", turno: "N" },
    { inicio: "21:40", fim: "22:30", turno: "N" },
  ];

  function init(root) {
    elementoRaiz = root;
    horarios = Estado.carregarHorarios();
    semearHorariosOficiais();
    render();
  }

  // Na primeira visita (ou quando uma disciplina nunca foi tocada), pré-preenche os
  // horários com a oferta oficial do período letivo atual. Depois disso o aluno é livre
  // para editar/apagar — não sobrescrevemos o que ele já mexeu.
  function semearHorariosOficiais() {
    if (typeof HORARIOS_OFICIAIS === "undefined") return;
    let mudou = false;
    Object.keys(HORARIOS_OFICIAIS).forEach((codigo) => {
      if (horarios[codigo] !== undefined) return; // aluno já tem estado salvo (mesmo que vazio)
      horarios[codigo] = entradasOficiaisParaCodigo(codigo);
      mudou = true;
    });
    if (mudou) Estado.salvarHorarios(horarios);
  }

  function entradasOficiaisParaCodigo(codigo) {
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

  function novaEntrada() {
    return { dia: "Segunda", inicio: "08:00", fim: "10:00", sala: "", turma: "", professor: "", obs: "" };
  }

  function entradasDe(codigo) {
    return horarios[codigo] || [];
  }

  function salvar(codigo, entradas) {
    horarios = Estado.salvarHorarioDisciplina(codigo, entradas);
  }

  // ---------- Departamento: helpers ----------

  function infoDepartamento(nomeCompleto) {
    if (typeof DEPARTAMENTOS_INFO !== "undefined" && DEPARTAMENTOS_INFO[nomeCompleto]) {
      return DEPARTAMENTOS_INFO[nomeCompleto];
    }
    return { curto: nomeCompleto || "Outro", cor: "outro" };
  }

  function agruparPorDepartamento(disciplinas) {
    const grupos = new Map();
    disciplinas.forEach((d) => {
      const chave = d.departamento || "Outro";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(d);
    });
    // ordena os grupos: Engenharia de Materiais primeiro, depois alfabético pelo nome curto
    return [...grupos.entries()].sort((a, b) => {
      const ia = infoDepartamento(a[0]);
      const ib = infoDepartamento(b[0]);
      if (ia.cor === "materiais" && ib.cor !== "materiais") return -1;
      if (ib.cor === "materiais" && ia.cor !== "materiais") return 1;
      return ia.curto.localeCompare(ib.curto, "pt-BR");
    });
  }

  // ---------- Ações ----------

  function onAdicionarSlot(codigo) {
    const entradas = [...entradasDe(codigo), novaEntrada()];
    salvar(codigo, entradas);
    Estado.limparEscolhaOptativa(codigo);
    render();
  }

  function onRemoverSlot(codigo, idx) {
    const entradas = entradasDe(codigo).filter((_, i) => i !== idx);
    salvar(codigo, entradas);
    Estado.limparEscolhaOptativa(codigo);
    render();
  }

  function onRestaurarOficial(codigo) {
    salvar(codigo, entradasOficiaisParaCodigo(codigo));
    Estado.limparEscolhaOptativa(codigo);
    render();
  }

  // Aplica o horário oficial de uma opção de optativa (ex.: OPT6) ao slot genérico
  // do fluxograma (ex.: G7 "Optativa A") que o aluno está preenchendo, e guarda explicitamente
  // qual opção foi escolhida (várias optativas do mesmo grupo podem ter o mesmo horário, então só
  // comparar dia/início/fim não seria suficiente pra saber qual delas é a escolhida).
  function onUsarOptativa(codigoDestino, codigoOpcao) {
    salvar(codigoDestino, entradasOficiaisParaCodigo(codigoOpcao));
    Estado.salvarEscolhaOptativa(codigoDestino, codigoOpcao);
    render();
  }

  function onMudarCampo(codigo, idx, campo, valor) {
    const entradas = entradasDe(codigo).map((e, i) => (i === idx ? { ...e, [campo]: valor } : e));
    salvar(codigo, entradas);
    Estado.limparEscolhaOptativa(codigo);
    indicarSalvo(codigo);
  }

  function indicarSalvo(codigo) {
    const badge = elementoRaiz.querySelector('.badge-salvo[data-codigo="' + codigo + '"]');
    if (!badge) return;
    badge.classList.add("visivel");
    clearTimeout(badge._timeout);
    badge._timeout = setTimeout(() => badge.classList.remove("visivel"), 1200);
  }

  // Botão explícito "Salvar horário": cada edição já salva sozinha (indicarSalvo acima), mas esse
  // botão dá uma confirmação clara e abrangente de que tudo que está na tela está gravado no
  // navegador — útil pra quem quer ter certeza antes de fechar a aba.
  function onSalvarHorarioExplicito() {
    Estado.salvarHorarios(horarios);
    const msg = elementoRaiz.querySelector(".confirmacao-salvo-horario");
    if (!msg) return;
    msg.classList.add("visivel");
    clearTimeout(msg._timeout);
    msg._timeout = setTimeout(() => msg.classList.remove("visivel"), 2200);
  }

  // ---------- Render: Lista (cartões por período, agrupados por depto) ----------

  function htmlSlot(disciplina, entrada, idx) {
    const opcoesDias = DIAS.map(
      (d) => '<option value="' + d + '" ' + (entrada.dia === d ? "selected" : "") + '>' + d + '</option>'
    ).join("");
    const obsHtml = entrada.obs ? '<div class="obs-slot">Período: ' + entrada.obs + '</div>' : "";
    return (
      '<div class="linha-horario">' +
        '<select data-campo="dia" data-idx="' + idx + '">' + opcoesDias + '</select>' +
        '<input type="time" data-campo="inicio" data-idx="' + idx + '" value="' + entrada.inicio + '" />' +
        '<span class="ate">até</span>' +
        '<input type="time" data-campo="fim" data-idx="' + idx + '" value="' + entrada.fim + '" />' +
        '<input type="text" data-campo="turma" data-idx="' + idx + '" value="' + (entrada.turma || "") + '" placeholder="Turma" class="campo-turma" />' +
        '<input type="text" data-campo="sala" data-idx="' + idx + '" value="' + (entrada.sala || "") + '" placeholder="Sala/Lab" class="campo-sala" />' +
        '<input type="text" data-campo="professor" data-idx="' + idx + '" value="' + (entrada.professor || "") + '" placeholder="Professor(a)" class="campo-professor" />' +
        '<button class="btn-remover-slot" data-idx="' + idx + '" title="Remover horário">✕</button>' +
      '</div>' + obsHtml
    );
  }

  // Para as disciplinas-slot de optativa (G7/G8/H9), identifica qual opção concreta o aluno
  // escolheu. Usa a escolha salva explicitamente (Estado.salvarEscolhaOptativa), em vez de
  // comparar dia/início/fim: várias optativas do mesmo grupo caem exatamente no mesmo horário
  // (ex.: OPT1, OPT3 e OPT11 são todas Segunda/Quarta 10h-12h), então só o horário não diz
  // qual delas foi realmente escolhida.
  function identificarOptativaEscolhida(disciplina) {
    if (typeof CODIGO_PARA_GRUPO_OPTATIVA === "undefined" || typeof GRUPOS_OPTATIVAS === "undefined") return null;
    const letra = CODIGO_PARA_GRUPO_OPTATIVA[disciplina.codigo];
    if (!letra) return null;
    const escolhas = Estado.carregarEscolhasOptativas();
    const codigoEscolhido = escolhas[disciplina.codigo];
    if (!codigoEscolhido) return null;
    const opcoes = GRUPOS_OPTATIVAS[letra] || [];
    return opcoes.find((opcao) => opcao.codigo === codigoEscolhido) || null;
  }

  // Bloco com as opções concretas de disciplina pra cada slot de optativa (G7/G8/H9),
  // com o horário oficial de cada uma e um botão pra aplicar a escolhida ao cartão.
  function htmlOpcoesOptativas(disciplina, escolha) {
    if (typeof CODIGO_PARA_GRUPO_OPTATIVA === "undefined" || typeof GRUPOS_OPTATIVAS === "undefined") return "";
    const letra = CODIGO_PARA_GRUPO_OPTATIVA[disciplina.codigo];
    if (!letra) return "";
    const opcoes = GRUPOS_OPTATIVAS[letra] || [];
    const itens = opcoes
      .map((opcao) => {
        const ofertas = (typeof HORARIOS_OFICIAIS !== "undefined" && HORARIOS_OFICIAIS[opcao.codigo]) || [];
        const horarioTexto = ofertas.length
          ? ofertas
              .map((of) => (of.slots || []).map((s) => s.dia.slice(0, 3) + " " + s.inicio + "–" + s.fim).join(", "))
              .join(" | ")
          : "horário não disponível";
        const ativa = escolha && escolha.codigo === opcao.codigo;
        return (
          '<div class="opcao-optativa' + (ativa ? " opcao-optativa-ativa" : "") + '">' +
            '<div class="opcao-optativa-info">' +
              '<strong>' + opcao.nome + '</strong>' +
              '<span class="opcao-optativa-horario">' + horarioTexto + '</span>' +
            '</div>' +
            '<button class="btn-usar-optativa" data-destino="' + disciplina.codigo + '" data-opcao="' + opcao.codigo + '">' +
              (ativa ? "✓ selecionada" : "usar esta opção") +
            '</button>' +
          '</div>'
        );
      })
      .join("");
    return (
      '<div class="opcoes-optativas">' +
        '<p class="opcoes-optativas-titulo">Grupo ' + letra + ' — escolha uma das opções abaixo:</p>' +
        itens +
      '</div>'
    );
  }

  // Agrupa as linhas de horário pela turma (campo livre editável) quando a disciplina tem
  // mais de uma turma cadastrada — cada grupo vira um bloco "Turma X" separado no cartão, em
  // vez de uma lista única sem distinção. Com só uma turma (ou nenhuma), mantém a lista simples,
  // sem cabeçalho, pra não gerar ruído visual no caso comum.
  function agruparEntradasPorTurma(entradas) {
    const grupos = new Map();
    entradas.forEach((e, idx) => {
      const chave = (e.turma || "").trim() || "_sem_turma_";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push({ entrada: e, idx });
    });
    return grupos;
  }

  function htmlGrupoTurma(disciplina, chave, itens) {
    const titulo = chave === "_sem_turma_" ? "Sem turma definida" : "Turma " + chave;
    return (
      '<div class="grupo-turma">' +
        '<div class="titulo-grupo-turma">' + titulo + '</div>' +
        itens.map(({ entrada, idx }) => htmlSlot(disciplina, entrada, idx)).join("") +
      '</div>'
    );
  }

  function htmlListaSlots(disciplina, entradas) {
    const grupos = agruparEntradasPorTurma(entradas);
    if (grupos.size <= 1) {
      return entradas.map((e, i) => htmlSlot(disciplina, e, i)).join("");
    }
    return [...grupos.entries()].map(([chave, itens]) => htmlGrupoTurma(disciplina, chave, itens)).join("");
  }

  function htmlDisciplina(disciplina) {
    const entradas = entradasDe(disciplina.codigo);
    const temOficial = typeof HORARIOS_OFICIAIS !== "undefined" && HORARIOS_OFICIAIS[disciplina.codigo];
    const escolhaOptativa = identificarOptativaEscolhida(disciplina);
    const opcoesOptativasHtml = htmlOpcoesOptativas(disciplina, escolhaOptativa);
    const slotsHtml = entradas.length
      ? htmlListaSlots(disciplina, entradas)
      : '<p class="sem-horario">' + (temOficial || opcoesOptativasHtml ? "Nenhum horário disponível para esta disciplina neste período letivo." : "Não ofertada neste período letivo — cadastre manualmente se necessário.") + '</p>';
    const btnRestaurar = temOficial
      ? '<button class="btn-restaurar-oficial" data-codigo="' + disciplina.codigo + '" title="Restaurar para a oferta oficial do período letivo">↺ restaurar oficial</button>'
      : "";
    const subtituloEscolha = escolhaOptativa
      ? '<span class="card-optativa-escolhida">' + escolhaOptativa.nome + '</span>'
      : "";
    return (
      '<div class="cartao-horario" data-codigo="' + disciplina.codigo + '">' +
        '<div class="cartao-horario-topo">' +
          '<div>' +
            '<span class="card-codigo">' + disciplina.codigo + '</span>' +
            '<strong>' + disciplina.nome + '</strong>' +
            subtituloEscolha +
            '<span class="card-creditos">' + disciplina.creditos + 'cr</span>' +
          '</div>' +
          '<span class="badge-salvo" data-codigo="' + disciplina.codigo + '">salvo ✓</span>' +
        '</div>' +
        opcoesOptativasHtml +
        '<div class="lista-slots">' + slotsHtml + '</div>' +
        '<div class="acoes-cartao-horario">' +
          '<button class="btn-add-slot" data-codigo="' + disciplina.codigo + '">+ adicionar horário</button>' +
          btnRestaurar +
        '</div>' +
      '</div>'
    );
  }

  function htmlGrupoDepartamento(nomeCompleto, disciplinas) {
    const info = infoDepartamento(nomeCompleto);
    return (
      '<div class="grupo-departamento">' +
        '<h3 class="titulo-departamento"><span class="ponto-depto dcor-' + info.cor + '"></span>' + info.curto + '</h3>' +
        '<div class="cartoes-do-grupo">' + disciplinas.map(htmlDisciplina).join("") + '</div>' +
      '</div>'
    );
  }

  function htmlOutrasOfertas() {
    if (typeof OUTRAS_OFERTAS === "undefined" || !OUTRAS_OFERTAS.length) return "";
    const itens = OUTRAS_OFERTAS.map((o) => {
      const diasTexto = (o.slots || [])
        .map((s) => s.dia + " " + s.inicio + "–" + s.fim)
        .join(" · ");
      return (
        '<div class="item-outra-oferta">' +
          '<strong>' + o.nome + '</strong>' +
          '<span class="outra-oferta-depto">' + (o.depto || "") + '</span>' +
          '<div class="outra-oferta-linha">' + (diasTexto || o.horarioBruto) + ' · turma ' + o.turma + ' · ' + (o.vagas ?? "?") + ' vagas</div>' +
          '<div class="outra-oferta-linha outra-oferta-docente">' + (o.docentes || "") + '</div>' +
        '</div>'
      );
    }).join("");
    return (
      '<details class="secao-outras-ofertas">' +
        '<summary>Outras disciplinas ofertadas este período (não estão no fluxograma) — ' + OUTRAS_OFERTAS.length + '</summary>' +
        '<p class="dica-horarios">Podem ser eletivas complementares ou disciplinas com nome atualizado no SIGAA. Confirme com a coordenação se alguma equivale a algo do seu fluxograma.</p>' +
        '<div class="lista-outras-ofertas">' + itens + '</div>' +
      '</details>'
    );
  }

  function renderLista(container) {
    const disciplinasDoPeriodo = listarPorPeriodo(periodoAtual);
    const grupos = agruparPorDepartamento(disciplinasDoPeriodo);
    const periodoLetivo = typeof HORARIOS_PERIODO_LETIVO !== "undefined" ? HORARIOS_PERIODO_LETIVO : null;

    const corpo = grupos.length
      ? grupos.map(([dep, discs]) => htmlGrupoDepartamento(dep, discs)).join("")
      : '<p class="sem-horario">Nenhuma disciplina cadastrada para este período.</p>';

    container.innerHTML =
      '<p class="dica-horarios">' +
        (periodoLetivo ? 'Pré-preenchido com a oferta oficial do período letivo <strong>' + periodoLetivo + '</strong>. ' : "") +
        'Você pode editar ou apagar qualquer campo — tudo fica salvo automaticamente neste navegador. ' +
        'Quando uma disciplina tem mais de uma turma listada, são opções diferentes de horário ' +
        '(por exemplo, uma pra quem está no fluxo normal e outra pra quem ficou em dependência).' +
      '</p>' +
      corpo +
      (periodoAtual === 1 ? htmlOutrasOfertas() : "");

    container.querySelectorAll(".btn-add-slot").forEach((btn) => {
      btn.addEventListener("click", () => onAdicionarSlot(btn.dataset.codigo));
    });
    container.querySelectorAll(".btn-restaurar-oficial").forEach((btn) => {
      btn.addEventListener("click", () => onRestaurarOficial(btn.dataset.codigo));
    });
    container.querySelectorAll(".btn-usar-optativa").forEach((btn) => {
      btn.addEventListener("click", () => onUsarOptativa(btn.dataset.destino, btn.dataset.opcao));
    });
    container.querySelectorAll(".cartao-horario").forEach((cartao) => {
      const codigo = cartao.dataset.codigo;
      cartao.querySelectorAll(".btn-remover-slot").forEach((btn) => {
        btn.addEventListener("click", () => onRemoverSlot(codigo, Number(btn.dataset.idx)));
      });
      cartao.querySelectorAll("[data-campo]").forEach((campo) => {
        const evento = campo.tagName === "SELECT" ? "change" : "input";
        campo.addEventListener(evento, () =>
          onMudarCampo(codigo, Number(campo.dataset.idx), campo.dataset.campo, campo.value)
        );
      });
    });
  }

  // ---------- Render: Matriz semanal ----------

  function todasDisciplinasComCodigo() {
    const todas = [...DISCIPLINAS];
    if (typeof OPTATIVAS !== "undefined") todas.push(...OPTATIVAS);
    const mapa = new Map();
    todas.forEach((d) => mapa.set(d.codigo, d));
    return mapa;
  }

  // códigos que têm horário salvo E estão dentro do escopo de período escolhido na Matriz
  function codigosNoEscopoMatriz() {
    const mapaDisciplinas = todasDisciplinasComCodigo();
    return Object.keys(horarios).filter((codigo) => {
      if (!horarios[codigo] || !horarios[codigo].length) return false;
      const disciplina = mapaDisciplinas.get(codigo);
      if (!disciplina) return false;
      if (periodoMatriz !== "todos" && disciplina.periodo !== periodoMatriz) return false;
      return true;
    });
  }

  function coletarEntradasParaMatriz() {
    const mapaDisciplinas = todasDisciplinasComCodigo();
    const lista = [];
    codigosNoEscopoMatriz().forEach((codigo) => {
      const disciplina = mapaDisciplinas.get(codigo);
      const info = infoDepartamento(disciplina.departamento);
      if (departamentosOcultos.has(info.cor)) return;
      (horarios[codigo] || []).forEach((entrada) => {
        if (!entrada.dia || !entrada.inicio || !entrada.fim) return;
        lista.push({
          codigo,
          nome: disciplina.nome,
          turma: entrada.turma,
          departamento: disciplina.departamento,
          corDepto: info.cor,
          dia: entrada.dia,
          inicio: entrada.inicio,
          fim: entrada.fim,
        });
      });
    });
    return lista;
  }

  function sobrepoe(entrada, faixa) {
    return entrada.inicio < faixa.fim && entrada.fim > faixa.inicio;
  }

  function htmlLegendaDepartamentos() {
    if (typeof DEPARTAMENTOS_INFO === "undefined") return "";
    const mapaDisciplinas = todasDisciplinasComCodigo();
    const usados = new Set();
    codigosNoEscopoMatriz().forEach((codigo) => {
      const d = mapaDisciplinas.get(codigo);
      if (d) usados.add(d.departamento);
    });
    const itens = [...usados].map((dep) => {
      const info = infoDepartamento(dep);
      const oculto = departamentosOcultos.has(info.cor);
      return (
        '<label class="filtro-depto ' + (oculto ? "desativado" : "") + '">' +
          '<input type="checkbox" data-cor="' + info.cor + '" ' + (oculto ? "" : "checked") + ' />' +
          '<span class="ponto-depto dcor-' + info.cor + '"></span>' + info.curto +
        '</label>'
      );
    }).join("");
    return '<div class="filtros-departamento">' + (itens || '<span class="sem-horario">Nenhum horário salvo neste escopo.</span>') + '</div>';
  }

  function renderMatriz(container) {
    const entradas = coletarEntradasParaMatriz();

    // grade[dia][indiceFaixa] = array de entradas que cobrem aquela faixa
    const grade = {};
    DIAS.forEach((dia) => {
      grade[dia] = FAIXAS.map(() => []);
    });
    entradas.forEach((e) => {
      if (!grade[e.dia]) return;
      FAIXAS.forEach((faixa, i) => {
        if (sobrepoe(e, faixa)) grade[e.dia][i].push(e);
      });
    });

    let linhasHtml = "";
    let turnoAnterior = null;
    for (let i = 0; i < FAIXAS.length; i++) {
      const faixa = FAIXAS[i];
      const quebraTurno = turnoAnterior && turnoAnterior !== faixa.turno;
      turnoAnterior = faixa.turno;

      let celulas = '<th class="th-horario">' + faixa.inicio + '–' + faixa.fim + '</th>';
      DIAS.forEach((dia) => {
        const ocupantes = grade[dia][i];
        // pula célula se já foi "consumida" por rowspan de uma linha anterior (aula ou trecho livre)
        if (grade[dia][i] === "consumida" || grade[dia][i] === "consumida-livre") {
          return;
        }
        if (!ocupantes.length) {
          // calcula quantas faixas consecutivas seguidas também estão livres, pra mesclar o "Livre"
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            if (Array.isArray(prox) && prox.length === 0) {
              grade[dia][j] = "consumida-livre";
              span++;
            } else break;
          }
          celulas += '<td class="td-matriz td-vazia" rowspan="' + span + '">Livre</td>';
          return;
        }
        if (ocupantes.length === 1) {
          const entrada = ocupantes[0];
          // calcula quantas faixas consecutivas essa mesma entrada ocupa sozinha, a partir daqui
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            if (Array.isArray(prox) && prox.length === 1 && prox[0] === entrada) {
              grade[dia][j] = "consumida";
              span++;
            } else break;
          }
          celulas +=
            '<td class="td-matriz td-aula dcor-' + entrada.corDepto + '" rowspan="' + span + '">' +
              '<div class="aula-nome">' + entrada.nome + '</div>' +
              '<div class="aula-codigo">' + entrada.codigo + (entrada.turma ? " · T" + entrada.turma : "") + '</div>' +
            '</td>';
        } else {
          // calcula quantas faixas consecutivas têm exatamente o mesmo conjunto de entradas
          let span = 1;
          for (let j = i + 1; j < FAIXAS.length; j++) {
            const prox = grade[dia][j];
            const mesmoConjunto =
              Array.isArray(prox) &&
              prox.length === ocupantes.length &&
              prox.every((p) => ocupantes.includes(p));
            if (mesmoConjunto) {
              grade[dia][j] = "consumida";
              span++;
            } else break;
          }
          const mesmaDisciplina = ocupantes.every((e) => e.codigo === ocupantes[0].codigo);
          if (mesmaDisciplina) {
            // Não é choque real: é a mesma disciplina com turmas diferentes no mesmo horário
            // (comum quando uma turma atende o fluxo normal e outra quem está em dependência).
            // Mostra cada turma separada dentro da célula, com a cor normal do departamento.
            celulas +=
              '<td class="td-matriz td-aula dcor-' + ocupantes[0].corDepto + '" rowspan="' + span + '">' +
                '<div class="aula-nome">' + ocupantes[0].nome + '</div>' +
                '<div class="itens-multi-turma">' +
                  ocupantes
                    .map(
                      (e) =>
                        '<div class="item-multi-turma">' +
                          '<span class="badge-turma">' + (e.turma ? "Turma " + e.turma : "Turma") + '</span>' +
                        '</div>'
                    )
                    .join("") +
                '</div>' +
              '</td>';
          } else {
            // conflito real: disciplinas diferentes na mesma faixa/dia
            celulas +=
              '<td class="td-matriz td-conflito" rowspan="' + span + '">' +
                ocupantes
                  .map(
                    (e) =>
                      '<div class="aula-conflito-item dcor-' + e.corDepto + '">' +
                        '<div class="aula-nome">' + e.nome + '</div>' +
                        '<div class="aula-codigo">' + e.codigo + (e.turma ? " · T" + e.turma : "") + '</div>' +
                      '</div>'
                  )
                  .join("") +
              '</td>';
          }
        }
      });

      linhasHtml += '<tr class="' + (quebraTurno ? "linha-quebra-turno" : "") + '">' + celulas + '</tr>';
    }

    const cabecalhoDias = DIAS.map((d) => '<th>' + d + '</th>').join("");
    const descricaoEscopo =
      periodoMatriz === "todos"
        ? "todas as disciplinas que têm horário salvo, de qualquer período"
        : "as disciplinas do " + periodoMatriz + "° período que têm horário salvo";

    container.innerHTML =
      '<p class="dica-horarios">Grade semanal com ' + descricaoEscopo + '. Os horários vagos aparecem como "Livre". Use os filtros abaixo pra esconder departamentos.</p>' +
      htmlLegendaDepartamentos() +
      '<div class="tabela-scroll">' +
        '<table class="tabela-matriz">' +
          '<thead><tr><th class="th-horario"></th>' + cabecalhoDias + '</tr></thead>' +
          '<tbody>' + linhasHtml + '</tbody>' +
        '</table>' +
      '</div>';

    container.querySelectorAll(".filtro-depto input").forEach((chk) => {
      chk.addEventListener("change", () => {
        const cor = chk.dataset.cor;
        if (chk.checked) departamentosOcultos.delete(cor);
        else departamentosOcultos.add(cor);
        renderMatriz(container);
      });
    });
  }

  // ---------- Render principal ----------

  function render() {
    const seletorPeriodosLista = Array.from({ length: 10 }, (_, i) => i + 1)
      .map(
        (p) =>
          '<button class="btn-periodo ' + (p === periodoAtual ? "ativo" : "") + '" data-periodo="' + p + '">' + p + '°</button>'
      )
      .join("");

    const seletorPeriodosMatriz =
      '<button class="btn-periodo ' + (periodoMatriz === "todos" ? "ativo" : "") + '" data-periodo-matriz="todos">Todos</button>' +
      Array.from({ length: 10 }, (_, i) => i + 1)
        .map(
          (p) =>
            '<button class="btn-periodo ' + (p === periodoMatriz ? "ativo" : "") + '" data-periodo-matriz="' + p + '">' + p + '°</button>'
        )
        .join("");

    elementoRaiz.innerHTML =
      '<div class="barra-controle-horarios">' +
        '<div class="seletor-modo">' +
          '<button class="btn-modo ' + (modoVisualizacao === "lista" ? "ativo" : "") + '" data-modo="lista">☰ Lista</button>' +
          '<button class="btn-modo ' + (modoVisualizacao === "matriz" ? "ativo" : "") + '" data-modo="matriz">▦ Matriz</button>' +
        '</div>' +
        '<div class="seletor-periodos">' + (modoVisualizacao === "lista" ? seletorPeriodosLista : seletorPeriodosMatriz) + '</div>' +
        '<div class="acoes-salvar-horario">' +
          '<button class="btn-salvar-horario" title="Confirma que tudo que está na tela está salvo neste navegador">💾 Salvar horário</button>' +
          '<span class="confirmacao-salvo-horario">Horário salvo ✓</span>' +
        '</div>' +
      '</div>' +
      '<div class="painel-modo-horarios"></div>';

    elementoRaiz.querySelector(".btn-salvar-horario").addEventListener("click", onSalvarHorarioExplicito);

    elementoRaiz.querySelectorAll(".btn-modo").forEach((btn) => {
      btn.addEventListener("click", () => {
        modoVisualizacao = btn.dataset.modo;
        render();
      });
    });

    elementoRaiz.querySelectorAll(".btn-periodo").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.periodo !== undefined) {
          periodoAtual = Number(btn.dataset.periodo);
          render();
        } else if (btn.dataset.periodoMatriz !== undefined) {
          periodoMatriz = btn.dataset.periodoMatriz === "todos" ? "todos" : Number(btn.dataset.periodoMatriz);
          render();
        }
      });
    });

    const painel = elementoRaiz.querySelector(".painel-modo-horarios");
    if (modoVisualizacao === "matriz") {
      renderMatriz(painel);
    } else {
      renderLista(painel);
    }
  }

  // FAIXAS exposta pra outros módulos (ex.: ofertadas.js) reaproveitarem a mesma tabela de
  // horários sem duplicar — se um dia a duração das aulas mudar de novo, muda só aqui.
  return { init, render, FAIXAS };
})();
