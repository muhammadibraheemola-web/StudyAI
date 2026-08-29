@echo off
title StudyAI Launcher

echo ==========================
echo Starting StudyAI Backend...
echo ==========================
start cmd /k "cd backend && npm start"

timeout /t 3 >nul

echo ==========================
echo Starting Expo...
echo ==========================
start cmd /k "npm start"

exit