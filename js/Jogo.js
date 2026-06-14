// ============================================================
//  Jogo.js  —  Cerebro da partida
//
//  Junta tudo: tabuleiro, peca atual, fila de proximas pecas,
//  pontuacao, vidas, nivel (fase) e os efeitos (particulas e
//  tremor de tela). Concentra as REGRAS do jogo.
//
//  Vetores usados aqui:
//   - this.fila        -> array das proximas pecas
//   - this.particulas  -> array de efeitos
//   - this.shake       -> p5.Vector do tremor de tela
// ============================================================

class Jogo {
  constructor() {
    this.tabuleiro = new Tabuleiro(COLUNAS, LINHAS);
    this.fila = [];
    this.particulas = [];
    this.shake = createVector(0, 0);
    this.modoVidas = 3; // modo de jogo: 1 ou 3 vidas
    this.reiniciar();
  }

  // Zera tudo para uma nova partida. Recebe quantas vidas o modo tem.
  reiniciar(modoVidas = this.modoVidas) {
    this.modoVidas = modoVidas;
    this.tabuleiro.reiniciar();
    this.pontos = 0;
    this.linhasTotais = 0;
    this.nivel = 1;
    this.vidas = this.modoVidas;
    this.tempo = 0;
    this.fimDeJogo = false;
    this.mensagem = "";
    this.tempoMensagem = 0;
    this.particulas = [];
    this.shake.set(0, 0);

    // Monta a fila inicial com 3 proximas pecas.
    this.fila = [];
    for (let i = 0; i < 3; i++) {
      this.fila.push(new Peca(random(FORMAS)));
    }
    this.proximaPeca();
  }

  // Configuracao da fase atual (lida do vetor FASES).
  faseAtual() {
    const indice = Math.min(this.nivel - 1, FASES.length - 1);
    return FASES[indice];
  }

  intervaloAtual() {
    return this.faseAtual().intervalo;
  }

  corFundoAtual() {
    return this.faseAtual().corFundo;
  }

  // Tira a proxima peca da fila e repoe o final do vetor.
  proximaPeca() {
    this.peca = this.fila.shift();
    this.fila.push(new Peca(random(FORMAS)));

    // Se a nova peca ja nasce colidindo, o jogador perde uma vida.
    if (this.tabuleiro.colide(this.peca.blocosAbsolutos())) {
      this.perderVida();
    }
  }

  perderVida() {
    this.vidas--;
    if (this.vidas <= 0) {
      this.vidas = 0;
      this.fimDeJogo = true;
    } else {
      this.tabuleiro.reiniciar();
      this.mostrarMensagem("VOCE PERDEU 1 VIDA");
    }
  }

  // ----- Acoes do jogador -------------------------------------

  // Move a peca; se ela bater descendo, assenta no tabuleiro.
  mover(dx, dy) {
    const alvo = this.peca.blocosAbsolutos(dx, dy);
    if (!this.tabuleiro.colide(alvo)) {
      this.peca.mover(dx, dy);
      return true;
    }
    if (dy === 1) {
      this.assentar();
    }
    return false;
  }

  // "Hard drop": desce a peca de uma vez ate travar.
  descerTudo() {
    while (this.mover(0, 1)) {
      this.pontos += 1; // pequeno bonus por descer rapido
    }
  }

  // Tenta girar a peca; so aplica se a rotacao nao colidir.
  rotacionar() {
    const candidato = this.peca.blocosRotacionados();
    const alvo = candidato.map(b =>
      createVector(this.peca.pos.x + b.x, this.peca.pos.y + b.y)
    );
    if (!this.tabuleiro.colide(alvo)) {
      this.peca.blocos = candidato;
    }
  }

  // Fixa a peca, limpa linhas e gera os efeitos.
  assentar() {
    this.tabuleiro.fixar(this.peca);
    const resultado = this.tabuleiro.limparLinhas();

    if (resultado.quantidade > 0) {
      this.pontuar(resultado.quantidade);
      this.gerarParticulas(resultado.linhas);
      this.tremor(resultado.quantidade);
      this.linhasTotais += resultado.quantidade;
      this.verificarFase();
      tocarSom("linha"); // efeito sonoro de linha completada
    }

    this.proximaPeca();
  }

  // ----- Pontuacao e progressao -------------------------------

  pontuar(qtdLinhas) {
    const base = PONTOS_POR_LINHA[qtdLinhas] || 0;
    this.pontos += base * this.nivel; // vale mais nos niveis altos
  }

