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

// Configura o canvas e inicializa a grade e a primeira peça.
function setup() {
  createCanvas(COLUNAS * TAM, LINHAS * TAM + 50);
  let canvas = document.querySelector('canvas');
  document.getElementById('canvas-container').appendChild(canvas);
  textFont("Arial");

  iniciarGrade();
  novaPeca();
}

// Atualiza a tela a cada frame e controla o estado do jogo.
function draw() {
  background(26, 26, 46);

  if (!jogoIniciado) {
    desenhaTelaInstrucoes();
    return;
  }

  desenhaGrade();
  desenhaPeca();
  desenhaTexto();

  if (fimDeJogo) {
    fill(255, 100, 100);
    textSize(36);
    textStyle(BOLD);
    textAlign(CENTER);
    text("FIM DE JOGO", width / 2, height / 2 - 30);
    
    fill(255);
    textSize(18);
    textStyle(NORMAL);
    text("Pontos: " + pontos, width / 2, height / 2 + 20);
    text("Pressione ENTER para reiniciar", width / 2, height / 2 + 50);
    return;
  }

  tempo += deltaTime;

  if (tempo > intervalo) {
    tempo = 0;
    moverPeca(0, 1);
  }
}

// Preenche a grade com células vazias.
function iniciarGrade() {
  for (let y = 0; y < LINHAS; y++) {
    grade[y] = [];
    for (let x = 0; x < COLUNAS; x++) {
      grade[y][x] = null;
    }
  }
}

// Mostra a tela inicial com objetivo e controles.
function desenhaTelaInstrucoes() {
  background(26, 26, 46);

  fill(0, 212, 255);
  textSize(48);
  textStyle(BOLD);
  textAlign(CENTER);
  text("TETRIS", width / 2, 60);

  fill(200, 200, 255);
  textSize(14);
  textStyle(NORMAL);
  text("Clássico Jogo de Blocos", width / 2, 90);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT);
  text("OBJETIVO:", 30, 150);
  
  fill(220, 220, 220);
  textSize(13);
  textStyle(NORMAL);
  text("Complete linhas horizontais para ganhar pontos", 50, 180);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("CONTROLES:", 30, 240);

  fill(220, 220, 220);
  textSize(13);
  textStyle(NORMAL);
  text("← →  Mover", 50, 270);
  text("↓    Descer", 50, 295);
  text("W ou ↑  Rotacionar", 50, 320);

  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("PONTUAÇÃO:", 30, 380);

  fill(220, 220, 220);
  textSize(13);
  textStyle(NORMAL);
  text("Cada linha = 100 pontos", 50, 410);

  fill(0, 255, 136);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER);
  text("Pressione ENTER ou ESPAÇO para começar", width / 2, height - 30);
}

// Sorteia e cria uma nova peça no topo do tabuleiro.
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

// Desenha o tabuleiro e os blocos já fixados.
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

// Desenha a peça atual na posição em que ela está caindo.
function desenhaPeca() {
  fill(peca.cor);
  stroke(255);

  for (let bloco of peca.blocos) {
    let x = (peca.x + bloco.x) * TAM;
    let y = (peca.y + bloco.y) * TAM;
    rect(x, y, TAM, TAM);
  }
}

// Exibe a pontuação e atualiza o placar na interface lateral.
function desenhaTexto() {
  fill("white");
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text("Pontos: " + pontos, 10, LINHAS * TAM + 30);
  
  // Atualizar score no sidebar
  let scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = 'Pontos: ' + pontos;
  }
}

// Move a peça se não houver colisão; fixa e gera outra quando ela encosta no chão.
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

// Rotaciona a peça 90 graus e desfaz a rotação se ela colidir.
function rotacionarPeca() {
  // Salvar blocos originais
  let blocosOriginais = peca.blocos;
  
  // Rotacionar 90 graus no sentido horário
  let novosBlocos = [];
  for (let bloco of blocosOriginais) {
    // Rotação: (x, y) -> (-y, x)
    let novoX = -bloco.y;
    let novoY = bloco.x;
    novosBlocos.push({ x: novoX, y: novoY });
  }
  
  // Normalizar posição (ajustar para o canto superior esquerdo)
  let minX = Math.min(...novosBlocos.map(b => b.x));
  let minY = Math.min(...novosBlocos.map(b => b.y));
  
  novosBlocos = novosBlocos.map(bloco => ({
    x: bloco.x - minX,
    y: bloco.y - minY
  }));
  
  // Testar colisão com os novos blocos
  peca.blocos = novosBlocos;
  if (colidiu(0, 0)) {
    peca.blocos = blocosOriginais;
  }
}

// Verifica se a peça vai sair do tabuleiro ou bater em blocos fixos.
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

// Grava a peça atual na grade como parte do cenário.
function fixarPeca() {
  for (let bloco of peca.blocos) {
    let x = peca.x + bloco.x;
    let y = peca.y + bloco.y;

    if (y >= 0) {
      grade[y][x] = peca.cor;
    }
  }
}

// Remove linhas completas e soma pontos.
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

// Trata os controles do teclado para iniciar, reiniciar, mover e rotacionar.
function keyPressed() {
  if (!jogoIniciado) {
    if (keyCode === ENTER || key === " ") {
      jogoIniciado = true;
      tempo = 0;
    }
    return;
  }

  if (fimDeJogo) {
    if (keyCode === ENTER || key === " ") {
      // Reiniciar o jogo
      jogoIniciado = false;
      fimDeJogo = false;
      pontos = 0;
      tempo = 0;
      intervalo = 500;
      iniciarGrade();
      novaPeca();
    }
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
  
  // Rotação com W ou UP_ARROW
  if (key.toUpperCase() === 'W' || keyCode === UP_ARROW) {
    rotacionarPeca();
  }
}
