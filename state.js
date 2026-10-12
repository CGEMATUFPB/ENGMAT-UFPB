/**
 * state.js
 * Camada de persistência local (localStorage) para:
 *  - progresso do aluno (disciplinas concluídas)
 *  - horários de cada disciplina por período
 *
 * Isolado em um módulo próprio de propósito: se um dia isso evoluir para ter
 * login e backend (ex: salvar no servidor em vez de localStorage), só este
 * arquivo precisa mudar — o resto do app conversa apenas com as funções abaixo.
 */

const CHAVE_PROGRESSO = "fluxograma:concluidas";
const CHAVE_CURSANDO = "fluxograma:cursando";
const CHAVE_HORARIOS = "fluxograma:horarios";
const CHAVE_ESCOLHAS_OPTATIVAS = "fluxograma:escolhas-optativas";
const CHAVE_PROPOSTA_DEMAT = "fluxograma:proposta-demat";
const CHAVE_OPTATIVAS_CONFIG_DEMAT = "fluxograma:optativas-config-demat";
const CHAVE_DOCENTE_DESBLOQUEADO = "fluxograma:docente-desbloqueado";
const CHAVE_TURMA_PREFERIDA = "fluxograma:turma-preferida-cursando";

const Estado = {
  // ---------- Progresso (disciplinas concluídas) ----------
  carregarConcluidas() {
    try {
      const raw = localStorage.getItem(CHAVE_PROGRESSO);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      console.warn("Falha ao carregar progresso salvo:", e);
      return new Set();
    }
  },

  salvarConcluidas(setConcluidas) {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify([...setConcluidas]));
  },

  alternarConcluida(codigo) {
    const concluidas = this.carregarConcluidas();
    if (concluidas.has(codigo)) {
      concluidas.delete(codigo);
    } else {
      concluidas.add(codigo);
    }
    this.salvarConcluidas(concluidas);
    return concluidas;
  },

  // ---------- Cursando este período (independente de "concluída") ----------
  // Marcação separada: uma disciplina pode estar "em andamento" sem estar concluída, e sai da
  // lista assim que o aluno marcar concluída (ou desmarcar manualmente). Usada pra montar o PDF
  // do horário do período (aba Fluxograma).
  carregarCursando() {
    try {
      const raw = localStorage.getItem(CHAVE_CURSANDO);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      console.warn("Falha ao carregar disciplinas em andamento:", e);
      return new Set();
    }
  },

  salvarCursando(setCursando) {
    localStorage.setItem(CHAVE_CURSANDO, JSON.stringify([...setCursando]));
  },

  alternarCursando(codigo) {
    const cursando = this.carregarCursando();
    if (cursando.has(codigo)) {
      cursando.delete(codigo);
    } else {
      cursando.add(codigo);
    }
    this.salvarCursando(cursando);
    return cursando;
  },

  // ---------- Horários por disciplina ----------
  // formato: { [codigo]: [ { dia, inicio, fim, sala, turma }, ... ] }
  carregarHorarios() {
    try {
      const raw = localStorage.getItem(CHAVE_HORARIOS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Falha ao carregar horários salvos:", e);
      return {};
    }
  },

  salvarHorarios(horarios) {
    localStorage.setItem(CHAVE_HORARIOS, JSON.stringify(horarios));
  },

  salvarHorarioDisciplina(codigo, entradas) {
    const horarios = this.carregarHorarios();
    horarios[codigo] = entradas;
    this.salvarHorarios(horarios);
    return horarios;
  },

  limparTudo() {
    localStorage.removeItem(CHAVE_PROGRESSO);
    localStorage.removeItem(CHAVE_CURSANDO);
    localStorage.removeItem(CHAVE_HORARIOS);
    localStorage.removeItem(CHAVE_ESCOLHAS_OPTATIVAS);
    localStorage.removeItem(CHAVE_PROPOSTA_DEMAT);
    localStorage.removeItem(CHAVE_OPTATIVAS_CONFIG_DEMAT);
    localStorage.removeItem(CHAVE_DOCENTE_DESBLOQUEADO);
    localStorage.removeItem(CHAVE_TURMA_PREFERIDA);
  },

  // ---------- Turma preferida por disciplina (quando há 2+ turmas cadastradas) ----------
  // Usado no painel "Meu horário deste período" (Fluxograma): se a disciplina cursando tem
  // mais de uma turma, o aluno escolhe qual delas representa o horário dele — sem isso a grade
  // mostraria as duas turmas como se o aluno cursasse ambas ao mesmo tempo.
  // formato: { [codigoDisciplina]: turmaEscolhida }
  carregarTurmasPreferidas() {
    try {
      const raw = localStorage.getItem(CHAVE_TURMA_PREFERIDA);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Falha ao carregar turmas preferidas:", e);
      return {};
    }
  },

  salvarTurmaPreferida(codigo, turma) {
    const salvas = this.carregarTurmasPreferidas();
    salvas[codigo] = turma;
    localStorage.setItem(CHAVE_TURMA_PREFERIDA, JSON.stringify(salvas));
  },

  // ---------- Acesso de docente (senha única, desbloqueia todas as abas neste navegador) ----------
  carregarDocenteDesbloqueado() {
    return localStorage.getItem(CHAVE_DOCENTE_DESBLOQUEADO) === "1";
  },

  definirDocenteDesbloqueado(valor) {
    if (valor) {
      localStorage.setItem(CHAVE_DOCENTE_DESBLOQUEADO, "1");
    } else {
      localStorage.removeItem(CHAVE_DOCENTE_DESBLOQUEADO);
    }
  },

  // ---------- Config de optativas exibidas na aba Ofertadas DEMAT (Minha proposta) ----------
  // Controla quais das optativas cadastradas aparecem no site e permite criar optativas novas,
  // sem depender da lista fixa de 16 em data.js.
  // formato: { selecionadas: [codigo, ...], customizadas: [{codigo, nome, creditos}, ...], proximoId: n }
  carregarConfigOptativasDemat() {
    try {
      const raw = localStorage.getItem(CHAVE_OPTATIVAS_CONFIG_DEMAT);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Falha ao carregar config de optativas do DEMAT:", e);
      return {};
    }
  },

  salvarConfigOptativasDemat(config) {
    localStorage.setItem(CHAVE_OPTATIVAS_CONFIG_DEMAT, JSON.stringify(config));
  },

  // ---------- Proposta de reorganização do DEMAT (aba Ofertadas DEMAT) ----------
  // Rascunho separado do horário oficial e do horário pessoal do aluno — pensado pra quem
  // planeja a oferta do departamento testar reorganizações sem afetar ninguém mais.
  // formato: { [codigo]: [ { dia, inicio, fim, sala, turma, professor, obs }, ... ] }
  carregarPropostaDemat() {
    try {
      const raw = localStorage.getItem(CHAVE_PROPOSTA_DEMAT);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Falha ao carregar proposta do DEMAT:", e);
      return {};
    }
  },

  salvarPropostaDemat(proposta) {
    localStorage.setItem(CHAVE_PROPOSTA_DEMAT, JSON.stringify(proposta));
  },

  salvarTurmaPropostaDemat(codigo, entradas) {
    const proposta = this.carregarPropostaDemat();
    proposta[codigo] = entradas;
    this.salvarPropostaDemat(proposta);
    return proposta;
  },

  limparPropostaDemat() {
    localStorage.removeItem(CHAVE_PROPOSTA_DEMAT);
  },

  // ---------- Escolha de optativa (qual opção concreta o aluno usou em cada slot G7/G8/H9) ----------
  // formato: { [codigoSlot]: codigoOpcaoEscolhida }
  // Guardado à parte do horário porque várias optativas podem ter exatamente o mesmo dia/horário
  // — só comparar dia/início/fim não é suficiente pra saber qual delas o aluno realmente escolheu.
  carregarEscolhasOptativas() {
    try {
      const raw = localStorage.getItem(CHAVE_ESCOLHAS_OPTATIVAS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Falha ao carregar escolhas de optativas:", e);
      return {};
    }
  },

  salvarEscolhaOptativa(codigoSlot, codigoOpcao) {
    const escolhas = this.carregarEscolhasOptativas();
    escolhas[codigoSlot] = codigoOpcao;
    localStorage.setItem(CHAVE_ESCOLHAS_OPTATIVAS, JSON.stringify(escolhas));
  },

  limparEscolhaOptativa(codigoSlot) {
    const escolhas = this.carregarEscolhasOptativas();
    if (!(codigoSlot in escolhas)) return;
    delete escolhas[codigoSlot];
    localStorage.setItem(CHAVE_ESCOLHAS_OPTATIVAS, JSON.stringify(escolhas));
  },
};

// ---------- Helpers de domínio sobre DISCIPLINAS (data.js) ----------

function buscarDisciplina(codigo) {
  const flexiveis = typeof CONTEUDOS_FLEXIVEIS !== "undefined" ? CONTEUDOS_FLEXIVEIS : [];
  return (
    DISCIPLINAS.find((d) => d.codigo === codigo) ||
    OPTATIVAS.find((d) => d.codigo === codigo) ||
    flexiveis.find((d) => d.codigo === codigo)
  );
}

function listarPorPeriodo(periodo) {
  return DISCIPLINAS.filter((d) => d.periodo === periodo).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

function listarDependentes(codigo) {
  // disciplinas que têm `codigo` como pré-requisito ou co-requisito
  return DISCIPLINAS.filter(
    (d) => (d.prereq && d.prereq.includes(codigo)) || (d.coRequisito && d.coRequisito.includes(codigo))
  );
}

function prereqsAtendidos(disciplina, concluidas) {
  if (!disciplina.prereq || disciplina.prereq.length === 0) return true;
  return disciplina.prereq.every((cod) => concluidas.has(cod));
}

// Itens que o aluno de fato marca como concluído no fluxograma: as disciplinas do grid
// (DISCIPLINAS, que já inclui os 3 slots de Optativa A/B/C) mais os Conteúdos Complementares
// Flexíveis. As 16 optativas concretas (OPTATIVAS) NÃO entram aqui — são só o "menu" de opções
// pra escolher o que preencher em cada slot de optativa, não créditos adicionais: contá-las à
// parte inflava o total (334cr em vez dos 282cr da estrutura curricular oficial).
function itensRastreaveisDoProgresso() {
  const flexiveis = typeof CONTEUDOS_FLEXIVEIS !== "undefined" ? CONTEUDOS_FLEXIVEIS : [];
  return [...DISCIPLINAS, ...flexiveis];
}

function calcularProgresso(concluidas) {
  const itens = itensRastreaveisDoProgresso();
  const totalCreditos =
    typeof RESUMO_CURSO !== "undefined" ? RESUMO_CURSO.total.creditos : itens.reduce((s, d) => s + d.creditos, 0);
  const concluidosNosItens = itens.filter((d) => concluidas.has(d.codigo));
  const creditosConcluidos = concluidosNosItens.reduce((s, d) => s + d.creditos, 0);
  return {
    disciplinasConcluidas: concluidosNosItens.length,
    totalDisciplinas: itens.length,
    creditosConcluidos,
    totalCreditos,
    percentual: totalCreditos > 0 ? Math.round((creditosConcluidos / totalCreditos) * 100) : 0,
  };
}
