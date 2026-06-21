@echo off
chcp 65001 >nul
title Fasipe - Iniciar Projeto
color 0A

echo ============================================
echo   FASIPE - Atualizando e iniciando projeto
echo ============================================
echo.

echo [1/3] Buscando atualizacoes do GitHub...
git pull
if errorlevel 1 (
    echo.
    echo ERRO: Falha ao executar git pull.
    echo Verifique sua conexao ou se ha conflitos pendentes.
    pause
    exit /b 1
)
echo.

echo [2/3] Verificando dependencias...
call npm install
if errorlevel 1 (
    echo.
    echo ERRO: Falha ao instalar dependencias com npm install.
    pause
    exit /b 1
)
echo.

echo [3/3] Iniciando servidor...
echo.
echo ============================================
echo   Servidor disponivel em http://localhost:3000
echo   Pressione Ctrl+C para parar o servidor
echo ============================================
echo.
call npm start

pause
