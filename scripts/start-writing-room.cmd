@echo off
rem Onseosa writing room. The desktop shortcut runs this file.
rem
rem   start-writing-room.cmd           real manuscripts  (%USERPROFILE%\OnseosaData,        ports 3004 / 5173)
rem   start-writing-room.cmd test      test store        (%USERPROFILE%\OnseosaData-test,   ports 3014 / 5183)
rem   start-writing-room.cmd review    review store      (%USERPROFILE%\OnseosaData-review, ports 3034 / 5203)
rem
rem The work is done by scripts\start-writing-room.mjs. It opens the browser only when the
rem manuscript server and the screen both answer for the expected manuscript folder.
rem It never stops another program that holds a port; it explains and waits for a key instead.
setlocal
chcp 65001 >nul
cd /d "%~dp0.."
node scripts\start-writing-room.mjs %*
set "RC=%errorlevel%"
if not "%RC%"=="0" (
  echo.
  pause
)
endlocal & exit /b %RC%
