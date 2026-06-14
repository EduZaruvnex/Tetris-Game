// ============================================================
//  fases.js  —  Configuracao de cada fase (nivel de dificuldade)
//
//  VETOR (array): FASES e um vetor onde o indice corresponde ao
//  nivel - 1. A cada fase a peca cai mais rapido (intervalo menor)
//  e o fundo muda de cor, sinalizando a progressao.
//
//  PONTOS_POR_LINHA tambem e um vetor: o indice e a quantidade de
//  linhas limpas de uma vez (1 a 4) e o valor e a pontuacao base.
// ============================================================

const FASES = [
  { intervalo: 700, corFundo: [ 26, 26,  46] }, // Nivel 1
  { intervalo: 560, corFundo: [ 30, 22,  54] }, // Nivel 2
  { intervalo: 440, corFundo: [ 40, 18,  52] }, // Nivel 3
  { intervalo: 340, corFundo: [ 48, 14,  44] }, // Nivel 4
  { intervalo: 250, corFundo: [ 54, 12,  34] }, // Nivel 5
  { intervalo: 180, corFundo: [ 60, 10,  26] }  // Nivel 6+
];

// Sobe de nivel a cada X linhas completadas.
const LINHAS_POR_FASE = 5;

// Pontos base por quantidade de linhas limpas de uma vez (multiplicado pelo nivel).
const PONTOS_POR_LINHA = [ 0, 100, 300, 500, 800 ];
