// ============================================================
//  Base-Tetris.js  —  Sketch principal (p5.js)
//
//  Controla a MAQUINA DE ESTADOS das telas:
//    MENU -> SOBRE / RANKING / JOGANDO -> GAMEOVER -> MENU
//
//  As classes do jogo ficam na pasta js/ (Peca, Tabuleiro,
//  Particula e Jogo). Aqui cuidamos das telas, da entrada do
//  teclado/mouse e da comunicacao com o banco (ranking).
// ============================================================

// ----- Constantes do tabuleiro ------------------------------
const COLUNAS = 10;
const LINHAS = 20;
const TAM = 30;
const LARGURA_PAINEL = 180;
const LARGURA = COLUNAS * TAM + LARGURA_PAINEL; // 480
const ALTURA = LINHAS * TAM;                    // 600

// ----- Participantes do trabalho ----------
const PARTICIPANTES = [
  "Eduardo Zaruvne Santos ",
  "Ryan Gabriel Skalecki Marques"
];

// ----- Opcoes do menu (vetor de strings) --------------------
const OPCOES_MENU = ["JOGAR - 1 VIDA", "JOGAR - 3 VIDAS", "SOBRE", "RANKING"];

// ----- Estado global ----------------------------------------
let estado = "MENU";        // MENU | SOBRE | RANKING | JOGANDO | GAMEOVER
let opcaoSelecionada = 0;
let jogo;
let modoAtual = 3;          // quantas vidas tem a partida atual (1 ou 3)
let mensagemMenu = "";      // aviso no menu (ex.: nome obrigatorio)

let ranking = null;         // ranking por modo: { "1": [...], "3": [...] }
let rankingCarregado = false;
let pontuacaoSalva = false;

// ----- API do ranking (PHP na Hostinger) --------------------
const API_BASE = "https://tetris.clonacartao.online";

// ----- Sons (HTML5 Audio) -----------------------------------
const ARQUIVOS_SOM = {
  inicio:   "Sons/game-start.mp3",
  linha:    "Sons/LinhaCompletada.mp3",
  gameover: "Sons/Gameover.mp3"
};

let musicaAmbiente = null;      // Audio em loop (musica de fundo)
let volumeGeral = 0.5;          // 0 a 1 (controlado pela barra de volume)
let mutarMusica = false;        // muta so a musica de fundo
let mutarTudo = false;          // muta todos os sons
let temporizadorMusica = null;  // atraso para iniciar a musica de fundo

// ============================================================
//  Sons (HTML5 Audio)
// ============================================================

// Volume dos efeitos: zero se "mutar tudo" estiver ligado.
function volumeEfeitos() {
  return mutarTudo ? 0 : volumeGeral;
}

// Volume da musica: zero se "mutar tudo" ou "mutar musica" estiver ligado.
// A musica fica um pouco mais baixa que os efeitos (60%).
function volumeMusica() {
  return (mutarTudo || mutarMusica) ? 0 : volumeGeral * 0.6;
}

// Toca um efeito sonoro. Cria um novo Audio a cada chamada para
// permitir que os efeitos se sobreponham.
function tocarSom(nome) {
  const caminho = ARQUIVOS_SOM[nome];
  if (!caminho) {
    return;
  }
  const efeito = new Audio(caminho);
  efeito.volume = volumeEfeitos();
  efeito.play().catch(() => {}); // ignora bloqueio de autoplay do navegador
}

// Inicia (ou reinicia) a musica de fundo em loop.
function iniciarMusica() {
  if (!musicaAmbiente) {
    musicaAmbiente = new Audio("Sons/SomAmbiente.mp3");
    musicaAmbiente.loop = true;
  }
  musicaAmbiente.volume = volumeMusica();
  musicaAmbiente.currentTime = 0;
  musicaAmbiente.play().catch(() => {});
}

function pararMusica() {
  clearTimeout(temporizadorMusica); // cancela uma musica que ainda ia comecar
  if (musicaAmbiente) {
    musicaAmbiente.pause();
    musicaAmbiente.currentTime = 0;
  }
}

// Aplica o volume da musica que ja esta tocando (ao mexer nos controles).
function atualizarAudio() {
  if (musicaAmbiente) {
    musicaAmbiente.volume = volumeMusica();
  }
}

// Para a partida atual e volta para o menu principal.
function voltarAoMenu() {
  pararMusica();
  mensagemMenu = "";
  pontuacaoSalva = false;
  estado = "MENU";
}

// Liga o botao "Voltar ao menu" do HTML.
function configurarBotaoMenu() {
  const btn = document.getElementById("btnMenu");
  if (btn) {
    btn.addEventListener("click", () => {
      liberarAudio();
      voltarAoMenu();
      btn.blur(); // tira o foco para o ENTER nao reativar o botao
    });
  }
}

