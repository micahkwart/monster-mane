@echo off
REM Monster Mane - 3D Fighting Game Launcher for Windows
REM Double-click this file to launch the game

echo ========================================
echo   Monster Mane - 3D Fighting Game
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.12 or higher from python.org
    echo.
    pause
    exit /b 1
)

echo Checking dependencies...
pip show ursina >nul 2>&1
if errorlevel 1 (
    echo Installing game dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Launching game...
echo.
python fighting_game.py

if errorlevel 1 (
    echo.
    echo Game exited with an error.
    pause
)
