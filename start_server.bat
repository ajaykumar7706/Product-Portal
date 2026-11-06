@echo off
title Products Management Server - Talari Ajay Kumar (24ATAO5332)
color 0B

echo ========================================================
echo   PRODUCTS MANAGEMENT SYSTEM - WEB TECHNOLOGY LAB
echo   Developer: Talari Ajay Kumar (Roll No: 24ATAO5332)
echo   Topic: 4. Products (Product ID, Product Name, Product Price)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Checking dependencies (npm install)...
if not exist "node_modules\" (
    echo Installing required packages (express, mysql2, cors, body-parser)...
    call npm install
) else (
    echo Dependencies already installed!
)

echo.
echo [3/3] Starting backend server (app.js)...
echo Server will run at: http://localhost:3000
echo.

start http://localhost:3000

node app.js
pause
