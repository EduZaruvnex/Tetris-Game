// ============================================================
//  Peca.js  —  A peca (tetromino) que esta caindo
//
//  Usa VETORES MATEMATICOS (p5.Vector):
//   - this.pos      -> posicao da peca na grade (coluna, linha)
//   - this.blocos   -> vetor de p5.Vector com os blocos relativos
//   - rotacionar()  -> aplica a TRANSFORMACAO de rotacao de 90 graus
//                      em cada vetor com .rotate(HALF_PI)
// ============================================================

class Peca {
  constructor(forma) {
    this.nome = forma.nome;
    this.cor = forma.cor;
    // Comeca mais ou menos no centro do topo do tabuleiro.
    this.pos = createVector(3, 0);
    // Converte cada bloco { x, y } em um p5.Vector.
    this.blocos = forma.blocos.map(b => createVector(b.x, b.y));
  }

  // Retorna a posicao ABSOLUTA dos blocos na grade (com deslocamento opcional).
  blocosAbsolutos(dx = 0, dy = 0) {
    return this.blocos.map(b =>
      createVector(this.pos.x + b.x + dx, this.pos.y + b.y + dy)
    );
  }

  // Move a peca somando um vetor de deslocamento.
  mover(dx, dy) {
    this.pos.add(createVector(dx, dy));
  }

  // Calcula como ficariam os blocos apos girar 90 graus, SEM aplicar ainda.
  // Quem decide aplicar (testando colisao) e a classe Jogo.
  blocosRotacionados() {
    // A peca "O" (quadrado) nao muda ao girar.
    if (this.nome === "O") {
      return this.blocos.map(b => b.copy());
    }

    // Transformacao de rotacao: gira cada vetor 90 graus.
    const girados = this.blocos.map(b => {
      const v = b.copy().rotate(HALF_PI);
      return createVector(round(v.x), round(v.y));
    });

    // Normaliza para o canto superior esquerdo (mantem dentro da area positiva).
    const minX = Math.min(...girados.map(v => v.x));
    const minY = Math.min(...girados.map(v => v.y));
    girados.forEach(v => {
      v.x -= minX;
      v.y -= minY;
    });

    return girados;
  }

  // Desenha a peca usando transformacoes (push/translate/pop).
  desenhar(deslocX = 0, deslocY = 0, tamanho = TAM) {
    for (const b of this.blocos) {
      const x = deslocX + (this.pos.x + b.x) * tamanho;
      const y = deslocY + (this.pos.y + b.y) * tamanho;
      desenharBloco(x, y, this.cor, tamanho);
    }
  }
}

// Funcao reutilizavel: desenha um bloco com um leve brilho na borda.
function desenharBloco(x, y, cor, tamanho = TAM) {
  push();
  translate(x, y);
  stroke(255, 255, 255, 60);
  strokeWeight(2);
  fill(cor);
  rect(0, 0, tamanho, tamanho, 4);
  // brilho interno
  noStroke();
  fill(255, 255, 255, 40);
  rect(tamanho * 0.18, tamanho * 0.18, tamanho * 0.32, tamanho * 0.32, 2);
  pop();
}
