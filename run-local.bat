@echo off
echo ========================================================
echo   Starting Zerodha Kite Clone with Groq AI (Local)
echo   MongoDB + Backend + Dashboard + Frontend
echo ========================================================
echo.

echo [0/4] Starting MongoDB Service...
net start MongoDB 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB service not found. Trying to start mongod directly...
    if exist "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" (
        start "MongoDB" "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath="C:\data\db" --logpath="C:\data\logs\mongod.log"
    )
)
timeout /t 2 /nobreak > nul

echo [1/4] Launching Backend Server on port 3002...
start "Kite Backend (Port 3002)" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo [2/4] Launching Trading Dashboard on port 3000...
start "Kite Dashboard (Port 3000)" cmd /k "cd dashboard && npm start"

timeout /t 2 /nobreak > nul

echo [3/4] Launching Frontend Landing Page on port 3001...
start "Kite Frontend (Port 3001)" cmd /k "cd frontend && npm start"

echo.
echo ========================================================
echo All services launched!
echo - MongoDB:       http://localhost:27017
echo - Backend API:   http://localhost:3002
echo - Kite Dashboard: http://localhost:3000
echo - Landing Page:  http://localhost:3001
echo ========================================================
echo.
echo (Press any key to close this launcher window...)
pause > nul
