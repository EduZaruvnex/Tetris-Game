// ============================================================
//  pecas.js  —  Os 7 tetrominos classicos
//
//  VETOR (array): cada peca e descrita por um array de blocos,
//  e todas as pecas ficam juntas no array FORMAS. Na hora de
//  jogar, sorteamos uma posicao desse vetor com random(FORMAS).
//
//  Cada bloco e uma coordenada relativa { x, y } a partir do
//  canto superior esquerdo da peca.
// ============================================================

const FORMAS = [
  {
    nome: "I",
    cor: "#00d4ff",
    blocos: [ { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 } ]
  },
  {
    nome: "O",
    cor: "#ffd500",
    blocos: [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 } ]
  },
  {
    nome: "T",
    cor: "#a000f0",
    blocos: [ { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 } ]
  },
  {
    nome: "L",
    cor: "#ff8c00",
    blocos: [ { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 } ]
  },
  {
    nome: "J",
    cor: "#0050ff",
    blocos: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 } ]
  },
  {
    nome: "S",
    cor: "#00d000",
    blocos: [ { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 } ]
  },
  {
    nome: "Z",
    cor: "#ff2040",
    blocos: [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 } ]
  }
];
