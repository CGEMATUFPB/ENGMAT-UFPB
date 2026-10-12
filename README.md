# Fluxograma — Engenharia de Materiais (UFPB)

Site para acompanhar o fluxograma do curso e os horários das disciplinas de cada período. Por padrão
só a aba **Fluxograma** fica disponível; uma senha única de docente libera as abas Horários e Ofertadas
DEMAT.

## Como abrir

Dá duplo clique em `index.html` — funciona direto no navegador, sem instalar nada.

Se preferir rodar via servidor local (opcional, útil para testar em outro dispositivo na mesma rede):

```
cd site-fluxograma
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Versão para celular

O mesmo site se adapta sozinho quando aberto no celular (telas de até 720px) — não precisa de outro
endereço nem de instalar nada. No computador tudo continua igual.

- **Fluxograma**: em vez da grade de 10 colunas, aparece um seletor de períodos (1° a 10°) e os cartões
  do período escolhido empilhados, com caixinhas grandes de "concluída" e "cursando". Abre direto no
  primeiro período que ainda não foi concluído. Tocar numa disciplina abre um painel com os
  **pré-requisitos** e o que ela **libera** — tocar num item leva ao período dele. No modo "🧭 O que
  posso cursar agora?", cada período mostra quantas disciplinas estão liberadas.
- **Matrizes semanais** (Horários > Matriz, Ofertadas DEMAT e "Meu horário deste período"): mostram um
  dia por vez, com botões Seg/Ter/Qua/… no topo. Cada botão indica quantas aulas há no dia (em laranja
  quando há conflito). Abre no dia de hoje.
- **Cartões editáveis**: campos maiores, com fonte de 16px (o iPhone não dá zoom ao tocar), abas fixas
  no topo e seletores de período roláveis na horizontal.
- **PDFs** gerados pelo celular saem no mesmo formato do computador (grade completa).
- Dica: no navegador do celular, use "Adicionar à tela inicial" pra abrir o site como um app.

Toda a lógica das matrizes por dia fica em `mobile.js`; o restante está no fim de `style.css` (bloco
"VERSÃO CELULAR") e em `render.js` (seção "Versão celular do fluxograma").

## Acesso de docente

Ao abrir o site, qualquer pessoa vê e usa normalmente a aba **Fluxograma**. As abas **Horários** e
**Ofertadas DEMAT** ficam escondidas até alguém clicar em **"🔓 Sou docente"** (canto superior direito)
e digitar a senha. Acertando, essas duas abas aparecem e ficam liberadas nesse navegador até clicar em
**"🔒 Sair do modo docente"** ou em "Limpar dados salvos".

**Isso não é um sistema de contas** — é uma senha só, compartilhada entre os docentes, guardada de forma
ofuscada (não em texto puro) no código do site. Serve pra afastar acesso casual de estudante, não pra
proteger informação sensível; qualquer pessoa com acesso ao arquivo `js/app.js` e alguma paciência
consegue tentar quebrar a senha por força bruta. Se isso for um problema, o site já teve uma versão com
login individual via Firebase (contas de verdade) — é só pedir pra reativar esse modelo.

A senha padrão é `demat2026`. Pra trocar:

1. Abra o site em qualquer navegador, aperte F12 pra abrir o console e digite:
   `hashSenha("sua-nova-senha")` (troque pelo texto que quiser) e aperte Enter.
2. Copie o valor que aparecer (algo como `"a1b2c3..."`).
3. Abra `js/app.js`, ache a linha `const SENHA_DOCENTE_HASH = "..."` e troque o valor entre aspas pelo
   que você copiou. Salve o arquivo.

## O que tem

- **Aba Fluxograma**: todas as disciplinas dos 10 períodos, organizadas como no fluxograma oficial.
  - Clique na caixinha de cada disciplina para marcar como concluída (fica salvo no navegador).
  - Clique no cartão da disciplina para destacar em azul os pré-requisitos dela e em laranja quem depende dela.
  - Barra de progresso mostra % de créditos concluídos, créditos e disciplinas (ex.: "42% concluído —
    120/282 créditos — 30/71 disciplinas"). Os totais batem com a estrutura curricular oficial do curso
    (282 créditos, 4230h): créditos obrigatórios + estágio + as 8 UCEs + as 3 optativas do fluxograma
    (G7/G8/H9) + os 4 Conteúdos Complementares Flexíveis — sem contar as 16 optativas concretas do
    catálogo inteiro, que são só o "menu" de opções pra preencher os 3 slots de optativa (não créditos
    extras).
  - Seção **"Conteúdos Complementares Flexíveis"**, logo abaixo do fluxograma: 4 itens (Tópicos
    Especiais em Engenharia de Materiais I a IV, 12 créditos no total) que a estrutura curricular exige
    mas não têm período fixo no fluxograma oficial. Marque como concluído igual às disciplinas normais —
    conta na barra de progresso.
  - Botão **"🧭 O que posso cursar agora?"** mostra o "caminho" a partir do seu progresso: destaca com
    borda dourada e um selo "pode cursar" toda disciplina cujos pré-requisitos você já concluiu (e que
    ainda não cursou), e esmaece o resto do fluxograma — as que ainda dependem de outra disciplina.
    Uma barrinha no topo mostra quantas disciplinas estão liberadas nesse momento. Clique de novo pra
    sair do modo e voltar ao fluxograma normal.
  - No cabeçalho de cada período tem um botão **"✓ marcar tudo"** que marca de uma vez todas as
    disciplinas daquele período como concluídas — útil pra quem já passou por vários períodos e não
    quer clicar disciplina por disciplina. Quando o período já está 100% concluído, o botão vira **"↺
    desmarcar tudo"** (clicar de novo desfaz).
  - Botão **"⬇ Baixar fluxograma em PDF"** salva uma imagem do fluxograma como está na tela — barra de
    progresso (%, créditos, disciplinas), legenda de cores e a grade completa com o status de cada
    disciplina.
  - Uma segunda caixinha, "cursando", marca as disciplinas que você está fazendo neste período —
    independente de "concluída". Assim que a disciplina é marcada como **concluída**, a caixinha
    "cursando" fica bloqueada (cinza, não clicável) e é desmarcada automaticamente, já que não faz
    sentido uma disciplina já validada continuar contando como "em andamento" no seu horário do
    período; desmarcando "concluída" ela volta a ficar disponível pra marcar como cursando de novo.
    Marcar uma ou mais disciplinas libera o botão **"📅 Ver meu horário
    deste período"**, que abre um painel com a grade semanal só dessas disciplinas (usa o horário que
    você já tiver editado na aba Horários, ou o oficial se não tiver mexido em nada). Quando duas
    disciplinas cursando caem no mesmo dia/horário, a célula fica laranja com as duas destacadas (choque
    real); se forem só turmas diferentes da mesma disciplina, aparecem separadas sem alarde. Se a
    disciplina tem mais de uma turma cadastrada (ex.: uma pra quem está no fluxo normal e outra pra quem
    ficou em dependência), aparece um seletor ao lado do nome dela na lista pra você escolher qual turma
    é a sua — só o horário da turma escolhida entra na grade e no PDF (por padrão vem selecionada a
    primeira turma cadastrada, até você trocar). Se uma disciplina cursando não tiver horário oficial
    cadastrado (comum em disciplinas de outros departamentos, fora da oferta do DEMAT — ex.: Física
    Experimental II), ela some da grade e o painel mostra um aviso explicando isso, com a orientação de
    preencher o horário manualmente na aba Horários. De lá dá pra clicar em **"⬇ Baixar PDF do
    horário"** e salvar essa grade como arquivo separado.
- **Aba Horários**, com duas formas de visualizar:
  - **Lista**: escolha um período e veja as disciplinas agrupadas por departamento responsável
    (Engenharia de Materiais, Matemática, Física, Química, Estatística, etc.), já pré-preenchidas com
    a oferta oficial do período letivo 2026.1 (turma, dia, horário e professor). Quando uma disciplina
    tem mais de uma turma cadastrada, são opções diferentes de horário — comum quando ela atende tanto
    quem está no fluxo normal quanto quem ficou em dependência e precisa de um horário sem choque com o
    período atual. Nesse caso o cartão separa os horários em blocos "Turma 1", "Turma 2" etc., em vez
    de misturar tudo numa lista só. Tudo é editável: dá pra apagar a turma que não te interessa, ajustar
    sala, adicionar um horário novo, ou clicar em "restaurar oficial" para desfazer suas edições numa
    disciplina.
  - **Matriz**: grade semanal (dias x horários) com as disciplinas que têm horário salvo, coloridas
    por departamento. Tem seletor de período — "Todos" (padrão, útil pra ver a grade completa e
    detectar choques entre disciplinas de períodos diferentes) ou um período específico (1° a 10°).
    Horários livres aparecem marcados como "Livre". Filtros de departamento permitem esconder/mostrar
    disciplinas por área. Quando duas turmas da MESMA disciplina caem no mesmo horário (ex.: Turma 1 e
    Turma 2 de uma matéria com dependência), a célula mostra as duas separadas dentro do próprio card,
    com a cor normal do departamento — não é tratado como choque. Já quando são disciplinas DIFERENTES
    no mesmo horário, aí sim é um conflito real e a célula fica laranja com as duas empilhadas.
  - No topo do período 1 (modo Lista) tem uma seção recolhível com outras disciplinas ofertadas este
    período que não estão no fluxograma oficial.
  - Cada edição já salva sozinha (aparece um "salvo ✓" no card), mas tem também um botão **"💾 Salvar
    horário"** fixo na barra de cima (Lista e Matriz) — clique nele quando quiser uma confirmação clara
    de que tudo que está na tela foi gravado neste navegador.
  - Nos slots de optativa do fluxograma (**Optativa A** no 7° período, **Optativa B** no 8° e
    **Optativa C** no 9°), o cartão mostra as disciplinas concretas de cada grupo (com horário
    oficial) e um botão "usar esta opção" — clique pra aplicar o horário daquela disciplina ao
    slot. O cartão passa a mostrar qual optativa você escolheu.
- **Aba Ofertadas DEMAT**: matriz semanal pra apoiar o planejamento da oferta do próprio departamento.
  Tem dois modos:
  - **Oficial**: sempre o horário fixo de `horarios-oficiais.js` — é igual pra qualquer pessoa que
    abrir o site, é a "fonte da verdade". Mostra as disciplinas obrigatórias do DEMAT (não as básicas
    de outros departamentos) mais as 16 optativas, com turma e professor em cada célula. Quando duas
    turmas da MESMA disciplina caem no mesmo horário (ex.: Turma 1 e Turma 2), a célula mostra as duas
    separadas dentro do próprio card, com a cor normal — não é tratado como choque. Só quando são
    disciplinas DIFERENTES no mesmo horário a célula fica laranja com as duas empilhadas — útil pra
    achar horário livre e evitar choque real antes de abrir uma turma nova. Tem seletor de período:
    "Todos" junta a grade inteira, ou filtra só as obrigatórias de um período específico (as optativas
    aparecem sempre, já que não têm período fixo).
  - **Minha proposta**: um rascunho separado, guardado só neste navegador, pra testar reorganizações
    de horário sem afetar o horário oficial nem o horário pessoal de nenhum aluno. Tem três visões:
    - **Lista**: cartões editáveis por período (obrigatórias do DEMAT) e das optativas ativas — dá pra
      ajustar dia, horário, turma e professor de cada uma, adicionar/remover horários, ou restaurar o
      valor oficial de uma disciplina específica. Quando a disciplina tem mais de uma turma cadastrada,
      o cartão separa os horários em blocos "Turma 1", "Turma 2" etc. Linhas fora da janela 16h–19h (nos
      períodos 7º, 8º,
      9º e nas optativas) ficam marcadas em laranja. Cada card de optativa tem um botão **"✕ remover da
      lista"**: nas 16 optativas padrão isso é reversível (mesmo efeito de desmarcar em "⚙ Optativas" —
      dá pra marcar de novo depois); numa optativa criada por você, remover apaga ela de vez (pede
      confirmação antes, já que não tem como desfazer). Cards de obrigatórias não têm esse botão — não
      dá pra remover disciplina obrigatória do currículo. No fim da tela tem um bloco recolhível **"Todas
      as disciplinas ofertadas no Xº período"**, somente leitura, com o horário oficial de toda
      disciplina do currículo (qualquer departamento) ofertada naquele período — útil pra checar
      conflito com outras matérias (Cálculo, Física etc.) antes de mover uma turma do DEMAT.
    - **Matriz**: mesma grade da aba Oficial, mas refletindo a proposta (e as optativas ativas). Cada
      célula de optativa tem um "✕" no canto — clicar nele remove aquela optativa da visualização na
      hora (mesmo efeito do botão "remover da lista"), sem precisar trocar de aba. Na Matriz Oficial
      esse botão não aparece, já que lá não tem o que remover.
    - **⚙ Optativas**: só aparecem no site (Lista e Matriz da proposta) as optativas marcadas aqui.
      Por padrão as 16 optativas cadastradas em `data.js` vêm todas marcadas — desmarcar uma esconde
      ela da visualização sem apagar o horário salvo (dá pra marcar de novo depois). Também dá pra
      criar optativas novas, que ainda não existem no cadastro padrão: só preencher nome e créditos e
      clicar em "+ criar optativa" — elas entram automaticamente na Lista e na Matriz da proposta,
      com horário em branco pra você preencher. Essa configuração é independente do horário oficial da
      aba Oficial, que sempre mostra as 16 optativas originais.
    - **Gerar sugestão automática**: botão que tenta mover o máximo possível das disciplinas do 7º,
      8º e 9º período (mais as optativas ativas) pra dentro da janela 16h–19h, liberando a manhã pro
      aluno estagiar. O modelo de choque é por período: as obrigatórias de um período só evitam conflito
      com as do mesmo período (um aluno no fluxo normal cursa só um período final por vez, então 7º e
      8º podem, por exemplo, ocupar o mesmo horário sem problema real). Já as optativas evitam os três
      períodos finais e também umas às outras, pois qualquer uma pode ser escolhida em qualquer um
      deles. O botão mostra um resumo de quantas turmas foram movidas e quantas não couberam sem gerar
      choque (essas continuam no horário original — dá pra ajustar manualmente na Lista). Na prática, a
      janela de 3h (16h–19h) em dias úteis costuma ter menos capacidade do que a demanda total dos três
      períodos finais mais as optativas, então nem tudo cabe — o gerador prioriza o que consegue encaixar
      sem choque e deixa claro o que sobrou.
    - **Descartar toda a proposta**: apaga o rascunho salvo (horários) e recarrega o horário oficial. A
      configuração de optativas ativas/customizadas fica guardada à parte e não é afetada por esse botão.
- **Limpar dados salvos**: apaga progresso e horários salvos neste navegador (volta a carregar a oferta oficial na próxima visita).

## Estrutura do projeto

```
site-fluxograma/
├── index.html                # estrutura da página e abas
├── css/style.css             # todo o estilo visual
└── js/
    ├── data.js                # dados do curso (disciplinas, créditos, pré-requisitos, departamento)
    ├── horarios-oficiais.js  # oferta oficial de turmas/horários do período letivo atual
    ├── state.js               # camada de persistência (localStorage) + helpers de domínio
    ├── render.js               # lógica da aba Fluxograma (+ painel "meu horário" e PDF)
    ├── horarios.js             # lógica da aba Horários (Lista + Matriz)
    ├── ofertadas.js             # lógica da aba Ofertadas DEMAT (matriz oficial + proposta editável do departamento)
    ├── mobile.js               # versão celular: matrizes semanais exibidas um dia por vez
    └── app.js                  # navegação entre abas
