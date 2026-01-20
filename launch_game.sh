#!/bin/bash
# Monster Mane - 3D Fighting Game Launcher for Linux/Mac
# Make executable with: chmod +x launch_game.sh
# Then double-click or run: ./launch_game.sh

echo "========================================"
echo "  Monster Mane - 3D Fighting Game"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python 3.12 or higher"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "Checking dependencies..."
if ! python3 -c "import ursina" 2>/dev/null; then
    echo "Installing game dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        echo ""
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

echo ""
echo "Launching game..."
echo ""
python3 fighting_game.py

if [ $? -ne 0 ]; then
    echo ""
    echo "Game exited with an error."
    read -p "Press Enter to exit..."
fi
