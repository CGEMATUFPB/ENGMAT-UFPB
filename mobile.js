/**
 * mobile.js
 * Ajustes da versão para celular que valem para TODAS as matrizes semanais do site
 * (aba Horários > Matriz, aba Ofertadas DEMAT e painel "Meu horário deste período").
 *
 * No celular, uma grade de 6 dias não cabe na tela. Em vez de mexer na geração de cada
 * matriz, este módulo observa a página e, sempre que uma `.tabela-matriz` aparece, marca
 * cada célula com o dia da semana (data-dia) e insere acima dela uma barra de dias
 * (Seg, Ter, Qua...). O CSS (media query de até 720px) mostra só a coluna do dia escolhido.
 * No computador a barra fica escondida e a grade aparece inteira, como sempre.
 *
 * As células usam rowspan (aulas de 2h, trechos "Livre" mesclados), então a coluna de
 * cada célula é calculada levando em conta as linhas já ocupadas por rowspan de cima.
 */

const MatrizMobile = (() => {
  const CURTOS = { Segunda: "Seg", Terça: "Ter", Quarta: "Qua", Quinta: "Qui", Sexta: "Sex", Sábado: "Sáb" };
  let diaAtivo = diaPadrao();

  // Hoje, se for dia útil/sábado; domingo cai pra segunda.
  function diaPadrao() {
    const nomes = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const hoje = nomes[new Date().getDay()];
    return hoje === "Domingo" ? "Segunda" : hoje;
  }

  // Marca data-dia em cada célula, respeitando rowspan/colspan.
  function marcarSecao(linhas, dias) {
    const ocupado = [];
    linhas.forEach((tr, r) => {
      let c = 0;
      [...tr.children].forEach((celula) => {
        while (ocupado[r] && ocupado[r][c]) c++;
        const rs = celula.rowSpan || 1;
        const cs = celula.colSpan || 1;
        for (let i = 0; i < rs; i++) {
          if (!ocupado[r + i]) ocupado[r + i] = [];
          for (let j = 0; j < cs; j++) ocupado[r + i][c + j] = true;
        }
        if (c > 0 && dias[c - 1]) celula.dataset.dia = dias[c - 1];
        c += cs;
      });
    });
  }

  function preparar(tabela) {
    tabela.dataset.mobilePronto = "1";
    const cabecalho = tabela.querySelectorAll("thead tr:first-child th");
    const dias = [...cabecalho].slice(1).map((th) => th.textContent.trim());
    if (!dias.length) return;

    marcarSecao([...tabela.querySelectorAll("thead tr")], dias);
    marcarSecao([...tabela.querySelectorAll("tbody tr")], dias);

    const diaInicial = dias.includes(diaAtivo) ? diaAtivo : dias[0];
    tabela.classList.add("matriz-por-dia");
    tabela.dataset.diaAtivo = diaInicial;

    const barra = document.createElement("div");
    barra.className = "dias-mobile";
    barra.setAttribute("role", "tablist");
    barra.innerHTML = dias
      .map((dia) => {
        const qtd = tabela.querySelectorAll(
          'td[data-dia="' + dia + '"].td-aula, td[data-dia="' + dia + '"].td-conflito'
        ).length;
        const temConflito = tabela.querySelector('td[data-dia="' + dia + '"].td-conflito');
        return (
          '<button type="button" role="tab" class="btn-dia-mobile' +
          (dia === diaInicial ? " ativo" : "") +
          '" data-dia="' + dia + '" aria-selected="' + (dia === diaInicial) + '">' +
          '<span class="dia-nome">' + (CURTOS[dia] || dia) + "</span>" +
          '<span class="dia-qtd' + (temConflito ? " dia-qtd-conflito" : "") + '">' +
          (qtd ? qtd : "–") +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    barra.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".btn-dia-mobile");
      if (!btn) return;
      diaAtivo = btn.dataset.dia; // lembra o dia escolhido pras próximas matrizes renderizadas
      tabela.dataset.diaAtivo = diaAtivo;
      barra.querySelectorAll(".btn-dia-mobile").forEach((b) => {
        const ativo = b === btn;
        b.classList.toggle("ativo", ativo);
        b.setAttribute("aria-selected", String(ativo));
      });
    });

    const ancora = tabela.closest(".tabela-scroll") || tabela;
    ancora.parentNode.insertBefore(barra, ancora);
  }

  function varrer() {
    document.querySelectorAll(".tabela-matriz:not([data-mobile-pronto])").forEach(preparar);
  }

  function init() {
    varrer();
    const alvo = document.querySelector("main") || document.body;
    new MutationObserver(varrer).observe(alvo, { childList: true, subtree: true });
  }

  return { init };
})();