```

Cada parte fica isolada de propósito: `state.js` guarda tudo que é pessoal/local (progresso, horário,
proposta) — dá pra trocar isso no futuro (por exemplo, sincronizar em nuvem) sem precisar mexer no
resto das telas.

## Sobre os dados

As disciplinas, créditos e pré-requisitos foram extraídos do fluxograma oficial em PDF. Os totais de
créditos por período nas colunas do fluxograma batem exatamente com os totais impressos no documento
original. O total geral do curso (barra de progresso) vem de `RESUMO_CURSO.total.creditos` em
`js/data.js` (282 créditos / 4230h, conforme a estrutura curricular oficial) — se a coordenação atualizar
esses números algum dia, é só editar esse objeto. Os "Conteúdos Complementares Flexíveis" (Tópicos
Especiais I a IV) ficam em `CONTEUDOS_FLEXIVEIS`, separados de `DISCIPLINAS` porque não têm período fixo
no fluxograma. Cada disciplina também tem um `departamento` (nome oficial, conforme SIGAA) usado para
agrupar a Lista e colorir a Matriz — para disciplinas não ofertadas no período letivo mais recente, o
departamento foi inferido pela área da disciplina. Se notar algo desatualizado (grades mudam de tempos
em tempos), é só editar o arquivo `js/data.js` — a estrutura de cada disciplina é:

```js
{ codigo: "B4", nome: "Mecânica dos Materiais I", periodo: 4, creditos: 4, depto: "materiais",
  departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A3", "B3", "C3"] }
```

Os horários oficiais vêm de `js/horarios-oficiais.js`, atualizado com base no relatório de solicitações
atendidas do CT-DEMAT pro período letivo 2026.1 (turma, horário no formato SIGAA — ex.: `35M23` = terça
e quinta, manhã, dos horários 2 e 3 — e vagas de cada disciplina efetivamente ofertada). Esse arquivo é
só o "valor padrão" — depois que o aluno edita algo na tela, a versão salva no navegador manda. Quando a
coordenação divulgar a oferta de um novo período, é só colar a lista atualizada (ou editar os valores
manualmente) para atualizar os padrões. Disciplinas que não constam na oferta 2026.1 do currículo atual
(ex.: Cristalografia, Materiais da Indústria do Petróleo — do currículo antigo) ficam listadas em
`OUTRAS_OFERTAS`, mostradas na seção recolhível do 1° período da aba Horários, sem entrar no fluxograma
oficial nem nos totais de crédito.

As aulas diurnas (manhã e tarde) duram 1h cada, corridas, sem intervalo (07:00–13:00 e 13:00–19:00). As
aulas noturnas duram 50min, com intervalo entre a 2ª e a 3ª (19:00–22:30). Essa tabela de horários fica
em `FAIXAS`, no topo de `js/horarios.js`, e é usada tanto pra desenhar as linhas da Matriz quanto pra
converter os códigos SIGAA em horário de relógio ao gerar `horarios-oficiais.js`.

As opções concretas de **Optativa A/B/C** (16 disciplinas ao todo, divididas em 3 grupos conforme a
lista da coordenação) também ficam em `js/horarios-oficiais.js`, nas estruturas `GRUPOS_OPTATIVAS`
(disciplinas de cada grupo) e `CODIGO_PARA_GRUPO_OPTATIVA` (liga o slot do fluxograma ao grupo certo).

## Próximos passos possíveis

- Trocar a senha única de docente por contas individuais (login de verdade via Firebase), se precisar
  identificar quem é cada professor ou aumentar a segurança do acesso.
- Alertar visualmente quando a Matriz detectar um conflito real de horário.
- Script para regenerar `horarios-oficiais.js` automaticamente a cada nova planilha de horários.
