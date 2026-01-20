#!/bin/bash
# Create Desktop Shortcut for Monster Mane
# This script creates a .desktop file on your desktop to launch the game

echo "========================================"
echo "  Creating Desktop Shortcut"
echo "========================================"
echo ""

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Determine desktop location
if [ -d "$HOME/Desktop" ]; then
    DESKTOP_DIR="$HOME/Desktop"
elif [ -d "$HOME/Escritorio" ]; then
    DESKTOP_DIR="$HOME/Escritorio"
else
    echo "ERROR: Could not find Desktop directory"
    echo "Please manually create a shortcut to $SCRIPT_DIR/launch_game.sh"
    read -p "Press Enter to exit..."
    exit 1
fi

# Create the .desktop file
DESKTOP_FILE="$DESKTOP_DIR/monster-mane.desktop"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Monster Mane
Comment=3D Fighting Game
Exec=bash "$SCRIPT_DIR/launch_game.sh"
Path=$SCRIPT_DIR
Icon=applications-games
Terminal=false
Categories=Game;
EOF

# Make it executable
chmod +x "$DESKTOP_FILE"

# On some systems, need to trust the launcher
if command -v gio &> /dev/null; then
    gio set "$DESKTOP_FILE" metadata::trusted true 2>/dev/null
fi

# For GNOME desktop, mark as trusted
if [ -f "$DESKTOP_FILE" ]; then
    chmod +x "$DESKTOP_FILE"
fi

echo ""
echo "SUCCESS: Desktop shortcut created!"
echo ""
echo "Location: $DESKTOP_FILE"
echo ""
echo "You can now double-click 'Monster Mane' on your desktop to play."
echo ""
echo "Note: On some systems, you may need to:"
echo "  - Right-click the icon and select 'Allow Launching'"
echo "  - Or mark it as trusted in your file manager"
echo ""
read -p "Press Enter to exit..."
