@echo off
echo ==========================================
echo    KHOI DONG DU AN FRONTEND + BACKEND
echo ==========================================
echo.

echo [1/3] Kiem tra tien trinh dang chay...
tasklist /FI "IMAGENAME eq java.exe" | findstr java.exe >nul
if %ERRORLEVEL% == 0 (
    echo - Backend co the dang chay roi
)

echo.
echo [2/3] Khoi dong Backend (Spring Boot)...
cd btl_ltw
start "Backend Server" cmd /k "echo Backend dang khoi dong... && .\mvnw.cmd spring-boot:run"
cd ..

echo.
echo [3/3] Cho 10 giay de Backend khoi dong...
timeout /t 10 /nobreak >nul

echo.
echo [4/3] Khoi dong Frontend (React + Vite)...
start "Frontend Server" cmd /k "echo Frontend dang khoi dong... && npm run dev"

echo.
echo ==========================================
echo    CAC SERVER DANG CHAY:
echo    - Backend:  http://localhost:8080
echo    - Frontend: http://localhost:5173
echo ==========================================
echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
