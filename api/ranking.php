<?php
/**
 * api/ranking.php — Devolve as 10 melhores pontuacoes em JSON.
 * Consumido pela tela de Ranking do jogo (fetch no Base-Tetris.js).
 */

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../db.php';

try {
    $pdo = conectarBanco();

    // Top 10 de cada modo (1 vida e 3 vidas) -> rankings separados.
    $consulta = $pdo->prepare(
        'SELECT nome_jogador, pontos, linhas, nivel
         FROM pontuacoes
         WHERE modo = ?
         ORDER BY pontos DESC, criado_em ASC
         LIMIT 10'
    );

    $topModo = function (int $modo) use ($consulta) {
        $consulta->execute([$modo]);
        return $consulta->fetchAll();
    };

    echo json_encode(
        ['1' => $topModo(1), '3' => $topModo(3)],
        JSON_UNESCAPED_UNICODE
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao buscar o ranking'], JSON_UNESCAPED_UNICODE);
}
