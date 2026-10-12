/**
 * data.js
 * Dados do fluxograma do curso de Engenharia de Materiais - UFPB (Centro de Tecnologia, Campus I)
 * Fonte: Fluxograma_novo-_corrigido.pdf
 *
 * Cada disciplina tem um "codigo" único (Letra da linha + número do período), ex: "A1", "B4".
 * Esse código é o mesmo usado na coluna "Pré-requisito" do fluxograma original,
 * o que permite montar o grafo de pré-requisitos automaticamente.
 *
 * depto: "materiais" (Departamento de Eng. de Materiais) ou "outros" (outros departamentos/básicas)
 * departamento: nome oficial do departamento responsável (conforme SIGAA/relatório de turmas).
 *   Para disciplinas não ofertadas no período letivo mais recente, o departamento foi inferido
 *   pela área da disciplina.
 */

const TOTAIS_POR_PERIODO = {
  1: { creditos: 26, ch: 390 },
  2: { creditos: 28, ch: 420 },
  3: { creditos: 28, ch: 420 },
  4: { creditos: 28, ch: 420 },
  5: { creditos: 28, ch: 420 },
  6: { creditos: 28, ch: 420 },
  7: { creditos: 28, ch: 420 },
  8: { creditos: 28, ch: 420 },
  9: { creditos: 29, ch: 435 },
  10: { creditos: 19, ch: 285 },
};

// Metadados de exibição por departamento (nome curto + classe de cor no CSS).
const DEPARTAMENTOS_INFO = {
  "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS": { curto: "Engenharia de Materiais", cor: "materiais" },
  "CCEN - DEPARTAMENTO DE MATEMÁTICA": { curto: "Matemática", cor: "matematica" },
  "CCEN - DEPARTAMENTO DE FÍSICA": { curto: "Física", cor: "fisica" },
  "CCEN - DEPARTAMENTO DE QUÍMICA": { curto: "Química", cor: "quimica" },
  "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO": { curto: "Engenharia de Produção", cor: "producao" },
  "CCEN - DEPARTAMENTO DE ESTATÍSTICA": { curto: "Estatística", cor: "estatistica" },
  "CCSA - DEPARTAMENTO DE ECONOMIA": { curto: "Economia", cor: "economia" },
  "CCSA - DEPARTAMENTO DE ADMINISTRACAO": { curto: "Administração", cor: "administracao" },
  "CI - DEPARTAMENTO DE INFORMÁTICA": { curto: "Informática", cor: "informatica" },
  "CCHLA - DEPARTAMENTO DE CIÊNCIAS SOCIAIS": { curto: "Ciências Sociais", cor: "sociais" },
  "CCHLA - DEPARTAMENTO DE LÍNGUA PORTUGUESA E LINGUÍSTICA": { curto: "Língua Portuguesa e Linguística", cor: "letras" },
  "CCHLA - DEPARTAMENTO DE LETRAS ESTRANGEIRAS E MODERNAS": { curto: "Letras Estrangeiras", cor: "letras" },
};

