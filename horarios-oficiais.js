/**
 * horarios-oficiais.js
 * Horários oficiais das turmas ofertadas para o curso de Engenharia de Materiais,
 * extraídos do relatório "Relatório de Turmas Ofertadas ao Curso" (Ano-Período: 2026.1).
 * Gerado a partir da planilha 'Horario - 2025-1.xlsx' (aba Plan1).
 *
 * Cada disciplina pode ter mais de uma turma (mais de um horário) — comum quando a disciplina
 * atende tanto quem está no fluxo normal quanto quem ficou em dependência e precisa de um
 * horário sem choque com o período atual.
 */

const HORARIOS_PERIODO_LETIVO = "2026.1";

const HORARIOS_OFICIAIS = {
  "A1": [
    { turma: 9, vagas: 65, docentes: "JOAO BOSCO BATISTA LACERDA", horarioBruto: "24T45", slots: [{ dia: "Segunda", inicio: "16:00", fim: "18:00" }, { dia: "Quarta", inicio: "16:00", fim: "18:00" }] },
    { turma: 5, vagas: 75, docentes: "DANIEL MARINHO PELLEGRINO", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "A2": [
    { turma: 4, vagas: 67, docentes: "NAPOLEON CARO TUESTA", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "A3": [
    { turma: 4, vagas: 61, docentes: "PEDRO ANTONIO HINOJOSA VERA", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
    { turma: 5, vagas: 60, docentes: "EDSON DE FIGUEIREDO LIMA JUNIOR", horarioBruto: "24T45", slots: [{ dia: "Segunda", inicio: "16:00", fim: "18:00" }, { dia: "Quarta", inicio: "16:00", fim: "18:00" }] },
  ],
  "A4": [
    { turma: 1, vagas: 60, docentes: "EUFRASIO DE ANDRADE LIMA NETO e MARCELO RODRIGO PORTELA FERREIRA", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
    { turma: 9, vagas: 60, docentes: "RENILMA PEREIRA DA SILVA", horarioBruto: "35N12", slots: [{ dia: "Terça", inicio: "19:00", fim: "20:40" }, { dia: "Quinta", inicio: "19:00", fim: "20:40" }] },
  ],
  "A5": [
    { turma: 1, vagas: 20, docentes: "DANNIEL FERREIRA DE OLIVEIRA", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "A6": [
    { turma: 1, vagas: 20, docentes: "MARCIO JOSE BATISTA CARDOSO", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "A7": [
    { turma: 1, vagas: 20, docentes: "CLAUDIO ALVES DE SIQUEIRA FILHO", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "A8": [
    { turma: 4, vagas: 60, docentes: "PAULO AGUIAR DO MONTE", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "A9": [
    { turma: 5, vagas: 30, docentes: "SANDRA LEANDRO PEREIRA", horarioBruto: "3M456", slots: [{ dia: "Terça", inicio: "10:00", fim: "13:00" }] },
    { turma: 3, vagas: 50, docentes: "NADJA VALERIA PINHEIRO", horarioBruto: "4T456", slots: [{ dia: "Quarta", inicio: "16:00", fim: "19:00" }] },
  ],
  "B1": [
    { turma: 5, vagas: 78, docentes: "SERGIO DE ALBUQUERQUE SOUZA", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
    { turma: 9, vagas: 65, docentes: "GILMAR OTAVIO CORREIA", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "B2": [
    { turma: 9, vagas: 85, docentes: "FLAVIA JERONIMO BARBOSA", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
    { turma: 10, vagas: 70, docentes: "CLETO BRASILEIRO MIRANDA NETO", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "B3": [
    { turma: 5, vagas: 80, docentes: "MILTON DE LACERDA OLIVEIRA", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
    { turma: 3, vagas: 65, docentes: "ALLAN GEORGE DE CARVALHO FREITAS", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  ],
  "B4": [
    { turma: 1, vagas: 20, docentes: "DANNIEL FERREIRA DE OLIVEIRA", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "B5": [
    { turma: 1, vagas: 20, docentes: "IEVERTON CAIANDRE ANDRADE BRITO", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "B6": [
    { turma: 1, vagas: 20, docentes: "RAMON ALVES TORQUATO", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "B7": [
    { turma: 1, vagas: 20, docentes: "RAMON ALVES TORQUATO", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  ],
  "B8": [
    { turma: 1, vagas: 20, docentes: "LUCINEIDE BALBINO DA SILVA", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "C1": [
    { turma: 4, vagas: 60, docentes: "MARIA GARDENNIA DA FONSECA", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
    { turma: 3, vagas: 60, docentes: "GIANNA DE SOUZA SORRENTINO", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
    { turma: 1, vagas: 40, docentes: "EDVAN CIRINO DA SILVA", horarioBruto: "24N34", slots: [{ dia: "Segunda", inicio: "20:50", fim: "22:30" }, { dia: "Quarta", inicio: "20:50", fim: "22:30" }] },
    { turma: 2, vagas: 50, docentes: "IEDA MARIA GARCIA DOS SANTOS", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "C2": [
    { turma: 3, vagas: 60, docentes: "JANSEN BRASILEIRO FORMIGA", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "C3": [
    { turma: 2, vagas: 60, docentes: "FABIO LEAL DE MELO DAHIA", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
    { turma: 6, vagas: 60, docentes: "PAULO SERGIO RODRIGUES DA SILVA", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "C4": [
    { turma: 4, vagas: 60, docentes: "HERONDY FRANCISCO SANTANA MOTA", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
    { turma: 3, vagas: 60, docentes: "INACIO DE ALMEIDA PEDROSA FILHO", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "C5": [
    { turma: 1, vagas: 20, docentes: "FABIANA DE CARVALHO FIM", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  ],
  "C6": [
    { turma: 1, vagas: 20, docentes: "DANIELLE GUEDES DE LIMA CAVALCANTE", horarioBruto: "24T45", slots: [{ dia: "Segunda", inicio: "16:00", fim: "18:00" }, { dia: "Quarta", inicio: "16:00", fim: "18:00" }] },
  ],
  "C7": [
    { turma: 1, vagas: 20, docentes: "MARCIO JOSE BATISTA CARDOSO", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "C8": [
    { turma: 1, vagas: 20, docentes: "IEVERTON CAIANDRE ANDRADE BRITO", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "C9": [
    { turma: 1, vagas: 20, docentes: "SUEILA SILVA ARAUJO", horarioBruto: "6M2345 (27/04/2026 - 12/08/2026)", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00", obs: "27/04/2026 - 12/08/2026" }] },
  ],
  "D1": [
    { turma: 3, vagas: 50, docentes: "JOSE DE QUEIROZ CALUETE", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "D2": [
    { turma: 4, vagas: 20, docentes: "COSME RAFAEL MARTINEZ SALINAS", horarioBruto: "4T2345", slots: [{ dia: "Quarta", inicio: "14:00", fim: "18:00" }] },
    { turma: 1, vagas: 20, docentes: "AFRANIO GABRIEL DA SILVA", horarioBruto: "6M2345", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00" }] },
  ],
  "D3": [
    { turma: 3, vagas: 15, docentes: "MARCIO MEDEIROS SOARES", horarioBruto: "2T45", slots: [{ dia: "Segunda", inicio: "16:00", fim: "18:00" }] },
  ],
  "D4": [
    { turma: 1, vagas: 20, docentes: "AMELIA SEVERINO FERREIRA E SANTOS", horarioBruto: "6M2345", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00" }] },
  ],
  "D6": [
    { turma: 1, vagas: 20, docentes: "HEBER SIVINI FERREIRA", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "D7": [
    { turma: 1, vagas: 20, docentes: "MARIA ROSEANE DE PONTES FERNANDES", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "D8": [
    { turma: 1, vagas: 20, docentes: "", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "D9": [
    { turma: 1, vagas: 20, docentes: "CLAUDIO ALVES DE SIQUEIRA FILHO", horarioBruto: "35M23 (27/04/2026 - 13/08/2026)", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00", obs: "27/04/2026 - 13/08/2026" }, { dia: "Quinta", inicio: "08:00", fim: "10:00", obs: "27/04/2026 - 13/08/2026" }] },
  ],
  "E1": [
    { turma: 7, vagas: 70, docentes: "ALVARO FRANCISCO DE CASTRO MEDEIROS", horarioBruto: "5T45 5N12", slots: [{ dia: "Quinta", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "19:00", fim: "20:40" }] },
    { turma: 4, vagas: 70, docentes: "CARLOS ALBERTO NUNES MACHADO", horarioBruto: "36T6 6N12", slots: [{ dia: "Terça", inicio: "18:00", fim: "19:00" }, { dia: "Sexta", inicio: "18:00", fim: "19:00" }, { dia: "Sexta", inicio: "19:00", fim: "20:40" }] },
  ],
  "E2": [
    { turma: 1, vagas: 40, docentes: "SAVIO MOITA PINHEIRO", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "E3": [
    { turma: 1, vagas: 20, docentes: "SHEILA ALVES BEZERRA DA COSTA REGO", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "E4": [
    { turma: 1, vagas: 20, docentes: "LISZANDRA FERNANDA ARAUJO CAMPOS", horarioBruto: "24T45", slots: [{ dia: "Segunda", inicio: "16:00", fim: "18:00" }, { dia: "Quarta", inicio: "16:00", fim: "18:00" }] },
  ],
  "E5": [
    { turma: 1, vagas: 20, docentes: "HEBER SIVINI FERREIRA", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "E6": [
    { turma: 1, vagas: 20, docentes: "ITAMARA FARIAS LEITE", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "E7": [
    { turma: 1, vagas: 20, docentes: "RICARDO PEIXOTO SUASSUNA DUTRA", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "E8": [
    { turma: 1, vagas: 20, docentes: "LISZANDRA FERNANDA ARAUJO CAMPOS", horarioBruto: "3T2345", slots: [{ dia: "Terça", inicio: "14:00", fim: "18:00" }] },
  ],
  "E9": [
    { turma: 1, vagas: 20, docentes: "CARINA GABRIELA DE MELO E MELO", horarioBruto: "2M2345 (27/04/2026 - 12/08/2026)", slots: [{ dia: "Segunda", inicio: "08:00", fim: "12:00", obs: "27/04/2026 - 12/08/2026" }] },
  ],
  "F1": [
    { turma: 1, vagas: 45, docentes: "TIBERIO ANDRADE DOS PASSOS", horarioBruto: "2T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }] },
  ],
  "F2": [
    { turma: 1, vagas: 35, docentes: "FABIANA DE CARVALHO FIM", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "F3": [
    { turma: 1, vagas: 20, docentes: "ELITON SOUTO DE MEDEIROS", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "F4": [
    { turma: 1, vagas: 20, docentes: "ELITON SOUTO DE MEDEIROS", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "F5": [
    { turma: 1, vagas: 20, docentes: "LUCINEIDE BALBINO DA SILVA", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "F6": [
    { turma: 1, vagas: 20, docentes: "SUEILA SILVA ARAUJO", horarioBruto: "35T45", slots: [{ dia: "Terça", inicio: "16:00", fim: "18:00" }, { dia: "Quinta", inicio: "16:00", fim: "18:00" }] },
  ],
  "F7": [
    { turma: 1, vagas: 20, docentes: "ITAMARA FARIAS LEITE", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "F8": [
    { turma: 1, vagas: 20, docentes: "DANIEL ARAUJO DE MACEDO", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  ],
  "F9": [
    { turma: 1, vagas: 20, docentes: "ANTONIO FARIAS LEAL", horarioBruto: "3T2345 (27/04/2026 - 12/08/2026)", slots: [{ dia: "Terça", inicio: "14:00", fim: "18:00", obs: "27/04/2026 - 12/08/2026" }] },
  ],
  "G1": [
    { turma: 1, vagas: 45, docentes: "SHEILA ALVES BEZERRA DA COSTA REGO", horarioBruto: "4M2345", slots: [{ dia: "Quarta", inicio: "08:00", fim: "12:00" }] },
  ],
  "G2": [
    { turma: 1, vagas: 20, docentes: "MARIA ROSEANE DE PONTES FERNANDES", horarioBruto: "2T2345 (27/04/2026 - 13/08/2026)", slots: [{ dia: "Segunda", inicio: "14:00", fim: "18:00", obs: "27/04/2026 - 13/08/2026" }] },
  ],
  "G3": [
    { turma: 1, vagas: 20, docentes: "TIBERIO ANDRADE DOS PASSOS", horarioBruto: "6M2345", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00" }] },
  ],
  "G4": [
    { turma: 1, vagas: 20, docentes: "DANIELLE GUEDES DE LIMA CAVALCANTE", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "G5": [
    { turma: 1, vagas: 20, docentes: "AMELIA SEVERINO FERREIRA E SANTOS", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
  "H5": [
    { turma: 1, vagas: 30, docentes: "ELIANE DA CONCEIÇÃO SILVA", horarioBruto: "5N1234", slots: [{ dia: "Quinta", inicio: "19:00", fim: "22:30" }] },
  ],
  // ---- Optativas (grupos A/B/C do fluxograma, conforme lista da coordenação) ----
  "OPT1": [
    { turma: 1, vagas: 20, docentes: "", codigoSigaa: "1708025", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT2": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "1708043", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT3": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "DENM00080", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT4": [
    { turma: 1, vagas: 20, docentes: "RENATE MARIA RAMOS WELLEN", codigoSigaa: "DENM00065", horarioBruto: "2T456 2N1", slots: [{ dia: "Segunda", inicio: "16:00", fim: "19:00" }, { dia: "Segunda", inicio: "19:00", fim: "19:50" }] },
  ],
  "OPT5": [
    { turma: 1, vagas: 20, docentes: "RENATE MARIA RAMOS WELLEN", codigoSigaa: "1708031", horarioBruto: "3T6 3N123", slots: [{ dia: "Terça", inicio: "18:00", fim: "19:00" }, { dia: "Terça", inicio: "19:00", fim: "21:40" }] },
  ],
  "OPT6": [
    { turma: 1, vagas: 20, docentes: "CARINA GABRIELA DE MELO E MELO", codigoSigaa: "1708023", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "OPT7": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "1708050", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  ],
  "OPT8": [
    { turma: 1, vagas: 20, docentes: "", codigoSigaa: "DENM00074", horarioBruto: "35T23", slots: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }, { dia: "Quinta", inicio: "14:00", fim: "16:00" }] },
  ],
  "OPT9": [
    { turma: 1, vagas: 20, docentes: "DANIEL ARAUJO DE MACEDO", codigoSigaa: "1708056", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT10": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "1708046", horarioBruto: "24T23", slots: [{ dia: "Segunda", inicio: "14:00", fim: "16:00" }, { dia: "Quarta", inicio: "14:00", fim: "16:00" }] },
  ],
  "OPT11": [
    { turma: 1, vagas: 20, docentes: "", codigoSigaa: "DENM00073", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT12": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "DEP005116", horarioBruto: "6M2345", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00" }] },
  ],
  "OPT13": [
    { turma: 1, vagas: 35, docentes: "Lígia Lobo Mesquita", codigoSigaa: "1705178", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT14": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "1403747", horarioBruto: "6M2345", slots: [{ dia: "Sexta", inicio: "08:00", fim: "12:00" }] },
  ],
  "OPT15": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "GDFIS0109", horarioBruto: "35M45", slots: [{ dia: "Terça", inicio: "10:00", fim: "12:00" }, { dia: "Quinta", inicio: "10:00", fim: "12:00" }] },
  ],
  "OPT16": [
    { turma: 1, vagas: null, docentes: "", codigoSigaa: "DENM00079", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  ],
};

// Quais disciplinas optativas (OPTATIVAS em data.js) formam cada grupo "Optativa A/B/C" do
// fluxograma. G7=Optativa A, G8=Optativa B, H9=Optativa C — o aluno escolhe uma de cada grupo.
const GRUPOS_OPTATIVAS = {
  A: [{ codigo: "OPT6", nome: "Materiais Cimentícios" }, { codigo: "OPT9", nome: "Seleção de Materiais" }, { codigo: "OPT7", nome: "Siderurgia" }, { codigo: "OPT11", nome: "Metalurgia do Pó" }, { codigo: "OPT3", nome: "Usinagem de Metais" }, { codigo: "OPT1", nome: "Mecânica dos Materiais III" }],
  B: [{ codigo: "OPT5", nome: "Modelagem de Materiais" }, { codigo: "OPT8", nome: "Nanotecnologia de Polímeros" }, { codigo: "OPT10", nome: "Tecnologia dos Vidros" }, { codigo: "OPT4", nome: "Blendas Poliméricas" }, { codigo: "OPT2", nome: "Cerâmicas Refratárias" }, { codigo: "OPT16", nome: "Técnicas Espectroscópicas para Polímeros" }],
  C: [{ codigo: "OPT14", nome: "Libras" }, { codigo: "OPT12", nome: "Segurança do Trabalho" }, { codigo: "OPT13", nome: "Gestão da Qualidade" }, { codigo: "OPT15", nome: "Laboratório de Instrumentação Científica II" }],
};

// Mapeia o código do "slot" genérico no fluxograma para o grupo de optativas correspondente.
const CODIGO_PARA_GRUPO_OPTATIVA = { G7: "A", G8: "B", H9: "C" };


// Disciplinas/optativas ofertadas neste período que não constam no fluxograma oficial
// (grade pode ter sido atualizada, ou são eletivas adicionais do departamento).
const OUTRAS_OFERTAS = [
  { codigoSigaa: "1105167", nome: "Química Orgânica I", turma: 1, vagas: 40, docentes: "PETRONIO FILGUEIRAS DE ATHAYDE FILHO", depto: "CCEN - DEPARTAMENTO DE QUÍMICA", horarioBruto: "24N34", slots: [{ dia: "Segunda", inicio: "20:50", fim: "22:30" }, { dia: "Quarta", inicio: "20:50", fim: "22:30" }] },
  { codigoSigaa: "1401161", nome: "Sociologia Do Trabalho", turma: 3, vagas: 40, docentes: "MARCOS AYALA", depto: "CCHLA - DEPARTAMENTO DE CIÊNCIAS SOCIAIS", horarioBruto: "6T2345", slots: [{ dia: "Sexta", inicio: "14:00", fim: "18:00" }] },
  { codigoSigaa: "1404138", nome: "Lingua Inglesa I", turma: 2, vagas: 80, docentes: "CYBELLE SAFFA DA CUNHA PEREIRA SOARES e EDMILSON DE ALBUQUERQUE BORBOREMA FILHO", depto: "CCHLA - DEPARTAMENTO DE LETRAS ESTRANGEIRAS E MODERNAS", horarioBruto: "7M1 35N34", slots: [{ dia: "Sábado", inicio: "07:00", fim: "08:00" }, { dia: "Terça", inicio: "20:50", fim: "22:30" }, { dia: "Quinta", inicio: "20:50", fim: "22:30" }] },
  { codigoSigaa: "GDLPL0063", nome: "Português Instrumental", turma: 5, vagas: 100, docentes: "MARIA DE FATIMA ALMEIDA", depto: "CCHLA - DEPARTAMENTO DE LÍNGUA PORTUGUESA E LINGUÍSTICA", horarioBruto: "6M1234", slots: [{ dia: "Sexta", inicio: "07:00", fim: "11:00" }] },
  { codigoSigaa: "1204115", nome: "Administração De Empresas", turma: 3, vagas: 20, docentes: "CESAR EMANOEL BARBOSA DE LIMA", depto: "CCSA - DEPARTAMENTO DE ADMINISTRACAO", horarioBruto: "24M45 6M1", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }, { dia: "Sexta", inicio: "07:00", fim: "08:00" }] },
  { codigoSigaa: "1708028", nome: "Cristalografia", turma: 1, vagas: 20, docentes: "SHEILA ALVES BEZERRA DA COSTA REGO", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  { codigoSigaa: "1708029", nome: "Materiais da Indústria do Petróleo", turma: 1, vagas: 20, docentes: "", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", horarioBruto: "35M23", slots: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }, { dia: "Quinta", inicio: "08:00", fim: "10:00" }] },
  { codigoSigaa: "1708049", nome: "Processamento De Materiais Metalicos", turma: 1, vagas: 20, docentes: "MARIA ROSEANE DE PONTES FERNANDES", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  { codigoSigaa: "1708035", nome: "Processamento De Materiais Poliméricos", turma: 1, vagas: 20, docentes: "SUEILA SILVA ARAUJO", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", horarioBruto: "24M23", slots: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }, { dia: "Quarta", inicio: "08:00", fim: "10:00" }] },
  { codigoSigaa: "1708034", nome: "União De Materiais", turma: 1, vagas: 20, docentes: "GUDSON NICOLAU DE MELO", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE MATERIAIS", horarioBruto: "24M45", slots: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }, { dia: "Quarta", inicio: "10:00", fim: "12:00" }] },
  { codigoSigaa: "1705181", nome: "Ecologia Industrial E Desenvolvimento Sustentável", turma: 1, vagas: 30, docentes: "RICARDO MOREIRA DA SILVA", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO", horarioBruto: "4N12 6N23", slots: [{ dia: "Quarta", inicio: "19:00", fim: "20:40" }, { dia: "Sexta", inicio: "19:50", fim: "21:40" }] },
  { codigoSigaa: "1705141", nome: "Gestão De Materiais", turma: 1, vagas: 30, docentes: "IVAN BOLIS", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO", horarioBruto: "2N34", slots: [{ dia: "Segunda", inicio: "20:50", fim: "22:30" }] },
  { codigoSigaa: "1705130", nome: "Planejamento E Projeto Do Produto", turma: 1, vagas: 35, docentes: "RENATA DE OLIVEIRA MOTA", depto: "CT - DEPARTAMENTO DE ENGENHARIA DE PRODUÇÃO", horarioBruto: "5N234", slots: [{ dia: "Quinta", inicio: "19:50", fim: "22:30" }] },
];