// Liga os controles de audio do HTML (checkboxes e barra de volume).
function configurarControlesAudio() {
  const barraVolume = document.getElementById("volume");
  const chkMusica = document.getElementById("mutarMusica");
  const chkTudo = document.getElementById("mutarTudo");

  if (barraVolume) {
    volumeGeral = barraVolume.value / 100;
    barraVolume.addEventListener("input", () => {
      liberarAudio();
      volumeGeral = barraVolume.value / 100;
      atualizarAudio();
    });
  }

  if (chkMusica) {
    chkMusica.addEventListener("change", () => {
      liberarAudio();
      mutarMusica = chkMusica.checked;
      atualizarAudio();
    });
  }

  if (chkTudo) {
    chkTudo.addEventListener("change", () => {
      liberarAudio();
      mutarTudo = chkTudo.checked;
      atualizarAudio();
    });
  }
}

// Mantida por compatibilidade. Com HTML5 Audio nao e preciso liberar
// o audio manualmente: o navegador libera apos a primeira interacao.
function liberarAudio() {}

// ============================================================
//  setup / draw
// ============================================================
function setup() {
  const canvas = createCanvas(LARGURA, ALTURA);
  canvas.parent("canvas-container");
  textFont("Arial");
  jogo = new Jogo();
  configurarControlesAudio();
  configurarBotaoMenu();
}

function draw() {
  switch (estado) {
    case "MENU":     telaMenu();     break;
    case "SOBRE":    telaSobre();    break;
    case "RANKING":  telaRanking();  break;
    case "JOGANDO":  telaJogo();     break;
    case "GAMEOVER": telaGameOver(); break;
  }
}

// ============================================================
//  TELAS
// ============================================================

// ----- Menu de abertura -------------------------------------
function telaMenu() {
  background(26, 26, 46);

  // Titulo
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(0, 212, 255);
  textSize(64);
  text("TETRIS", LARGURA / 2, 110);

  fill(200, 200, 255);
  textStyle(NORMAL);
  textSize(14);
  text("Trabalho de Programacao", LARGURA / 2, 160);

  // O mouse por cima de uma opcao ja a seleciona (usabilidade).
  for (let i = 0; i < OPCOES_MENU.length; i++) {
    const r = retanguloOpcao(i);
    if (mouseEmCima(r)) {
      opcaoSelecionada = i;
    }
  }

  // Desenha as opcoes
  for (let i = 0; i < OPCOES_MENU.length; i++) {
    const r = retanguloOpcao(i);
    const selecionada = i === opcaoSelecionada;

    noStroke();
    fill(selecionada ? color(0, 212, 255) : color(255, 255, 255, 30));
    rect(r.x, r.y, r.w, r.h, 8);

    fill(selecionada ? color(20, 20, 40) : color(255));
    textStyle(BOLD);
    textSize(22);
    text(OPCOES_MENU[i], LARGURA / 2, r.y + r.h / 2);
  }

  // Aviso (ex.: nome obrigatorio para jogar)
  if (mensagemMenu !== "") {
    fill(255, 90, 90);
    textStyle(BOLD);
    textSize(15);
    text(mensagemMenu, LARGURA / 2, ALTURA - 58);
  }

  fill(150, 150, 200);
  textStyle(NORMAL);
  textSize(13);
  text("Use as setas e ENTER, ou clique com o mouse", LARGURA / 2, ALTURA - 30);
}

// ----- Tela Sobre -------------------------------------------
function telaSobre() {
  background(26, 26, 46);

  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fill(0, 212, 255);
  textSize(40);
  text("SOBRE", LARGURA / 2, 50);

  fill(220, 220, 230);
  textStyle(NORMAL);
  textSize(15);
  text("Tetris feito em JavaScript com a biblioteca p5.js.", LARGURA / 2, 120);
  text("Complete linhas, suba de fase e marque pontos!", LARGURA / 2, 145);

  fill(0, 255, 136);
  textStyle(BOLD);
  textSize(20);
  text("Participantes", LARGURA / 2, 220);

  // Lista os nomes percorrendo o vetor PARTICIPANTES.
  fill(255);
  textStyle(NORMAL);
  textSize(17);
  for (let i = 0; i < PARTICIPANTES.length; i++) {
    text(PARTICIPANTES[i], LARGURA / 2, 260 + i * 32);
  }

  fill(150, 150, 200);
  textSize(13);
  text("Pressione ENTER ou ESC para voltar", LARGURA / 2, ALTURA - 30);
}