const DISCIPLINAS = [
  // ---- Linha A ----
  { codigo: "A1", nome: "Cálculo Diferencial e Integral I", periodo: 1, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: [] },
  { codigo: "A2", nome: "Cálculo Diferencial e Integral II", periodo: 2, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: ["A1", "B1"] },
  { codigo: "A3", nome: "Cálculo Diferencial e Integral III", periodo: 3, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: ["A2"] },
  { codigo: "A4", nome: "Cálculo das Probabilidades e Estatística I", periodo: 4, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE ESTATÍSTICA", prereq: ["A1"] },
  { codigo: "A5", nome: "Fenômenos de Transporte", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B4"] },
  { codigo: "A6", nome: "Termodinâmica", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A5"] },
  { codigo: "A7", nome: "Transformações de Fases", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A6"] },
  { codigo: "A8", nome: "Introdução à Economia", periodo: 8, creditos: 4, depto: "outros", departamento: "CCSA - DEPARTAMENTO DE ECONOMIA", prereq: [] },
  { codigo: "A9", nome: "Administração para Engenharia", periodo: 9, creditos: 3, depto: "outros", departamento: "CCSA - DEPARTAMENTO DE ADMINISTRACAO", prereq: [] },
  { codigo: "A10", nome: "Estágio Supervisionado em Engenharia de Materiais", periodo: 10, creditos: 19, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  // ---- Linha B ----
  { codigo: "B1", nome: "Cálculo Vetorial e Geometria Analítica", periodo: 1, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: [] },
  { codigo: "B2", nome: "Introdução à Álgebra Linear", periodo: 2, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: ["B1"] },
  { codigo: "B3", nome: "Séries e Equações Diferenciais Ordinárias", periodo: 3, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE MATEMÁTICA", prereq: ["A2", "B2"] },
  { codigo: "B4", nome: "Mecânica dos Materiais I", periodo: 4, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A3", "B3", "C3"] },
  { codigo: "B5", nome: "Mecânica dos Materiais II", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B4"] },
  { codigo: "B6", nome: "Propriedades Físicas dos Materiais", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "B7", nome: "Materiais e Dispositivos Eletroeletrônicos", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "B8", nome: "Materiais Compósitos", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "B9", nome: "Trabalho de Conclusão de Curso", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  // ---- Linha C ----
  { codigo: "C1", nome: "Química Básica – Estrutura", periodo: 1, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE QUÍMICA", prereq: [] },
  { codigo: "C2", nome: "Física Geral I", periodo: 2, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE FÍSICA", prereq: [] },
  { codigo: "C3", nome: "Física Geral II", periodo: 3, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE FÍSICA", prereq: ["C2"] },
  { codigo: "C4", nome: "Física Geral III", periodo: 4, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE FÍSICA", prereq: ["C3"] },
  { codigo: "C5", nome: "Propriedades Mecânicas dos Materiais", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "C6", nome: "Tratamentos Térmicos", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "C7", nome: "Biomateriais", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "C8", nome: "Conformação Plástica dos Metais", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6", "F5"] },
  { codigo: "C9", nome: "UCE em Engenharia IV", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  // ---- Linha D ----
  { codigo: "D1", nome: "Química Básica – Transformações", periodo: 1, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE QUÍMICA", prereq: [] },
  { codigo: "D2", nome: "Química Básica Experimental", periodo: 2, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE QUÍMICA", prereq: [] },
  { codigo: "D3", nome: "Física Experimental I", periodo: 3, creditos: 2, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE FÍSICA", prereq: ["C2"] },
  { codigo: "D4", nome: "Meio Ambiente e Reciclagem dos Materiais", periodo: 4, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F2"] },
  { codigo: "D5", nome: "Física Experimental II", periodo: 5, creditos: 2, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE FÍSICA", prereq: ["C4"] },
  { codigo: "D6", nome: "Caracterização Mecânica dos Materiais", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["C5"] },
  { codigo: "D7", nome: "Fundição de Metais", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "D8", nome: "Soldagem de Metais", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "D9", nome: "UCE em Engenharia V", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  // ---- Linha E ----
  { codigo: "E1", nome: "Introdução à Programação", periodo: 1, creditos: 4, depto: "outros", departamento: "CI - DEPARTAMENTO DE INFORMÁTICA", prereq: [] },
  { codigo: "E2", nome: "Química Orgânica Teórica A", periodo: 2, creditos: 4, depto: "outros", departamento: "CCEN - DEPARTAMENTO DE QUÍMICA", prereq: ["C1"] },
  { codigo: "E3", nome: "Geologia e Mineralogia", periodo: 3, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F2"] },
  { codigo: "E4", nome: "Materiais Cerâmicos", periodo: 4, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E3", "F2"] },
  { codigo: "E5", nome: "Caracterização Microestrutural dos Materiais", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "E6", nome: "Corrosão e Degradação dos Materiais", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "E7", nome: "Processamento de Materiais Cerâmicos", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F5"] },
  { codigo: "E8", nome: "Produtos Cerâmicos Industriais", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E7"] },
  { codigo: "E9", nome: "UCE em Engenharia VI", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  // ---- Linha F ----
  { codigo: "F1", nome: "Introdução à Engenharia de Materiais", periodo: 1, creditos: 2, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "F2", nome: "Introdução à Ciência dos Materiais", periodo: 2, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["C1"] },
  { codigo: "F3", nome: "Materiais Poliméricos I", periodo: 3, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E2", "F2"] },
  { codigo: "F4", nome: "Materiais Poliméricos II", periodo: 4, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F3"] },
  { codigo: "F5", nome: "Reologia dos Materiais", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  { codigo: "F6", nome: "Processamento de Elastômeros e Termofixos", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F5"] },
  { codigo: "F7", nome: "Processamento de Termoplásticos", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F5"] },
  { codigo: "F8", nome: "Cerâmicas Avançadas", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "F9", nome: "UCE em Engenharia VII", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  // ---- Linha G ----
  { codigo: "G1", nome: "Metodologia do Trabalho Científico", periodo: 1, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G2", nome: "UCE em Engenharia I", periodo: 2, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G3", nome: "Desenho Técnico para Engenharia de Materiais", periodo: 3, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G4", nome: "Materiais Metálicos", periodo: 4, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F2"] },
  { codigo: "G5", nome: "Pesquisa Aplicada à Engenharia dos Materiais", periodo: 5, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A2", "A4"] },
  { codigo: "G6", nome: "UCE em Engenharia III", periodo: 6, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G7", nome: "Optativa A", periodo: 7, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G8", nome: "Optativa B", periodo: 8, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "G9", nome: "UCE em Engenharia VIII", periodo: 9, creditos: 2, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4", "F4", "G4"] },
  // ---- Linha H ----
  { codigo: "H3", nome: "UCE em Engenharia II", periodo: 3, creditos: 2, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
  { codigo: "H5", nome: "Relações Étnico-Raciais e Direitos Humanos no Brasil", periodo: 5, creditos: 2, depto: "outros", departamento: "CCHLA - DEPARTAMENTO DE CIÊNCIAS SOCIAIS", prereq: [] },
  { codigo: "H9", nome: "Optativa C", periodo: 9, creditos: 4, depto: "materiais", departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: [] },
];

// Componentes complementares optativos (não têm período fixo no fluxograma - o aluno escolhe quando cursar)
const OPTATIVAS = [
  { codigo: "OPT1", nome: "Mecânica dos Materiais III", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B5"] },
  { codigo: "OPT2", nome: "Cerâmicas Refratárias", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4"] },
  { codigo: "OPT3", nome: "Usinagem de Metais", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "OPT4", nome: "Blendas Poliméricas", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F4"] },
  { codigo: "OPT5", nome: "Modelagem de Materiais", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["A5", "B5"] },
  { codigo: "OPT6", nome: "Materiais Cimentícios", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4"] },
  { codigo: "OPT7", nome: "Siderurgia", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "OPT8", nome: "Nanotecnologia de Polímeros", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F4"] },
  { codigo: "OPT9", nome: "Seleção de Materiais", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["C5", "B6"] },
  { codigo: "OPT10", nome: "Tecnologia dos Vidros", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["E4"] },
  { codigo: "OPT11", nome: "Metalurgia do Pó", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B6"] },
  { codigo: "OPT12", nome: "Segurança do Trabalho", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO", prereq: [] },
  { codigo: "OPT13", nome: "Gestão da Qualidade", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO", prereq: ["E4", "F4", "G4"] },
  { codigo: "OPT14", nome: "Libras", creditos: 4, departamento: "CCHLA - DEPARTAMENTO DE LÍNGUA PORTUGUESA E LINGUÍSTICA", prereq: [] },
  { codigo: "OPT15", nome: "Laboratório de Instrumentação Científica II", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["B7", "D5"] },
  { codigo: "OPT16", nome: "Técnicas Espectroscópicas para Polímeros", creditos: 4, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", prereq: ["F4"] },
];

// Conteúdos Complementares Flexíveis (item 2.3 da estrutura curricular): 12 créditos / 180h,
// sem período fixo no fluxograma — o aluno pode cursar quando quiser, geralmente nos últimos
// períodos. Créditos batem exatamente com o exigido pela estrutura curricular oficial do curso.
const CONTEUDOS_FLEXIVEIS = [
  { codigo: "FLEX1", nome: "Tópicos Especiais em Engenharia de Materiais I", creditos: 2, ch: 30, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS" },
  { codigo: "FLEX2", nome: "Tópicos Especiais em Engenharia de Materiais II", creditos: 2, ch: 30, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS" },
  { codigo: "FLEX3", nome: "Tópicos Especiais em Engenharia de Materiais III", creditos: 4, ch: 60, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS" },
  { codigo: "FLEX4", nome: "Tópicos Especiais em Engenharia de Materiais IV", creditos: 4, ch: 60, departamento: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS" },
];

const RESUMO_CURSO = {
  conteudosObrigatorios: { ch: 2475, creditos: 165 },
  estagioSupervisionado: { ch: 285, creditos: 19 },
  uceEngenharia: { ch: 390, creditos: 26 },
  complementaresObrigatorios: { ch: 720, creditos: 48 },
  complementaresOptativos: { ch: 180, creditos: 12 },
  complementaresFlexiveis: { ch: 180, creditos: 12 },
  total: { ch: 4230, creditos: 282 },
};

const CURSO_INFO = {
  instituicao: "Universidade Federal da Paraíba",
  centro: "Centro de Tecnologia - Campus I",
  curso: "Curso de Graduação em Engenharia de Materiais",
};
