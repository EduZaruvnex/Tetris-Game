# Tetris-Game

Jogo do Tetris feito em **JavaScript (p5.js)** com placar online em **PHP + MySQL**, para o trabalho da matéria de Web Development.

## Criado pelos alunos
- Eduardo Zaruvne Santos
- Ryan Gabriel Skalecki Marques

## Funcionalidades

- **Menu de abertura** com navegação por teclado ou mouse.
- **Dois modos de jogo:** `1 VIDA` e `3 VIDAS`, com **ranking separado** para cada modo.
- **Nome do jogador obrigatório** para iniciar a partida.
- **Progressão clara:** pontos, nível (fase), linhas e vidas exibidos no painel; a velocidade e a cor de fundo aumentam a cada fase.
- **As 7 peças** clássicas do Tetris, com fila de próximas peças.
- **Efeitos visuais:** partículas ao completar linhas e tremor de tela.
- **Sons:** início de jogo, linha completada, fim de jogo e música ambiente em loop.
- **Tela Sobre** com os participantes e **tela de Ranking** com as melhores pontuações vindas do banco de dados.

## Tecnologias

- **p5.js** — renderização do jogo no canvas.
- **HTML5 Audio** — efeitos sonoros e música.
- **PHP** (PDO) — API que lê e grava as pontuações.
- **MySQL** — banco de dados do ranking (hospedado na Hostinger).

## Estrutura do projeto

```
Tetris-Game/
├── index.html              Página principal (canvas + campo de nome)
├── Base-Tetris.js          Sketch principal: telas, entrada e comunicação com o banco
├── js/
│   ├── pecas.js            Os 7 tetrominós (vetor de formas)
│   ├── fases.js            Configuração de cada fase (dificuldade)
│   ├── Peca.js             Classe Peca (posição/rotação com p5.Vector)
│   ├── Tabuleiro.js        Classe Tabuleiro (grade, colisão, limpar linhas)
│   ├── Particula.js        Classe Particula (efeito ao limpar linha)
│   └── Jogo.js             Classe Jogo (score, vidas, nível, fila, efeitos)
├── api/
│   ├── ranking.php         Devolve o ranking (separado por modo) em JSON
│   └── salvar_pontuacao.php Grava a pontuação no fim da partida
├── db.php                  Conexão com o banco (lê o .env ou variáveis de ambiente)
├── banco.sql               Script de criação da tabela de pontuações
├── .env                    Credenciais do banco (NÃO versionado)
├── .env.example            Modelo de configuração do banco
└── Sons/                   Efeitos sonoros e música
```

## Como executar

1. Coloque o projeto na pasta `htdocs` do **XAMPP** e inicie o **Apache**.
2. Configure o banco de dados:
   - Copie `.env.example` para `.env` e preencha com suas credenciais MySQL.
   - Importe o `banco.sql` no seu banco (ex.: pelo phpMyAdmin) para criar a tabela `pontuacoes`.
3. Abra no navegador: `http://localhost/Tetris-Game/`.

> Em produção / GitHub Actions, as credenciais são lidas de **variáveis de ambiente** (GitHub Secrets), sem precisar do arquivo `.env`.

## Controles

| Tecla | Ação |
|------|------|
| `←` `→` | Mover a peça para os lados |
| `↓` | Descer mais rápido |
| `W` ou `↑` | Rotacionar |
| `ESPAÇO` | Soltar a peça de uma vez |
| `ENTER` | Confirmar no menu / voltar ao menu |
| Mouse | Navegar e clicar nas opções do menu |

## Como jogar

1. Digite seu **nome** no campo ao lado do tabuleiro (obrigatório).
2. No menu, escolha **`JOGAR - 1 VIDA`** ou **`JOGAR - 3 VIDAS`**.
3. Complete linhas horizontais para ganhar pontos e subir de fase.
4. Ao perder todas as vidas, sua pontuação é enviada ao **ranking** do modo escolhido.

## Créditos dos sons

Efeitos sonoros e música obtidos no **Pixabay** (livres para uso):
https://pixabay.com/pt/sound-effects/search/game/

| Arquivo | Uso |
|---------|-----|
| `game-start.mp3` | Início da partida |
| `LinhaCompletada.mp3` | Ao completar uma linha |
| `Gameover.mp3` | Fim de jogo |
| `SomAmbiente.mp3` | Música ambiente (tocada em loop durante o jogo) |
