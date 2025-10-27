@echo off
echo ========================================
echo   GitHub Pages Setup Checker
echo ========================================
echo.

echo [✓] Checking Git installation...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [✗] Git is NOT installed
    echo     Download from: https://git-scm.com/download/win
    goto :end
) else (
    git --version
    echo [✓] Git is installed
)

echo.
echo [✓] Checking package.json configuration...
findstr /C:"YOUR-GITHUB-USERNAME" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [✗] Homepage URL needs updating!
    echo     Open package.json and replace YOUR-GITHUB-USERNAME
) else (
    echo [✓] Homepage URL is configured
)

echo.
echo [✓] Checking gh-pages package...
findstr /C:"gh-pages" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] gh-pages is installed
) else (
    echo [✗] gh-pages not found
    echo     Run: npm install --save-dev gh-pages
)

echo.
echo [✓] Checking vite.config.ts...
findstr /C:"base:" vite.config.ts >nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Base path is configured
) else (
    echo [✗] Base path needs configuration
)

echo.
echo [✓] Checking Git repository...
if exist .git (
    echo [✓] Git repository initialized
    git remote -v | findstr origin >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [✗] No remote repository linked
        echo     Need to add: git remote add origin [URL]
    ) else (
        echo [✓] Remote repository linked
        git remote get-url origin
    )
) else (
    echo [✗] Git repository not initialized
    echo     Run: git init
)

echo.
echo ========================================
echo   Setup Status Complete
echo ========================================
echo.
echo Ready to deploy? Run: deploy-github.bat
echo.

:end
pause
