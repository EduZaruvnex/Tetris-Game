// TETRIS SIMPLES - p5.js

const COLUNAS = 10;
const LINHAS = 20;
const TAM = 30;

let grade = [];
let peca;
let tempo = 0;
let intervalo = 500;
let pontos = 0;
let fimDeJogo = false;
let jogoIniciado = false;

const pecas = [
  {
    cor: "cyan",
    blocos: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 }
    ]
  },
  {
    cor: "yellow",
    blocos: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  },
  {
    cor: "orange",
    blocos: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  },
  {
    cor: "purple",
    blocos: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  }
];

function setup() {
  createCanvas(COLUNAS * TAM, LINHAS * TAM + 50);
  textFont("Arial");

  iniciarGrade();
  novaPeca();
}

function draw() {
  background(30);

  if (!jogoIniciado) {
    desenhaTelaInstrucoes();
    return;
  }

  desenhaGrade();
  desenhaPeca();
  desenhaTexto();

  if (fimDeJogo) {
    fill("red");
    textSize(32);
    textAlign(CENTER);
    text("FIM DE JOGO", width / 2, height / 2);
    return;
  }

  tempo += deltaTime;

  if (tempo > intervalo) {
    tempo = 0;
    moverPeca(0, 1);
  }
}

function iniciarGrade() {
  for (let y = 0; y < LINHAS; y++) {
    grade[y] = [];
    for (let x = 0; x < COLUNAS; x++) {
      grade[y][x] = null;
    }
  }
}

function desenhaTelaInstrucoes() {
  background(18, 18, 28);

  fill("cyan");
  textSize(42);
  textAlign(CENTER);
  text("TETRIS", width / 2, 95);

  fill("white");
  textSize(18);
  text("Instruções", width / 2, 145);

  textSize(15);
  textAlign(LEFT);
  text("Objetivo:", 35, 205);
  text("Complete linhas horizontais para ganhar pontos.", 35, 230);

  text("Controles:", 35, 285);
  text("←  Move a peça para a esquerda", 35, 310);
  text("→  Move a peça para a direita", 35, 335);
  text("↓  Acelera a queda da peça", 35, 360);

  text("Pontuação:", 35, 415);
  text("Cada linha completa vale 100 pontos.", 35, 440);

  textAlign(CENTER);
  fill("yellow");
  textSize(16);
  text("Pressione ENTER ou ESPAÇO para começar", width / 2, 535);
}

function novaPeca() {
  let modelo = random(pecas);

  peca = {
    x: 3,
    y: 0,
    cor: modelo.cor,
    blocos: modelo.blocos
  };

  if (colidiu(0, 0)) {
    fimDeJogo = true;
  }
}

function desenhaGrade() {
  stroke(80);

  for (let y = 0; y < LINHAS; y++) {
    for (let x = 0; x < COLUNAS; x++) {
      if (grade[y][x] !== null) {
        fill(grade[y][x]);
      } else {
        fill(20);
      }

      rect(x * TAM, y * TAM, TAM, TAM);
    }
  }
}

function desenhaPeca() {
  fill(peca.cor);
  stroke(255);

  for (let bloco of peca.blocos) {
    let x = (peca.x + bloco.x) * TAM;
    let y = (peca.y + bloco.y) * TAM;
    rect(x, y, TAM, TAM);
  }
}

function desenhaTexto() {
  fill("white");
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text("Pontos: " + pontos, 10, LINHAS * TAM + 30);
}

function moverPeca(dx, dy) {
  if (!colidiu(dx, dy)) {
    peca.x += dx;
    peca.y += dy;
  } else if (dy === 1) {
    fixarPeca();
    limparLinhas();
    novaPeca();
  }
}

function colidiu(dx, dy) {
  for (let bloco of peca.blocos) {
    let novoX = peca.x + bloco.x + dx;
    let novoY = peca.y + bloco.y + dy;

    if (novoX < 0 || novoX >= COLUNAS || novoY >= LINHAS) {
      return true;
    }

    if (novoY >= 0 && grade[novoY][novoX] !== null) {
      return true;
    }
  }

  return false;
}

function fixarPeca() {
  for (let bloco of peca.blocos) {
    let x = peca.x + bloco.x;
    let y = peca.y + bloco.y;

    if (y >= 0) {
      grade[y][x] = peca.cor;
    }
  }
}

function limparLinhas() {
  for (let y = LINHAS - 1; y >= 0; y--) {
    let cheia = true;

    for (let x = 0; x < COLUNAS; x++) {
      if (grade[y][x] === null) {
        cheia = false;
      }
    }

    if (cheia) {
      grade.splice(y, 1);

      let novaLinha = [];
      for (let x = 0; x < COLUNAS; x++) {
        novaLinha[x] = null;
      }

      grade.unshift(novaLinha);
      pontos += 100;
      y++;
    }
  }
}

function keyPressed() {
  if (!jogoIniciado) {
    if (keyCode === ENTER || key === " ") {
      jogoIniciado = true;
      tempo = 0;
    }

    return;
  }

  if (fimDeJogo) {
    return;
  }

  if (keyCode === LEFT_ARROW) {
    moverPeca(-1, 0);
  }

  if (keyCode === RIGHT_ARROW) {
    moverPeca(1, 0);
  }

  if (keyCode === DOWN_ARROW) {
    moverPeca(0, 1);
  }
}
