@echo off
REM Reset PostgreSQL password for postgres user
REM Run this as Administrator

echo Stopping PostgreSQL service...
net stop postgresql-x64-18

timeout /t 2

echo Resetting postgres user password...
cd "C:\Program Files\PostgreSQL\18\bin"

REM Connect and reset password
psql.exe -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"

timeout /t 2

echo Starting PostgreSQL service...
net start postgresql-x64-18

echo.
echo Done! PostgreSQL password has been reset to 'postgres'
pause
