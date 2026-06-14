// ============================================================
//  Tabuleiro.js  —  A grade onde as pecas se acumulam
//
//  VETOR (array): a grade e uma MATRIZ (vetor de vetores).
//  grade[linha][coluna] guarda a cor do bloco fixado ali,
//  ou null se a celula estiver vazia.
// ============================================================

class Tabuleiro {
  constructor(colunas, linhas) {
    this.colunas = colunas;
    this.linhas = linhas;
    this.grade = [];
    this.reiniciar();
  }

  // Esvazia a grade (preenche a matriz com null).
  reiniciar() {
    this.grade = [];
    for (let y = 0; y < this.linhas; y++) {
      this.grade[y] = [];
      for (let x = 0; x < this.colunas; x++) {
        this.grade[y][x] = null;
      }
    }
  }

  // Verifica se um conjunto de blocos (vetores absolutos) colide
  // com as paredes, o fundo ou pecas ja fixadas.
  colide(blocos) {
    for (const b of blocos) {
      if (b.x < 0 || b.x >= this.colunas || b.y >= this.linhas) {
        return true;
      }
      if (b.y >= 0 && this.grade[b.y][b.x] !== null) {
        return true;
      }
    }
    return false;
  }

  // Grava a peca na grade (vira parte do cenario).
  fixar(peca) {
    for (const b of peca.blocosAbsolutos()) {
      if (b.y >= 0) {
        this.grade[b.y][b.x] = peca.cor;
      }
    }
  }

  // Remove as linhas completas e retorna
  // { quantidade, linhas: [ { y, cores: [...] }, ... ] }
  // onde cada item guarda a posicao e as cores da linha removida.
  limparLinhas() {
    const removidas = [];

    for (let y = this.linhas - 1; y >= 0; y--) {
      const cheia = this.grade[y].every(celula => celula !== null);
      if (cheia) {
        // Guarda a posicao e as cores da linha ANTES de remove-la,
        // para o gerarParticulas() poder criar as particulas coloridas.
        removidas.push({ y: y, cores: this.grade[y].slice() });
        this.grade.splice(y, 1);
        // Adiciona uma linha vazia no topo.
        const novaLinha = new Array(this.colunas).fill(null);
        this.grade.unshift(novaLinha);
        y++; // re-checa a mesma posicao (agora com a linha de cima)
      }
    }

    return { quantidade: removidas.length, linhas: removidas };
  }

  // Desenha o fundo da grade e os blocos fixados.
  desenhar(deslocX = 0, deslocY = 0) {
    for (let y = 0; y < this.linhas; y++) {
      for (let x = 0; x < this.colunas; x++) {
        const px = deslocX + x * TAM;
        const py = deslocY + y * TAM;
        const cor = this.grade[y][x];

        if (cor !== null) {
          desenharBloco(px, py, cor);
        } else {
          // celula vazia: quadriculado discreto
          noStroke();
          fill(255, 255, 255, 8);
          rect(px + 1, py + 1, TAM - 2, TAM - 2, 3);
        }
      }
    }
  }
}
