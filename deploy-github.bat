@echo off
echo ========================================
echo   GitHub Pages Deployment Script
echo   A^&R Mood Sync
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Run installer with default settings
    echo 3. Restart PowerShell
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking package.json configuration...
findstr /C:"YOUR-GITHUB-USERNAME" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: You need to update package.json first!
    echo.
    echo 1. Open: package.json
    echo 2. Find: "homepage": "https://YOUR-GITHUB-USERNAME.github.io/mood-sync"
    echo 3. Replace YOUR-GITHUB-USERNAME with your actual GitHub username
    echo.
    echo Example: "homepage": "https://johnsmith.github.io/mood-sync"
    echo.
    pause
    exit /b 1
)

echo [2/6] Building production version...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [3/6] Creating SPA 404 fallback...
copy /Y build\index.html build\404.html >nul
if errorlevel 1 (
    echo WARNING: Could not copy 404 fallback
)

echo [4/6] Checking Git repository...
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - MoodSync PWA"
    echo.
    echo ========================================
    echo   Repository initialized!
    echo ========================================
    echo.
    echo NEXT STEPS:
    echo.
    echo 1. Create a new repository on GitHub:
    echo    - Go to: https://github.com/new
    echo    - Name: mood-sync
    echo    - Keep it PUBLIC
    echo    - DO NOT initialize with README
    echo.
    echo 2. Link your repository:
    echo    git remote add origin https://github.com/YOUR-USERNAME/mood-sync.git
    echo    git push -u origin main
    echo.
    echo 3. Run this script again to deploy
    echo.
    pause
    exit /b 0
)

echo [5/6] Checking remote repository...
git remote -v | findstr origin >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No remote repository configured!
    echo.
    echo Please run:
    echo git remote add origin https://github.com/YOUR-USERNAME/mood-sync.git
    echo.
    pause
    exit /b 1
)

echo [6/6] Deploying to GitHub Pages...
call npm run deploy
if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo.
    echo Common fixes:
    echo 1. Make sure you've pushed to GitHub first: git push
    echo 2. Check your internet connection
    echo 3. Verify GitHub username in package.json
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Successful! 🎉
echo ========================================
echo.
echo Your app is being deployed to GitHub Pages.
echo.
echo It will be available in 2-3 minutes at:
git remote get-url origin >temp.txt
set /p REPO_URL=<temp.txt
del temp.txt
echo.
for /f "tokens=1,2 delims=:/" %%a in ("%REPO_URL%") do (
    for /f "tokens=1,2 delims=." %%c in ("%%b") do (
        echo https://%%c.github.io/mood-sync
    )
)
echo.
echo First time deployment?
echo 1. Go to: GitHub repo ^> Settings ^> Pages
echo 2. Source: gh-pages branch
echo 3. Click Save
echo.
echo To update later, just run this script again!
echo.
pause