  verificarFase() {
    const novoNivel = Math.floor(this.linhasTotais / LINHAS_POR_FASE) + 1;
    if (novoNivel > this.nivel) {
      this.nivel = novoNivel;
      this.mostrarMensagem("FASE " + this.nivel + "!");
    }
  }

  mostrarMensagem(texto) {
    this.mensagem = texto;
    this.tempoMensagem = 90; // ~1,5s a 60fps
  }

  // ----- Efeitos ----------------------------------------------

  // Cria particulas em cada celula das linhas que foram limpas.
  gerarParticulas(linhas) {
    for (const linha of linhas) {
      for (let x = 0; x < COLUNAS; x++) {
        const cor = linha.cores[x] || "#ffffff";
        const px = x * TAM + TAM / 2;
        const py = linha.y * TAM + TAM / 2;
        this.particulas.push(new Particula(px, py, cor));
      }
    }
  }

  // Da um "empurrao" aleatorio na tela (vetor) proporcional as linhas.
  tremor(qtdLinhas) {
    const forca = 4 + qtdLinhas * 3;
    this.shake = p5.Vector.random2D().mult(forca);
  }

  // ----- Atualizacao por frame --------------------------------

  atualizar(dt) {
    if (this.fimDeJogo) {
      return;
    }

    if (this.tempoMensagem > 0) {
      this.tempoMensagem--;
    }

    // O tremor vai perdendo forca a cada frame.
    this.shake.mult(0.85);
    if (this.shake.mag() < 0.3) {
      this.shake.set(0, 0);
    }

    // Atualiza e descarta particulas mortas.
    for (const p of this.particulas) {
      p.atualizar();
    }
    this.particulas = this.particulas.filter(p => !p.morreu());

    // Gravidade: desce a peca quando passa o intervalo da fase.
    this.tempo += dt;
    if (this.tempo > this.intervaloAtual()) {
      this.tempo = 0;
      this.mover(0, 1);
    }
  }

  // ----- Desenho ----------------------------------------------

  desenhar() {
    // Tudo do tabuleiro sofre o tremor (transformacao translate).
    push();
    translate(this.shake.x, this.shake.y);
    this.tabuleiro.desenhar(0, 0);
    this.peca.desenhar(0, 0);
    for (const p of this.particulas) {
      p.desenhar();
    }
    pop();

    this.desenharPainel();
    this.desenharMensagem();
  }

  desenharPainel() {
    const x0 = COLUNAS * TAM;
    const cx = x0 + 16;

    noStroke();
    fill(0, 0, 0, 120);
    rect(x0, 0, LARGURA_PAINEL, ALTURA);

    // Pre-visualizacao das proximas pecas (percorre o vetor fila).
    fill(180, 200, 255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(13);
    text("PROXIMAS", cx, 14);

    const tamMini = 14;
    for (let i = 0; i < Math.min(this.fila.length, 3); i++) {
      this.desenharMiniPeca(this.fila[i], cx, 38 + i * 44, tamMini);
    }

    // Estatisticas (sinalizam a progressao do jogador).
    this.desenharStat("PONTOS", this.pontos, cx, 190);
    this.desenharStat("NIVEL", this.nivel, cx, 250);
    this.desenharStat("LINHAS", this.linhasTotais, cx, 310);

    // Vidas como coracoes (circulos vermelhos).
    fill(180, 200, 255);
    textSize(13);
    textStyle(BOLD);
    text("VIDAS", cx, 370);
    noStroke();
    for (let i = 0; i < this.vidas; i++) {
      fill(255, 80, 90);
      ellipse(cx + 12 + i * 26, 398, 16, 16);
    }
  }

  desenharStat(rotulo, valor, x, y) {
    fill(180, 200, 255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(13);
    text(rotulo, x, y);
    fill(255);
    textSize(26);
    text(valor, x, y + 18);
  }

  desenharMiniPeca(peca, ox, oy, tam) {
    for (const b of peca.blocos) {
      desenharBloco(ox + b.x * tam, oy + b.y * tam, peca.cor, tam);
    }
  }

  // Mensagem grande no centro (troca de fase, perda de vida).
  desenharMensagem() {
    if (this.tempoMensagem <= 0) {
      return;
    }
    const larguraBoard = COLUNAS * TAM;
    const alpha = map(this.tempoMensagem, 0, 90, 0, 255);

    push();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(34);
    fill(0, 0, 0, alpha * 0.6);
    text(this.mensagem, larguraBoard / 2 + 2, ALTURA / 2 + 2);
    fill(255, 230, 60, alpha);
    text(this.mensagem, larguraBoard / 2, ALTURA / 2);
    pop();
  }
}
