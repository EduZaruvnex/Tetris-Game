<?php

if (!function_exists('carregarEnv')) {

    function carregarEnv(string $caminho): void
    {
        if (!is_readable($caminho)) {
            return; // Em CI/producao nao existe .env: usamos as variaveis de ambiente.
        }

        foreach (file($caminho, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linha) {
            $linha = trim($linha);
            if ($linha === '' || $linha[0] === '#') {
                continue;
            }

            [$chave, $valor] = array_pad(explode('=', $linha, 2), 2, '');
            $chave = trim($chave);
            $valor = trim(trim($valor), "\"'");

            if ($chave !== '' && getenv($chave) === false) {
                putenv("{$chave}={$valor}");
                $_ENV[$chave] = $valor;
            }
        }
    }
}

if (!function_exists('env')) {
    /** Le uma variavel de ambiente com valor padrao opcional. */
    function env(string $chave, ?string $padrao = null): ?string
    {
        $valor = getenv($chave);
        return ($valor === false || $valor === '') ? $padrao : $valor;
    }
}

/** Cria e retorna a conexao PDO com o banco. */
function conectarBanco(): PDO
{
    carregarEnv(__DIR__ . '/.env');

    $host = env('DB_HOST');
    $port = env('DB_PORT', '3306');
    $nome = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASS');

    $dsn = "mysql:host={$host};port={$port};dbname={$nome};charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5, // segundos ate desistir de conectar
    ]);
}