// ----- Tela de Ranking (dados do banco, separados por modo) -
function telaRanking() {
  background(26, 26, 46);

  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fill(255, 215, 0);
  textSize(36);
  text("RANKING", LARGURA / 2, 28);

  if (!rankingCarregado) {
    fill(200);
    textStyle(NORMAL);
    textSize(16);
    text("Carregando...", LARGURA / 2, ALTURA / 2);
  } else if (ranking === null) {
    fill(255, 120, 120);
    textStyle(NORMAL);
    textSize(15);
    text("Sem conexao com o banco de dados.", LARGURA / 2, ALTURA / 2 - 10);
    textSize(12);
    text("Verifique o .env e o acesso ao MySQL.", LARGURA / 2, ALTURA / 2 + 18);
  } else {
    // Duas colunas: cada modo tem seu proprio ranking.
    desenharColunaRanking("1 VIDA", ranking["1"] || [], 30);
    desenharColunaRanking("3 VIDAS", ranking["3"] || [], LARGURA / 2 + 10);
  }

  fill(150, 150, 200);
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(13);
  text("Pressione ENTER ou ESC para voltar", LARGURA / 2, ALTURA - 28);
}

// Desenha uma coluna de ranking a partir de x0.
function desenharColunaRanking(titulo, lista, x0) {
  const larguraCol = LARGURA / 2 - 40;

  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(18);
  fill(0, 212, 255);
  text(titulo, x0 + larguraCol / 2, 84);

  if (lista.length === 0) {
    fill(160);
    textStyle(NORMAL);
    textSize(13);
    text("sem registros", x0 + larguraCol / 2, 130);
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    const linha = lista[i];
    const y = 124 + i * 34;

    fill(i === 0 ? color(255, 215, 0) : color(255));
    textStyle(BOLD);
    textSize(14);
    textAlign(LEFT, TOP);
    text((i + 1) + ". " + encurtar(linha.nome_jogador, 9), x0, y);

    textAlign(RIGHT, TOP);
    text(linha.pontos, x0 + larguraCol, y);
  }
}

// Corta nomes muito longos para caber na coluna.
function encurtar(texto, max) {
  return texto.length > max ? texto.substring(0, max) + "." : texto;
}

// ----- Tela de jogo -----------------------------------------
function telaJogo() {
  background(jogo.corFundoAtual()[0], jogo.corFundoAtual()[1], jogo.corFundoAtual()[2]);

  jogo.atualizar(deltaTime);
  jogo.desenhar();

  // Quando acabam as vidas, salva a pontuacao e vai pro game over.
  if (jogo.fimDeJogo) {
    if (!pontuacaoSalva) {
      salvarPontuacao();
      pararMusica();
      tocarSom("gameover");
      pontuacaoSalva = true;
    }
    estado = "GAMEOVER";
  }
}

// ----- Tela de fim de jogo ----------------------------------
function telaGameOver() {
  background(jogo.corFundoAtual()[0], jogo.corFundoAtual()[1], jogo.corFundoAtual()[2]);
  jogo.desenhar();

  // Cobertura escura por cima do tabuleiro.
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, LARGURA, ALTURA);

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255, 90, 90);
  textSize(44);
  text("FIM DE JOGO", LARGURA / 2, 180);

  fill(255);
  textSize(22);
  text("Pontos: " + jogo.pontos, LARGURA / 2, 250);
  textSize(16);
  fill(220);
  text("Nivel " + jogo.nivel + "  |  Linhas " + jogo.linhasTotais, LARGURA / 2, 288);

  fill(180, 220, 255);
  textSize(15);
  text("Modo: " + jogo.modoVidas + (jogo.modoVidas === 1 ? " vida" : " vidas"), LARGURA / 2, 320);

  fill(0, 255, 136);
  textSize(14);
  text("Pontuacao enviada ao ranking!", LARGURA / 2, 356);

  fill(180, 180, 220);
  textStyle(NORMAL);
  textSize(15);
  text("Pressione ENTER para voltar ao menu", LARGURA / 2, ALTURA - 60);
}

// ============================================================
//  ENTRADA (teclado e mouse)
// ============================================================
function keyPressed() {
  liberarAudio();

  // Se o jogador esta digitando o nome, deixa o teclado para o input.
  const ativo = document.activeElement;
  if (ativo && ativo.tagName === "INPUT") {
    return;
  }

  if (estado === "MENU") {
    entradaMenu();
  } else if (estado === "SOBRE" || estado === "RANKING") {
    if (keyCode === ENTER || keyCode === ESCAPE || key === " ") {
      estado = "MENU";
    }
  } else if (estado === "GAMEOVER") {
    if (keyCode === ENTER || key === " ") {
      estado = "MENU";
    }
  } else if (estado === "JOGANDO") {
    entradaJogo();
  }

  // Impede que as setas e o espaco rolem a pagina.
  if ([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, 32].includes(keyCode)) {
    return false;
  }
}

