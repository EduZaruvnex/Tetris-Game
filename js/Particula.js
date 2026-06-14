// ============================================================
//  Particula.js  —  Efeito visual ao completar uma linha
//
//  VETOR MATEMATICO (p5.Vector): cada particula tem posicao,
//  velocidade e aceleracao como vetores. A cada frame somamos
//  aceleracao -> velocidade -> posicao (integracao simples),
//  exatamente como movimento com vetores.
// ============================================================

class Particula {
  constructor(x, y, cor) {
    this.pos = createVector(x, y);
    // Velocidade inicial aleatoria (espalha em todas as direcoes).
    this.vel = createVector(random(-3, 3), random(-5, -1));
    // Aceleracao = gravidade puxando para baixo.
    this.acc = createVector(0, 0.2);
    this.cor = cor;
    this.vida = 255; // vai diminuindo ate a particula sumir
  }

  // Atualiza o movimento somando os vetores.
  atualizar() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vida -= 6;
  }

  desenhar() {
    push();
    noStroke();
    const c = color(this.cor);
    c.setAlpha(this.vida);
    fill(c);
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    rect(0, 0, 6, 6);
    pop();
  }

  morreu() {
    return this.vida <= 0;
  }
}
