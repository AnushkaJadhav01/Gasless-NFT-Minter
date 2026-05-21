@echo off
REM Gasless NFT Minter - Quick Start Installation (Windows)
REM This script sets up the frontend with all fixes applied

setlocal enabledelayedexpansion

echo ==================================================
echo Gasless NFT Minter - Quick Start Setup (Windows)
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo + Node.js version: %NODE_VER%
echo + npm version: %NPM_VER%
echo.

REM Navigate to frontend
cd /d "%~dp0frontend" || exit /b 1
echo + Working directory: %cd%
echo.

REM Clean installation
echo - Cleaning previous installation...
if exist "node_modules" rmdir /s /q "node_modules" 2>nul
if exist "package-lock.json" del /q "package-lock.json" 2>nul
call npm cache clean --force

echo.
echo + Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo X Installation failed! Check the error messages above.
    pause
    exit /b 1
)

echo.
echo + Installation complete!
echo.

echo ==================================================
echo Next Steps:
echo ==================================================
echo.
echo 1. Set up environment variables:
echo    - Copy .env.example to .env (if available)
echo    - Update VITE_WALLETCONNECT_PROJECT_ID
echo    - Update VITE_UGF_API_KEY
echo    - Update VITE_CONTRACT_ADDRESS
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo ==================================================
echo.
pause
