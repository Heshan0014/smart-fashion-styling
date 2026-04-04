@echo off
REM Password Reset Email Configuration Setup Script for Windows
REM This script helps set up email credentials for the password reset feature

echo.
echo ====================================
echo Password Reset Email Setup
echo ====================================
echo.
echo Which email service do you want to use?
echo 1. Gmail (Recommended for development)
echo 2. SendGrid (Recommended for production)
echo 3. Manual/Custom SMTP
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto setup_gmail
if "%choice%"=="2" goto setup_sendgrid
if "%choice%"=="3" goto setup_custom
if "%choice%"=="4" goto exit
echo Invalid choice. Please run again.
goto exit

:setup_gmail
echo.
echo ====== Gmail Configuration ======
echo Before proceeding, ensure you have:
echo 1. Enabled 2-Factor Authentication on your Gmail account
echo 2. Generated an App Password at myaccount.google.com/apppasswords
echo 3. Have your 16-character app password ready
echo.

set /p gmail_email="Enter your Gmail email address: "
set /p gmail_password="Enter your 16-character App Password (no spaces): "
set /p frontend_url="Enter Frontend URL (default: http://localhost:3000): "

if "%frontend_url%"=="" set frontend_url=http://localhost:3000

REM Set environment variables
setx MAIL_USERNAME "%gmail_email%"
setx MAIL_PASSWORD "%gmail_password%"
setx FRONTEND_URL "%frontend_url%"
setx RESET_TOKEN_EXPIRY 60

cls
echo.
echo ====== Configuration Complete ======
echo.
echo The following environment variables have been set:
echo MAIL_USERNAME=%gmail_email%
echo MAIL_PASSWORD=****hidden****
echo FRONTEND_URL=%frontend_url%
echo RESET_TOKEN_EXPIRY=60
echo.
echo IMPORTANT: You must restart your command prompt and backend application
echo for the changes to take effect!
echo.
echo Email configuration is complete. The backend will use these credentials
echo to send password reset emails via Gmail SMTP.
echo.
pause
goto exit

:setup_sendgrid
echo.
echo ====== SendGrid Configuration ======
echo Before proceeding, ensure you have:
echo 1. Created a SendGrid account (sendgrid.com)
echo 2. Created an API Key with Full Access
echo 3. Verified your sender email domain
echo.

set /p sendgrid_api="Enter your SendGrid API Key (starts with SG.): "
set /p sender_email="Enter your verified sender email address: "
set /p frontend_url="Enter Frontend URL (default: http://localhost:3000): "

if "%frontend_url%"=="" set frontend_url=http://localhost:3000

REM Set environment variables
setx MAIL_USERNAME "apikey"
setx MAIL_PASSWORD "%sendgrid_api%"
setx MAIL_FROM "%sender_email%"
setx FRONTEND_URL "%frontend_url%"
setx RESET_TOKEN_EXPIRY 60

cls
echo.
echo ====== Configuration Complete ======
echo.
echo The following environment variables have been set:
echo MAIL_USERNAME=apikey
echo MAIL_PASSWORD=****hidden****
echo MAIL_FROM=%sender_email%
echo FRONTEND_URL=%frontend_url%
echo RESET_TOKEN_EXPIRY=60
echo.
echo IMPORTANT: You must restart your command prompt and backend application
echo for the changes to take effect!
echo.
echo Note: Also update application.yml SMTP host to: smtp.sendgrid.net
echo Port: 587
echo.
pause
goto exit

:setup_custom
echo.
echo ====== Custom SMTP Configuration ======
echo.

set /p smtp_host="Enter SMTP host (e.g., smtp.yourprovider.com): "
set /p smtp_port="Enter SMTP port (default: 587): "
set /p smtp_user="Enter SMTP username: "
set /p smtp_pass="Enter SMTP password: "
set /p sender_email="Enter sender email address: "
set /p frontend_url="Enter Frontend URL (default: http://localhost:3000): "

if "%smtp_port%"=="" set smtp_port=587
if "%frontend_url%"=="" set frontend_url=http://localhost:3000

REM Set environment variables
setx MAIL_HOST "%smtp_host%"
setx MAIL_PORT "%smtp_port%"
setx MAIL_USERNAME "%smtp_user%"
setx MAIL_PASSWORD "%smtp_pass%"
setx MAIL_FROM "%sender_email%"
setx FRONTEND_URL "%frontend_url%"
setx RESET_TOKEN_EXPIRY 60

cls
echo.
echo ====== Configuration Complete ======
echo.
echo The following environment variables have been set:
echo MAIL_HOST=%smtp_host%
echo MAIL_PORT=%smtp_port%
echo MAIL_USERNAME=%smtp_user%
echo MAIL_PASSWORD=****hidden****
echo MAIL_FROM=%sender_email%
echo FRONTEND_URL=%frontend_url%
echo RESET_TOKEN_EXPIRY=60
echo.
echo IMPORTANT: You must restart your command prompt and backend application
echo for the changes to take effect!
echo.
pause
goto exit

:exit
echo Thank you for using the Password Reset Email Setup!
