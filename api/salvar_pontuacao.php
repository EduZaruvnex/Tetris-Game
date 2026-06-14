<?php
/**
 * api/salvar_pontuacao.php — Recebe a pontuacao do fim da partida
 * (JSON via POST) e grava na tabela "pontuacoes".
 *
 * Usa prepared statements para evitar SQL injection.
 */

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../db.php';

// Le o corpo JSON enviado pelo jogo.
$dados = json_decode(file_get_contents('php://input'), true) ?? [];

$nome   = trim((string)($dados['nome'] ?? ''));
$pontos = (int)($dados['pontos'] ?? 0);
$linhas = (int)($dados['linhas'] ?? 0);
$nivel  = (int)($dados['nivel']  ?? 1);
$modo   = (int)($dados['modo']   ?? 3);

// Validacao basica.
if ($nome === '') {
    $nome = 'JOGADOR';
}
$nome   = mb_substr($nome, 0, 20);
$pontos = max(0, $pontos);
$linhas = max(0, $linhas);
$nivel  = max(1, $nivel);
if ($modo !== 1 && $modo !== 3) {
    $modo = 3; // so existem os modos 1 e 3 vidas
}

try {
    $pdo = conectarBanco();

    $stmt = $pdo->prepare(
        'INSERT INTO pontuacoes (nome_jogador, pontos, linhas, nivel, modo)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$nome, $pontos, $linhas, $nivel, $modo]);

    echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'erro' => 'Falha ao salvar a pontuacao']);
}
