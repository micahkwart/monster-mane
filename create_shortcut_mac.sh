#!/bin/bash
# Create Desktop Shortcut for Monster Mane (macOS)
# This script creates an alias on your desktop to launch the game

echo "========================================"
echo "  Creating Desktop Shortcut"
echo "========================================"
echo ""

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check for Desktop
DESKTOP_DIR="$HOME/Desktop"
if [ ! -d "$DESKTOP_DIR" ]; then
    echo "ERROR: Could not find Desktop directory at $DESKTOP_DIR"
    echo "Please manually create a shortcut to $SCRIPT_DIR/launch_game.sh"
    read -p "Press Enter to exit..."
    exit 1
fi

# Create an alias to the launcher script
LAUNCHER="$SCRIPT_DIR/launch_game.sh"
SHORTCUT="$DESKTOP_DIR/Monster Mane"

# Use AppleScript to create an alias
osascript <<EOF
tell application "Finder"
    try
        set sourceFile to POSIX file "$LAUNCHER" as alias
        set desktopFolder to POSIX file "$DESKTOP_DIR" as alias
        make new alias file at desktopFolder to sourceFile with properties {name:"Monster Mane"}
        return "success"
    on error errMsg
        return "error: " & errMsg
    end try
end tell
EOF

RESULT=$?

echo ""
if [ $RESULT -eq 0 ]; then
    echo "SUCCESS: Desktop shortcut created!"
    echo ""
    echo "You can now double-click 'Monster Mane' on your desktop to play."
else
    echo "Could not create alias automatically."
    echo ""
    echo "To create a shortcut manually:"
    echo "1. Right-click on launch_game.sh"
    echo "2. Select 'Make Alias'"
    echo "3. Drag the alias to your Desktop"
    echo "4. Rename it to 'Monster Mane'"
fi
echo ""
read -p "Press Enter to exit..."