function entradaMenu() {
  if (keyCode === UP_ARROW) {
    opcaoSelecionada = (opcaoSelecionada + OPCOES_MENU.length - 1) % OPCOES_MENU.length;
  } else if (keyCode === DOWN_ARROW) {
    opcaoSelecionada = (opcaoSelecionada + 1) % OPCOES_MENU.length;
  } else if (keyCode === ENTER || key === " ") {
    ativarOpcaoMenu();
  }
}

function entradaJogo() {
  if (keyCode === LEFT_ARROW) {
    jogo.mover(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    jogo.mover(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    jogo.mover(0, 1);
  } else if (key.toUpperCase() === "W" || keyCode === UP_ARROW) {
    jogo.rotacionar();
  } else if (key === " ") {
    jogo.descerTudo();
  }
}

function mousePressed() {
  liberarAudio();

  if (estado === "MENU") {
    for (let i = 0; i < OPCOES_MENU.length; i++) {
      if (mouseEmCima(retanguloOpcao(i))) {
        opcaoSelecionada = i;
        ativarOpcaoMenu();
      }
    }
  } else if (estado === "SOBRE" || estado === "RANKING" || estado === "GAMEOVER") {
    estado = "MENU";
  }
}

// ============================================================
//  AUXILIARES
// ============================================================
function ativarOpcaoMenu() {
  const opcao = OPCOES_MENU[opcaoSelecionada];
  if (opcao === "JOGAR - 1 VIDA") {
    iniciarJogo(1);
  } else if (opcao === "JOGAR - 3 VIDAS") {
    iniciarJogo(3);
  } else if (opcao === "SOBRE") {
    estado = "SOBRE";
  } else if (opcao === "RANKING") {
    estado = "RANKING";
    carregarRanking();
  }
}

// Le o nome digitado (sem espacos nas pontas).
function nomeDoJogador() {
  const campo = document.getElementById("nome");
  return campo ? campo.value.trim() : "";
}

// Inicia uma partida no modo escolhido (1 ou 3 vidas).
function iniciarJogo(vidas) {
  // Nome e OBRIGATORIO: sem nome, nao deixa jogar.
  if (nomeDoJogador() === "") {
    mensagemMenu = "Digite seu nome para jogar!";
    const campo = document.getElementById("nome");
    if (campo) {
      campo.focus();
    }
    return;
  }

  mensagemMenu = "";
  modoAtual = vidas;
  jogo.reiniciar(vidas);
  pontuacaoSalva = false;
  tocarSom("inicio");

  // A musica de fundo so comeca 2 segundos depois do inicio.
  clearTimeout(temporizadorMusica);
  temporizadorMusica = setTimeout(() => {
    if (estado === "JOGANDO") { // nao toca se o jogador ja saiu/perdeu
      iniciarMusica();
    }
  }, 2000);

  estado = "JOGANDO";
}

// Retangulo (x, y, w, h) de uma opcao do menu.
function retanguloOpcao(i) {
  const largura = 240;
  const altura = 46;
  return {
    x: (LARGURA - largura) / 2,
    y: 240 + i * 60,
    w: largura,
    h: altura
  };
}

function mouseEmCima(r) {
  return mouseX > r.x && mouseX < r.x + r.w &&
         mouseY > r.y && mouseY < r.y + r.h;
}

// ============================================================
//  COMUNICACAO COM O BANCO (PHP + MySQL)
// ============================================================

// Busca o ranking de cada modo e guarda no objeto "ranking".
function carregarRanking() {
  rankingCarregado = false;
  ranking = null;

  fetch(API_BASE + "/ranking.php")
    .then(resposta => resposta.json())
    .then(dados => {
      ranking = dados; // { "1": [...], "3": [...] }
      rankingCarregado = true;
    })
    .catch(() => {
      ranking = null; // sinaliza erro de conexao
      rankingCarregado = true;
    });
}

// Envia a pontuacao da partida para o banco (incluindo o modo).
function salvarPontuacao() {
  let nome = nomeDoJogador();
  if (nome === "") {
    nome = "JOGADOR"; // seguranca extra; o nome ja e exigido no menu
  }

  fetch(API_BASE + "/salvar_pontuacao.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome,
      pontos: jogo.pontos,
      linhas: jogo.linhasTotais,
      nivel: jogo.nivel,
      modo: modoAtual
    })
  }).catch(() => {
    // Sem conexao: o jogo continua normalmente.
  });
}
