@echo off
REM Create Desktop Shortcut for Monster Mane
REM This script creates a shortcut on your desktop to launch the game

echo ========================================
echo   Creating Desktop Shortcut
echo ========================================
echo.

REM Get the current directory
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

REM Create VBS script to make the shortcut
set VBS_FILE=%TEMP%\create_shortcut.vbs
echo Set oWS = WScript.CreateObject("WScript.Shell") > %VBS_FILE%
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\Monster Mane.lnk" >> %VBS_FILE%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %VBS_FILE%
echo oLink.TargetPath = "%SCRIPT_DIR%\launch_game.bat" >> %VBS_FILE%
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> %VBS_FILE%
echo oLink.Description = "Monster Mane - 3D Fighting Game" >> %VBS_FILE%
echo oLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,14" >> %VBS_FILE%
echo oLink.Save >> %VBS_FILE%

REM Run the VBS script
cscript //nologo %VBS_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS: Desktop shortcut created!
    echo.
    echo You can now double-click "Monster Mane" on your desktop to play.
) else (
    echo.
    echo ERROR: Failed to create desktop shortcut
    echo You can manually create a shortcut to launch_game.bat
)

echo.
pause
