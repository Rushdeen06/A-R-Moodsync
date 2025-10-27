@echo off
echo ========================================
echo   Starting A^&R Mood Sync Server
echo ========================================
echo.
cd /d "%~dp0\server"
node index.js
