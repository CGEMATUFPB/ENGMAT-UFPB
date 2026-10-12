/**
 * app.js
 * Ponto de entrada: inicializa as três abas e alterna entre elas.
 *
 * Controle de acesso: por padrão só a aba Fluxograma fica disponível (estudante).
 * Uma senha única de docente (compartilhada, não é conta individual) libera as abas
 * Horários e Ofertadas DEMAT nesse navegador. Não é uma senha "forte" nem uma conta —
 * é só uma trava simples pra afastar acesso casual; veja o README pra trocar a senha.
 */

// Hash simples (cyrb53) só pra não deixar a senha literal no código-fonte. Não é
// criptografia forte — qualquer um com acesso ao arquivo pode tentar quebrar por força
// bruta. Suficiente pro nível de proteção que essa página precisa.
function hashSenha(txt) {
  let h1 = 0xdeadbeef ^ 0,
    h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// Hash da senha padrão "demat2026". Pra trocar: calcule o novo hash chamando
// hashSenha("sua-nova-senha") no console do navegador e cole o resultado abaixo.
const SENHA_DOCENTE_HASH = "161467ec453e2";

document.addEventListener("DOMContentLoaded", () => {
  const abas = document.querySelectorAll(".aba-botao");
  const paineis = {
    fluxograma: document.getElementById("painel-fluxograma"),
    horarios: document.getElementById("painel-horarios"),
    ofertadas: document.getElementById("painel-ofertadas"),
  };

  // Versão celular: barra de dias nas matrizes semanais (ver mobile.js)
  if (typeof MatrizMobile !== "undefined") MatrizMobile.init();

  Fluxograma.init(paineis.fluxograma);
  Horarios.init(paineis.horarios);
  OfertadasDemat.init(paineis.ofertadas);

  function irPara(aba) {
    abas.forEach((b) => b.classList.remove("ativo"));
    document.querySelector(`.aba-botao[data-aba="${aba}"]`).classList.add("ativo");
    Object.values(paineis).forEach((p) => p.classList.remove("painel-ativo"));
    paineis[aba].classList.add("painel-ativo");
  }

  abas.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (document.body.classList.contains("modo-estudante") && btn.dataset.aba !== "fluxograma") {
        return; // aba bloqueada pro papel de estudante
      }
      irPara(btn.dataset.aba);
    });
  });

  document.addEventListener("progresso:atualizado", () => {
    // no futuro: sincronizar progresso com um backend aqui
  });

  const btnLimpar = document.getElementById("btn-limpar-dados");
  btnLimpar.addEventListener("click", () => {
    if (confirm("Isso vai apagar seu progresso e horários salvos neste navegador. Continuar?")) {
      Estado.limparTudo();
      location.reload();
    }
  });

  // --- Controle de acesso: estudante (só Fluxograma) x docente (tudo) ---
  const btnModoDocente = document.getElementById("btn-modo-docente");
  const popover = document.getElementById("popover-senha-docente");
  const formSenha = document.getElementById("form-senha-docente");
  const inputSenha = document.getElementById("input-senha-docente");
  const erroSenha = document.getElementById("erro-senha-docente");
  const btnCancelarSenha = document.getElementById("btn-cancelar-senha-docente");

  function aplicarEstadoAcesso(desbloqueado) {
    document.body.classList.toggle("modo-estudante", !desbloqueado);
    btnModoDocente.textContent = desbloqueado ? "🔒 Sair do modo docente" : "🔓 Sou docente";
    if (!desbloqueado) {
      const abaAtual = document.querySelector(".aba-botao.ativo");
      if (abaAtual && abaAtual.dataset.aba !== "fluxograma") {
        irPara("fluxograma");
      }
    }
  }

  let desbloqueado = Estado.carregarDocenteDesbloqueado();
  aplicarEstadoAcesso(desbloqueado);

  btnModoDocente.addEventListener("click", () => {
    if (desbloqueado) {
      desbloqueado = false;
      Estado.definirDocenteDesbloqueado(false);
      aplicarEstadoAcesso(false);
      popover.hidden = true;
      return;
    }
    popover.hidden = !popover.hidden;
    erroSenha.hidden = true;
    if (!popover.hidden) inputSenha.focus();
  });

  btnCancelarSenha.addEventListener("click", () => {
    popover.hidden = true;
    formSenha.reset();
    erroSenha.hidden = true;
  });

  formSenha.addEventListener("submit", (e) => {
    e.preventDefault();
    if (hashSenha(inputSenha.value) === SENHA_DOCENTE_HASH) {
      desbloqueado = true;
      Estado.definirDocenteDesbloqueado(true);
      aplicarEstadoAcesso(true);
      popover.hidden = true;
      formSenha.reset();
      erroSenha.hidden = true;
    } else {
      erroSenha.hidden = false;
      inputSenha.value = "";
      inputSenha.focus();
    }
  });
});
