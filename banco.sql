-- ------------------------------------------------------------
--  Tabela de pontuacoes (ranking dos jogadores)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pontuacoes (
    id           INT             AUTO_INCREMENT PRIMARY KEY,
    nome_jogador VARCHAR(20)     NOT NULL,
    pontos       INT UNSIGNED    NOT NULL DEFAULT 0,
    linhas       INT UNSIGNED    NOT NULL DEFAULT 0,   -- linhas completadas na partida
    nivel        INT UNSIGNED    NOT NULL DEFAULT 1,   -- fase/nivel alcancado
    modo         TINYINT UNSIGNED NOT NULL DEFAULT 3,  -- modo de jogo: 1 ou 3 vidas
    criado_em    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- indice para ordenar o ranking de cada modo pelas maiores pontuacoes
    INDEX idx_modo_pontos (modo, pontos DESC)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  Dados de exemplo 
-- ------------------------------------------------------------
INSERT INTO pontuacoes (nome_jogador, pontos, linhas, nivel, modo) VALUES
    ('CPU',      1200, 12, 4, 3),
    ('JOGADOR',   800,  8, 3, 3),
    ('TESTE',     300,  3, 1, 3),
    ('SPEED',     900,  9, 3, 1),
    ('NOVATO',    150,  1, 1, 1);
