@echo off
title ONSEOSA Studio

:: Start Paper Clip server
echo Starting Paper Clip...
start /min cmd /c "npx paperclipai run"

:: Wait for Paper Clip to boot
timeout /t 5 /nobreak >nul

:: Start Control Room dev server
echo Starting Control Room...
cd /d C:\Users\njell\onseosa-agent
start /min cmd /c "pnpm dev:ui"

:: Wait for Vite to boot
timeout /t 5 /nobreak >nul

:: Open Control Room in Chrome app mode (no browser bar)
echo Opening ONS Studio...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:5173 --window-size=1400,900

echo ONSEOSA Studio is running.
echo Close this window to keep servers running in background.
