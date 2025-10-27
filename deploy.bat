@echo off
echo ========================================
echo   A^&R Mood Sync - Quick Deploy
echo ========================================
echo.

echo Building frontend...
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Your app is now ready to deploy.
echo.
echo NEXT STEPS:
echo.
echo 1. To test locally:
echo    - Run: start-server.bat
echo    - Open: http://localhost:4000
echo.
echo 2. To deploy online (FREE):
echo    A) Render.com (Recommended - All-in-One)
echo       - Visit: https://render.com
echo       - Sign up
echo       - New Web Service
echo       - Build: npm install ^&^& npm run build
echo       - Start: cd server ^&^& node index.js
echo.
echo    B) Vercel (Fastest)
echo       - Run: npm install -g vercel
echo       - Run: vercel
echo.
echo 3. After deployment, users can install as app:
echo    - iPhone: Safari ^> Share ^> Add to Home Screen
echo    - Android: Chrome ^> Menu ^> Install App
echo.
echo See DEPLOYMENT.md for detailed instructions!
echo.
pause
