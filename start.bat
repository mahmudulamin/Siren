@echo off
echo ========================================
echo    SIREN - Quick Start Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo Starting development server...
echo.
echo Local address:   http://localhost:3000
echo Network address: http://YOUR-PC-IP:3000
echo Find YOUR-PC-IP by running: ipconfig
echo.
echo Demo Credentials:
echo   Victim: victim@example.com / password
echo   Volunteer: volunteer@example.com / password
echo   Official: admin@example.com / password
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
