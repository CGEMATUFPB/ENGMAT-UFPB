/**
 * render.js
 * Renderização do Fluxograma interativo (grid de períodos x disciplinas).
 */

const Fluxograma = (() => {
  let elementoRaiz = null;
  let concluidas = new Set();
  let cursando = new Set();
  let codigoSelecionado = null; // disciplina clicada, para destacar cadeia de pré-requisitos
  let mostrarPainelHorario = false;
  let modoCaminho = false; // destaca só o que já dá pra cursar agora, esmaecendo o resto
  let periodoMobile = null; // período mostrado na versão celular (null = escolhe automaticamente)

  const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  function init(root) {
    elementoRaiz = root;
    concluidas = Estado.carregarConcluidas();
    cursando = Estado.carregarCursando();
    render();
  }

  function ancestrais(codigo, visitados = new Set()) {
    const d = buscarDisciplina(codigo);
    if (!d) return visitados;
    const reqs = [...(d.prereq || []), ...(d.coRequisito || [])];
    reqs.forEach((cod) => {
      if (!visitados.has(cod)) {
        visitados.add(cod);
        ancestrais(cod, visitados);
      }
    });
    return visitados;
  }

  function descendentes(codigo, visitados = new Set()) {
    listarDependentes(codigo).forEach((d) => {
      if (!visitados.has(d.codigo)) {
        visitados.add(d.codigo);
        descendentes(d.codigo, visitados);
      }
    });
    return visitados;
  }

  function onClicarCard(codigo, ev) {
    if (ev.target.closest(".check-concluida") || ev.target.closest(".check-cursando")) return; // checkboxes tratam separado
    if (modoCaminho) return; // no modo caminho o destaque é fixo (disponível x bloqueada), sem seleção manual
    codigoSelecionado = codigoSelecionado === codigo ? null : codigo;
    render();
  }

  // ---------- Modo "o que posso cursar agora" (caminho a partir do progresso atual) ----------

  function disciplinaDisponivel(disciplina) {
    return !concluidas.has(disciplina.codigo) && prereqsAtendidos(disciplina, concluidas);
  }

  function disciplinasDisponiveisAgora() {
    return DISCIPLINAS.filter(disciplinaDisponivel);
  }

  function onAlternarModoCaminho() {
    modoCaminho = !modoCaminho;
    if (modoCaminho) codigoSelecionado = null; // os dois modos de destaque não se combinam
    render();
  }

  function onToggleConcluida(codigo) {
    concluidas = Estado.alternarConcluida(codigo);
    // Concluída e cursando são estados excludentes: se acabou de marcar como concluída e ela
    // ainda estava marcada como "cursando este período", tira do cursando (senão fica contando
    // no horário/PDF do período uma disciplina que já foi validada).
    if (concluidas.has(codigo) && cursando.has(codigo)) {
      cursando = Estado.alternarCursando(codigo);
    }
    render();
    document.dispatchEvent(new CustomEvent("progresso:atualizado"));
  }

  function onToggleCursando(codigo) {
    if (concluidas.has(codigo)) return; // bloqueado: disciplina já concluída não pode ser "cursando"
    cursando = Estado.alternarCursando(codigo);
    render();
  }

  // ---------- Marcar período inteiro como concluído (acompanhar taxa de conclusão) ----------

  function disciplinasDoPeriodo(periodo) {
    return DISCIPLINAS.filter((d) => d.periodo === periodo);
  }

  function periodoTotalmenteConcluido(periodo) {
    const discs = disciplinasDoPeriodo(periodo);
    return discs.length > 0 && discs.every((d) => concluidas.has(d.codigo));
  }

  // Alterna: se todas as disciplinas do período já estão concluídas, desmarca todas; senão,
  // marca todas de uma vez (inclusive as que já estavam marcadas individualmente).
  function onAlternarPeriodoConcluido(periodo) {
    const discs = disciplinasDoPeriodo(periodo);
    const desmarcar = periodoTotalmenteConcluido(periodo);
    discs.forEach((d) => {
      if (desmarcar) concluidas.delete(d.codigo);
      else concluidas.add(d.codigo);
    });
    Estado.salvarConcluidas(concluidas);
    render();
    document.dispatchEvent(new CustomEvent("progresso:atualizado"));
  }

  function classeCard(disciplina) {
    const classes = ["card-disciplina", `depto-${disciplina.depto || "outros"}`];
    const estaConcluida = concluidas.has(disciplina.codigo);
    const estaDisponivel = disciplinaDisponivel(disciplina);
    if (estaConcluida) classes.push("concluida");
    if (cursando.has(disciplina.codigo)) classes.push("cursando");
    if (estaDisponivel) classes.push("disponivel");

    if (modoCaminho) {
      // Caminho a partir de agora: o que já dá pra cursar fica em destaque forte; o que ainda
      // depende de outra disciplina fica esmaecido. Concluídas mantêm a cor normal (verde).
      if (estaDisponivel) classes.push("caminho-disponivel");
      else if (!estaConcluida) classes.push("caminho-bloqueada");
    } else if (codigoSelecionado) {
      if (disciplina.codigo === codigoSelecionado) classes.push("selecionada");
      else if (ancestrais(codigoSelecionado).has(disciplina.codigo)) classes.push("eh-prerequisito");
      else if (descendentes(codigoSelecionado).has(disciplina.codigo)) classes.push("eh-dependente");
      else classes.push("esmaecida");
    }
    return classes.join(" ");
  }

  function htmlCard(disciplina) {
    const reqTexto = [
      ...(disciplina.prereq || []),
      ...((disciplina.coRequisito || []).map((c) => `#${c}`)),
    ].join(", ");
    return `
      <div class="${classeCard(disciplina)}" data-codigo="${disciplina.codigo}" title="${disciplina.nome}">
        <div class="card-topo">
          <label class="check-concluida" title="Marcar como concluída">
            <input type="checkbox" ${concluidas.has(disciplina.codigo) ? "checked" : ""} data-codigo="${disciplina.codigo}" />
          </label>
          <label class="check-cursando${concluidas.has(disciplina.codigo) ? " desabilitado" : ""}" title="${
      concluidas.has(disciplina.codigo)
        ? "Disciplina já concluída — não dá pra marcar como cursando"
        : "Marcar como cursando este período"
    }">
            <input type="checkbox" ${cursando.has(disciplina.codigo) ? "checked" : ""} ${
      concluidas.has(disciplina.codigo) ? "disabled" : ""
    } data-codigo="${disciplina.codigo}" />
            <span class="rotulo-cursando">cursando</span>
          </label>
          <span class="card-creditos">${disciplina.creditos}cr</span>
        </div>
        <div class="card-nome">${disciplina.nome}</div>
        <div class="card-rodape">
          <span class="card-codigo">${disciplina.codigo}</span>
          ${reqTexto ? `<span class="card-prereq">${reqTexto}</span>` : ""}
        </div>
      </div>`;
  }

  // ---------- Versão celular do fluxograma: um período por vez ----------
  // No celular a grade 10 colunas x 8 linhas não cabe. Mostramos um seletor de períodos
  // (1°…10°) e só os cartões do período escolhido, empilhados. Como os pré-requisitos ficam
  // em outros períodos (fora da tela), tocar num cartão abre um painel listando pré-requisitos
  // e o que ele libera — cada item é tocável e leva direto ao período daquela disciplina.
  // Os cartões são os mesmos da versão desktop (htmlCard), então checkboxes e destaques
  // funcionam igual. O CSS mostra esta versão OU a tabela, conforme a largura da tela.

  function periodoMobileInicial() {
    for (let p = 1; p <= 10; p++) {
      if (!periodoTotalmenteConcluido(p)) return p;
    }
    return 1;
  }

  function htmlLinkDisciplinaMobile(codigo) {
    const d = buscarDisciplina(codigo);
    if (!d) return "";
    const status = concluidas.has(codigo) ? "✓" : cursando.has(codigo) ? "◐" : "○";
    const classe = concluidas.has(codigo) ? " ok" : "";
    return (
      `<button type="button" class="link-disciplina-mobile${classe}" data-codigo="${codigo}" data-periodo="${d.periodo || ""}">` +
      `<span class="link-status">${status}</span>` +
      `<span class="link-codigo">${codigo}</span>` +
      `<span class="link-nome">${d.nome}</span>` +
      `${d.periodo ? `<span class="link-periodo">${d.periodo}°</span>` : ""}` +
      `</button>`
    );
  }

  function htmlInfoSelecionadaMobile() {
    if (!codigoSelecionado || modoCaminho) return "";
    const d = buscarDisciplina(codigoSelecionado);
    if (!d) return "";
    const reqs = [...(d.prereq || []), ...(d.coRequisito || [])];
    const deps = listarDependentes(d.codigo).map((x) => x.codigo);
    return (
      `<div class="info-selecionada-mobile">` +
      `<div class="info-sel-topo"><strong>${d.codigo} — ${d.nome}</strong>` +
      `<button type="button" class="btn-fechar-info-mobile" aria-label="Fechar">✕</button></div>` +
      `<div class="info-sel-bloco info-sel-prereq"><span class="info-sel-titulo">Pré-requisitos</span>` +
      (reqs.length ? reqs.map(htmlLinkDisciplinaMobile).join("") : `<span class="sem-horario">Nenhum</span>`) +
      `</div>` +
      `<div class="info-sel-bloco info-sel-dep"><span class="info-sel-titulo">Libera</span>` +
      (deps.length ? deps.map(htmlLinkDisciplinaMobile).join("") : `<span class="sem-horario">Nenhuma disciplina depende desta</span>`) +
      `</div>` +
      `</div>`
    );
  }

  function htmlFluxogramaMobile() {
    if (periodoMobile === null) periodoMobile = periodoMobileInicial();
    const p = periodoMobile;

    const chips = Array.from({ length: 10 }, (_, i) => i + 1)
      .map((n) => {
        const completo = periodoTotalmenteConcluido(n);
        const livres = modoCaminho ? disciplinasDoPeriodo(n).filter(disciplinaDisponivel).length : 0;
        return (
          `<button type="button" class="chip-periodo-mobile${n === p ? " ativo" : ""}${completo ? " completo" : ""}" data-periodo="${n}">` +
          `${n}°${completo ? " ✓" : ""}` +
          (livres ? `<span class="chip-livres">${livres}</span>` : "") +
          `</button>`
        );
      })
      .join("");

    const discs = disciplinasDoPeriodo(p).sort((a, b) => a.codigo.localeCompare(b.codigo));
    const feitas = discs.filter((d) => concluidas.has(d.codigo)).length;
    const completo = periodoTotalmenteConcluido(p);
    const t = TOTAIS_POR_PERIODO[p] || { creditos: 0, ch: 0 };

    return (
      `<div class="chips-periodo-mobile" role="tablist">${chips}</div>` +
      `<div class="cabecalho-periodo-mobile">` +
      `<div><strong>${p}° Período</strong><span>${feitas}/${discs.length} concluídas · ${t.creditos} créditos · ${t.ch}h</span></div>` +
      `<button class="btn-marcar-periodo btn-marcar-periodo-mobile${completo ? " marcado" : ""}" data-periodo="${p}">` +
      `${completo ? "↺ desmarcar tudo" : "✓ marcar tudo"}</button>` +
      `</div>` +
      htmlInfoSelecionadaMobile() +
      `<div class="lista-cards-mobile">${discs.map(htmlCard).join("")}</div>` +
      `<p class="dica-mobile">Toque numa disciplina para ver pré-requisitos e o que ela libera.</p>`
    );
  }

  // ---------- Conteúdos Complementares Flexíveis (12 créditos, sem período fixo) ----------

  function htmlItemFlexivel(d) {
    const marcado = concluidas.has(d.codigo);
    return (
      `<label class="item-flexivel${marcado ? " concluida" : ""}">` +
        `<input type="checkbox" ${marcado ? "checked" : ""} data-codigo="${d.codigo}" class="check-flexivel" />` +
        `<span class="item-flexivel-nome">${d.nome}</span>` +
        `<span class="item-flexivel-creditos">${d.creditos}cr</span>` +
      `</label>`
    );
  }

  function htmlSecaoFlexiveis() {
    if (typeof CONTEUDOS_FLEXIVEIS === "undefined" || !CONTEUDOS_FLEXIVEIS.length) return "";
    return (
      '<div class="secao-flexiveis">' +
        "<h3>Conteúdos Complementares Flexíveis</h3>" +
        '<p class="dica-horarios">12 créditos (180h) da estrutura curricular são "flexíveis" — não têm período ' +
        "fixo no fluxograma oficial. Marque abaixo conforme for cursando/validando cada um.</p>" +
        '<div class="lista-flexiveis">' +
        CONTEUDOS_FLEXIVEIS.map(htmlItemFlexivel).join("") +
        "</div>" +
      "</div>"
    );
  }

  // ---------- Painel "Meu horário deste período" + exportação em PDF ----------

  function sobrepoeFaixa(entrada, faixa) {
    return entrada.inicio < faixa.fim && entrada.fim > faixa.inicio;
  }

  // Usa o horário já editado pelo aluno na aba Horários se existir; senão cai pro oficial.
  function entradasParaCodigo(codigo) {
    const horarios = Estado.carregarHorarios();
    if (horarios[codigo] && horarios[codigo].length) return horarios[codigo];
    const oficiais = (typeof HORARIOS_OFICIAIS !== "undefined" && HORARIOS_OFICIAIS[codigo]) || [];
    const entradas = [];
    oficiais.forEach((oferta) => {
      (oferta.slots || []).forEach((slot) => {
        entradas.push({ dia: slot.dia, inicio: slot.inicio, fim: slot.fim, turma: oferta.turma, professor: oferta.docentes });
      });
    });
    return entradas;
  }

  function disciplinasCursando() {
    return [...cursando]
      .map((codigo) => buscarDisciplina(codigo))
      .filter(Boolean)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }

  // ---------- Turma preferida (quando a disciplina cursando tem 2+ turmas cadastradas) ----------

  // Agrupa as entradas de uma disciplina pela turma. Retorna um Map preservando a ordem de
  // primeira aparição (útil pra escolher "a primeira turma" como padrão de forma previsível).
  function turmasDaDisciplina(codigo) {
    const grupos = new Map();
    entradasParaCodigo(codigo).forEach((e) => {
      const chave = (e.turma || "").trim() || "_sem_turma_";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(e);
    });
    return grupos;
  }

  function turmaEscolhidaPara(codigo, grupos) {
    const salvas = Estado.carregarTurmasPreferidas();
    if (salvas[codigo] && grupos.has(salvas[codigo])) return salvas[codigo];
    return [...grupos.keys()][0]; // padrão: primeira turma encontrada
  }

  // Entradas de horário que de fato entram na grade "Meu horário": se a disciplina tem só uma
  // turma, usa todas; se tem 2+, usa só a turma escolhida (ou a primeira, por padrão) — sem isso
  // a grade mostraria as turmas todas como se o aluno cursasse ao mesmo tempo.
  function entradasEscolhidasParaCodigo(codigo) {
    const grupos = turmasDaDisciplina(codigo);
    if (grupos.size <= 1) return entradasParaCodigo(codigo);
    const escolhida = turmaEscolhidaPara(codigo, grupos);
    return grupos.get(escolhida) || [];
  }

  function onEscolherTurmaCursando(codigo, turma) {
    Estado.salvarTurmaPreferida(codigo, turma);
    render();
  }

  function htmlPainelMeuHorario() {
    const disciplinas = disciplinasCursando();
    if (!disciplinas.length) {
      return (
        '<div class="painel-meu-horario">' +
          '<p class="sem-horario">Marque "cursando" em alguma disciplina do fluxograma pra montar seu horário deste período aqui.</p>' +
        '</div>'
      );
    }

    const FAIXAS = (typeof Horarios !== "undefined" && Horarios.FAIXAS) || [];
    const grade = {};
    DIAS.forEach((dia) => {
      grade[dia] = FAIXAS.map(() => []);
    });

    const ofertas = [];
    disciplinas.forEach((d) => {
      entradasEscolhidasParaCodigo(d.codigo).forEach((e) => {
        if (!e.dia || !e.inicio || !e.fim) return;
        ofertas.push({
          codigo: d.codigo,
          nome: d.nome,
          dia: e.dia,
          inicio: e.inicio,
          fim: e.fim,
          turma: e.turma,
          professor: e.professor || e.docentes,
        });
      });
    });

    ofertas.forEach((o) => {
      if (!grade[o.dia]) return;
      FAIXAS.forEach((faixa, i) => {
        if (sobrepoeFaixa(o, faixa)) grade[o.dia][i].push(o);
      });
    });

    let linhasHtml = "";
    FAIXAS.forEach((faixa, i) => {
      let celulas = '<th class="th-horario">' + faixa.inicio + "–" + faixa.fim + "</th>";
      DIAS.forEach((dia) => {
        const ocupantes = grade[dia][i];
        if (!ocupantes.length) {
          celulas += '<td class="td-matriz td-vazia">Livre</td>';
          return;
        }
        if (ocupantes.length === 1) {
          const o = ocupantes[0];
          celulas +=
            '<td class="td-matriz td-aula dcor-materiais">' +
            '<div class="aula-nome">' + o.nome + "</div>" +
            '<div class="aula-codigo">' + o.codigo + (o.turma ? " · T" + o.turma : "") + "</div>" +
            (o.professor ? '<div class="aula-professor">' + o.professor + "</div>" : "") +
            "</td>";
          return;
        }
        const mesmaDisciplina = ocupantes.every((o) => o.codigo === ocupantes[0].codigo);
        if (mesmaDisciplina) {
          // Turmas diferentes da mesma disciplina no mesmo horário — não é um choque real.
          celulas +=
            '<td class="td-matriz td-aula dcor-materiais">' +
            '<div class="aula-nome">' + ocupantes[0].nome + "</div>" +
            '<div class="itens-multi-turma">' +
            ocupantes
              .map(
                (o) =>
                  '<div class="item-multi-turma">' +
                  '<span class="badge-turma">' + (o.turma ? "Turma " + o.turma : "Turma") + "</span>" +
                  (o.professor ? '<div class="aula-professor">' + o.professor + "</div>" : "") +
                  "</div>"
              )
              .join("") +
            "</div></td>";
          return;
        }
        // Choque real: duas (ou mais) disciplinas diferentes marcadas como "cursando" no mesmo horário.
        celulas +=
          '<td class="td-matriz td-conflito">' +
          ocupantes
            .map(
              (o) =>
                '<div class="aula-conflito-item dcor-materiais">' +
                '<div class="aula-nome">' + o.nome + "</div>" +
                '<div class="aula-codigo">' + o.codigo + (o.turma ? " · T" + o.turma : "") + "</div>" +
                (o.professor ? '<div class="aula-professor">' + o.professor + "</div>" : "") +
                "</div>"
            )
            .join("") +
          "</td>";
      });
      linhasHtml += "<tr>" + celulas + "</tr>";
    });

    const semHorario = disciplinas.filter((d) => entradasParaCodigo(d.codigo).length === 0);

    const listaTexto = disciplinas
      .map((d) => {
        const avisoInline = entradasParaCodigo(d.codigo).length === 0
          ? ' <span class="aviso-sem-horario-inline">⚠ sem horário cadastrado</span>'
          : "";
        const grupos = turmasDaDisciplina(d.codigo);
        let seletorTurma = "";
        if (grupos.size > 1) {
          const escolhida = turmaEscolhidaPara(d.codigo, grupos);
          const opcoes = [...grupos.keys()]
            .map((t) => {
              const rotulo = t === "_sem_turma_" ? "sem turma" : "Turma " + t;
              return '<option value="' + t + '" ' + (t === escolhida ? "selected" : "") + ">" + rotulo + "</option>";
            })
            .join("");
          seletorTurma =
            ' <select class="seletor-turma-cursando" data-codigo="' + d.codigo + '" title="Qual turma dessa disciplina é a sua">' +
            opcoes +
            "</select>";
        }
        return "<li>" + d.codigo + " — " + d.nome + " (" + d.creditos + "cr)" + seletorTurma + avisoInline + "</li>";
      })
      .join("");
    const cabecalhoDias = DIAS.map((d) => "<th>" + d + "</th>").join("");

    const avisoSemHorarioHtml = semHorario.length
      ? '<p class="aviso-sem-horario">⚠ ' +
        semHorario.map((d) => d.codigo + " — " + d.nome).join(", ") +
        (semHorario.length === 1 ? " não tem horário oficial cadastrado" : " não têm horário oficial cadastrado") +
        " (normalmente disciplina de outro departamento, fora da oferta do DEMAT) e por isso " +
        (semHorario.length === 1 ? "não aparece" : "não aparecem") +
        ' na grade abaixo nem no PDF. Adicione o horário manualmente na aba <strong>Horários</strong> ' +
        "(escolha o período dela e preencha dia/horário) pra ela aparecer aqui.</p>"
      : "";

    const temSeletorTurma = disciplinas.some((d) => turmasDaDisciplina(d.codigo).size > 1);
    const dicaTurmaHtml = temSeletorTurma
      ? '<p class="dica-horarios">Disciplinas com mais de uma turma cadastrada mostram um seletor ao lado do ' +
        "nome — escolha qual turma é a sua pra grade abaixo (e o PDF) refletirem só o horário que você vai " +
        "cursar de fato, sem misturar turmas diferentes.</p>"
      : "";

    return (
      '<div class="painel-meu-horario" id="painel-meu-horario-conteudo">' +
        "<h3>Meu horário deste período</h3>" +
        dicaTurmaHtml +
        '<ul class="lista-disciplinas-cursando">' + listaTexto + "</ul>" +
        avisoSemHorarioHtml +
        '<div class="tabela-scroll">' +
          '<table class="tabela-matriz">' +
            '<thead><tr><th class="th-horario"></th>' + cabecalhoDias + "</tr></thead>" +
            "<tbody>" + linhasHtml + "</tbody>" +
          "</table>" +
        "</div>" +
      "</div>"
    );
  }

  function onBaixarPdfHorario() {
    const elemento = document.getElementById("painel-meu-horario-conteudo");
    if (!elemento) {
      alert('Marque pelo menos uma disciplina como "cursando" antes de baixar o PDF.');
      return;
    }
    if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
      alert(
        "Não foi possível gerar o PDF: as bibliotecas de exportação não carregaram (confira sua conexão com a internet e tente de novo)."
      );
      return;
    }
    html2canvas(elemento, { scale: 2, backgroundColor: "#ffffff", windowWidth: 1500 }).then((canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const imgData = canvas.toDataURL("image/png");
      const margem = 24;
      const larguraPagina = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const larguraImg = larguraPagina - margem * 2;
      const alturaImg = (canvas.height * larguraImg) / canvas.width;
      const alturaFinal = Math.min(alturaImg, alturaPagina - margem * 2);
      const larguraFinal = alturaFinal === alturaImg ? larguraImg : (canvas.width * alturaFinal) / canvas.height;
      pdf.addImage(imgData, "PNG", margem, margem, larguraFinal, alturaFinal);
      pdf.save("meu-horario-engenharia-materiais.pdf");
    });
  }

  // ---------- Baixar o fluxograma completo em PDF (% concluído, créditos e disciplinas) ----------

  function onBaixarPdfFluxograma() {
    const elemento = document.getElementById("fluxograma-para-pdf");
    if (!elemento) return;
    if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
      alert(
        "Não foi possível gerar o PDF: as bibliotecas de exportação não carregaram (confira sua conexão com a internet e tente de novo)."
      );
      return;
    }
    html2canvas(elemento, { scale: 2, backgroundColor: "#ffffff", windowWidth: 1500 }).then((canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const imgData = canvas.toDataURL("image/png");
      const margem = 20;
      const larguraPagina = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const larguraImg = larguraPagina - margem * 2;
      const alturaImg = (canvas.height * larguraImg) / canvas.width;
      const alturaFinal = Math.min(alturaImg, alturaPagina - margem * 2);
      const larguraFinal = alturaFinal === alturaImg ? larguraImg : (canvas.width * alturaFinal) / canvas.height;
      pdf.addImage(imgData, "PNG", margem, margem, larguraFinal, alturaFinal);
      pdf.save("fluxograma-engenharia-materiais.pdf");
    });
  }

  function render() {
    const periodos = Array.from({ length: 10 }, (_, i) => i + 1);
    const linhas = ["A", "B", "C", "D", "E", "F", "G", "H"];

    let colgroup = `<col class="col-linha">` + periodos.map(() => `<col />`).join("");

    let cabecalho = `<tr><th class="th-linha"></th>${periodos
      .map((p) => {
        const completo = periodoTotalmenteConcluido(p);
        return (
          `<th>${p}° Período` +
          `<button class="btn-marcar-periodo${completo ? " marcado" : ""}" data-periodo="${p}" ` +
          `title="${completo ? "Desmarcar" : "Marcar"} todas as disciplinas do ${p}° período como concluídas">` +
          `${completo ? "↺ desmarcar tudo" : "✓ marcar tudo"}</button></th>`
        );
      })
      .join("")}</tr>`;

    let corpo = linhas
      .map((linha) => {
        const celulas = periodos
          .map((p) => {
            const d = DISCIPLINAS.find((x) => x.codigo === `${linha}${p}`);
            return `<td>${d ? htmlCard(d) : ""}</td>`;
          })
          .join("");
        return `<tr><th class="th-linha">${linha}</th>${celulas}</tr>`;
      })
      .join("");

    let rodapeTotais = `<tr class="linha-totais"><th class="th-linha">Total</th>${periodos
      .map((p) => {
        const t = TOTAIS_POR_PERIODO[p];
        return `<td class="td-total">Créditos: ${t.creditos}<br>CH: ${t.ch}</td>`;
      })
      .join("")}</tr>`;

    const progresso = calcularProgresso(concluidas);
    const disponiveisAgora = disciplinasDisponiveisAgora();

    elementoRaiz.innerHTML = `
      <div class="acoes-fluxograma">
        <button class="btn-modo-caminho${modoCaminho ? " ativo" : ""}">${modoCaminho ? "✕ Sair do modo caminho" : "🧭 O que posso cursar agora?"}</button>
        <button class="btn-baixar-pdf-fluxograma">⬇ Baixar fluxograma em PDF</button>
        <button class="btn-ver-meu-horario">${mostrarPainelHorario ? "▲ Esconder" : "📅 Ver"} meu horário deste período</button>
        ${mostrarPainelHorario ? '<button class="btn-baixar-pdf-horario">⬇ Baixar PDF do horário</button>' : ""}
      </div>
      ${mostrarPainelHorario ? htmlPainelMeuHorario() : ""}

      <div id="fluxograma-para-pdf">
        <div class="barra-progresso-wrap">
          <div class="barra-progresso-info">
            <strong>${progresso.percentual}%</strong> concluído
            — ${progresso.creditosConcluidos}/${progresso.totalCreditos} créditos
            — ${progresso.disciplinasConcluidas}/${progresso.totalDisciplinas} disciplinas
          </div>
          <div class="barra-progresso-fundo">
            <div class="barra-progresso-preenchida" style="width:${progresso.percentual}%"></div>
          </div>
        </div>

        ${
          modoCaminho
            ? `<p class="info-caminho">🧭 Com base no que você já concluiu, <strong>${disponiveisAgora.length} disciplina${disponiveisAgora.length === 1 ? "" : "s"}</strong> ${disponiveisAgora.length === 1 ? "está disponível" : "estão disponíveis"} pra cursar agora (destacadas abaixo). As demais aparecem esmaecidas até você concluir os pré-requisitos delas.</p>`
            : ""
        }

        <div class="legenda">
          <span class="legenda-item"><span class="amostra disponivel"></span> Disponível para cursar</span>
          <span class="legenda-item"><span class="amostra concluida"></span> Concluída</span>
          <span class="legenda-item"><span class="amostra cursando"></span> Cursando este período</span>
          <span class="legenda-item"><span class="amostra depto-materiais"></span> Eng. de Materiais</span>
          <span class="legenda-item"><span class="amostra depto-outros"></span> Outros departamentos</span>
          <span class="legenda-dica">Clique numa disciplina para destacar pré-requisitos (azul) e quem depende dela (laranja). Marque "cursando" pra incluir no seu horário do período. O botão no topo de cada período marca (ou desmarca) todas as disciplinas dele como concluídas de uma vez. O botão "🧭 O que posso cursar agora?" destaca só as disciplinas liberadas pelo seu progresso.</span>
        </div>

        <div class="fluxo-mobile">${htmlFluxogramaMobile()}</div>

        <div class="tabela-scroll fluxo-desktop">
          <table class="tabela-fluxograma">
            <colgroup>${colgroup}</colgroup>
            <thead>${cabecalho}</thead>
            <tbody>${corpo}${rodapeTotais}</tbody>
          </table>
        </div>

        ${htmlSecaoFlexiveis()}
      </div>
    `;

    elementoRaiz.querySelectorAll(".card-disciplina").forEach((card) => {
      card.addEventListener("click", (ev) => onClicarCard(card.dataset.codigo, ev));
    });
    elementoRaiz.querySelectorAll(".check-concluida input").forEach((chk) => {
      chk.addEventListener("change", () => onToggleConcluida(chk.dataset.codigo));
    });
    elementoRaiz.querySelectorAll(".check-flexivel").forEach((chk) => {
      chk.addEventListener("change", () => onToggleConcluida(chk.dataset.codigo));
    });
    elementoRaiz.querySelectorAll(".check-cursando input").forEach((chk) => {
      chk.addEventListener("change", () => onToggleCursando(chk.dataset.codigo));
    });
    elementoRaiz.querySelectorAll(".seletor-turma-cursando").forEach((sel) => {
      sel.addEventListener("change", () => onEscolherTurmaCursando(sel.dataset.codigo, sel.value));
    });
    elementoRaiz.querySelectorAll(".btn-marcar-periodo").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        onAlternarPeriodoConcluido(Number(btn.dataset.periodo));
      });
    });
    const btnVerHorario = elementoRaiz.querySelector(".btn-ver-meu-horario");
    if (btnVerHorario) {
      btnVerHorario.addEventListener("click", () => {
        mostrarPainelHorario = !mostrarPainelHorario;
        render();
      });
    }
    const btnPdf = elementoRaiz.querySelector(".btn-baixar-pdf-horario");
    if (btnPdf) btnPdf.addEventListener("click", onBaixarPdfHorario);
    const btnPdfFluxograma = elementoRaiz.querySelector(".btn-baixar-pdf-fluxograma");
    if (btnPdfFluxograma) btnPdfFluxograma.addEventListener("click", onBaixarPdfFluxograma);
    const btnModoCaminho = elementoRaiz.querySelector(".btn-modo-caminho");
    if (btnModoCaminho) btnModoCaminho.addEventListener("click", onAlternarModoCaminho);

    // Versão celular: troca de período, painel de pré-requisitos e atalhos entre disciplinas
    elementoRaiz.querySelectorAll(".chip-periodo-mobile").forEach((btn) => {
      btn.addEventListener("click", () => {
        periodoMobile = Number(btn.dataset.periodo);
        render();
      });
    });
    elementoRaiz.querySelectorAll(".link-disciplina-mobile").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.periodo) periodoMobile = Number(btn.dataset.periodo);
        codigoSelecionado = btn.dataset.codigo;
        render();
        const alvo = elementoRaiz.querySelector(".fluxo-mobile .info-selecionada-mobile");
        if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
    const btnFecharInfo = elementoRaiz.querySelector(".btn-fechar-info-mobile");
    if (btnFecharInfo) {
      btnFecharInfo.addEventListener("click", () => {
        codigoSelecionado = null;
        render();
      });
    }
  }

  return { init, render };
})();
