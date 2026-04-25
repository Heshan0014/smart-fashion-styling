#!/bin/bash

# Password Reset Email Configuration Setup Script for Linux/Mac
# This script helps set up email credentials for the password reset feature

echo ""
echo "===================================="
echo "Password Reset Email Setup"
echo "===================================="
echo ""
echo "Which email service do you want to use?"
echo "1. Gmail (Recommended for development)"
echo "2. SendGrid (Recommended for production)"
echo "3. Manual/Custom SMTP"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        setup_gmail
        ;;
    2)
        setup_sendgrid
        ;;
    3)
        setup_custom
        ;;
    4)
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run again."
        exit 1
        ;;
esac

setup_gmail() {
    echo ""
    echo "====== Gmail Configuration ======"
    echo "Before proceeding, ensure you have:"
    echo "1. Enabled 2-Factor Authentication on your Gmail account"
    echo "2. Generated an App Password at myaccount.google.com/apppasswords"
    echo "3. Have your 16-character app password ready"
    echo ""

    read -p "Enter your Gmail email address: " gmail_email
    read -sp "Enter your 16-character App Password (no spaces): " gmail_password
    echo ""
    read -p "Enter Frontend URL (default: http://localhost:3000): " frontend_url
    
    frontend_url=${frontend_url:-http://localhost:3000}

    # Add to .bashrc or .zshrc
    {
        echo 'export MAIL_USERNAME="'$gmail_email'"'
        echo 'export MAIL_PASSWORD="'$gmail_password'"'
        echo 'export FRONTEND_URL="'$frontend_url'"'
        echo 'export RESET_TOKEN_EXPIRY=60'
    } >> ~/.bashrc

    # Also add to current shell if using zsh
    if [ -n "$ZSH_VERSION" ]; then
        {
            echo 'export MAIL_USERNAME="'$gmail_email'"'
            echo 'export MAIL_PASSWORD="'$gmail_password'"'
            echo 'export FRONTEND_URL="'$frontend_url'"'
            echo 'export RESET_TOKEN_EXPIRY=60'
        } >> ~/.zshrc
    fi

    # Export for current session
    export MAIL_USERNAME="$gmail_email"
    export MAIL_PASSWORD="$gmail_password"
    export FRONTEND_URL="$frontend_url"
    export RESET_TOKEN_EXPIRY=60

    clear
    echo ""
    echo "====== Configuration Complete ======"
    echo ""
    echo "The following environment variables have been set:"
    echo "MAIL_USERNAME=$gmail_email"
    echo "MAIL_PASSWORD=****hidden****"
    echo "FRONTEND_URL=$frontend_url"
    echo "RESET_TOKEN_EXPIRY=60"
    echo ""
    echo "IMPORTANT: Open a new terminal window or run:"
    echo "source ~/.bashrc  (for bash)"
    echo "source ~/.zshrc   (for zsh)"
    echo ""
    echo "Then restart your backend application for changes to take effect!"
    echo ""
}

setup_sendgrid() {
    echo ""
    echo "====== SendGrid Configuration ======"
    echo "Before proceeding, ensure you have:"
    echo "1. Created a SendGrid account (sendgrid.com)"
    echo "2. Created an API Key with Full Access"
    echo "3. Verified your sender email domain"
    echo ""

    read -p "Enter your SendGrid API Key (starts with SG.): " sendgrid_api
    read -p "Enter your verified sender email address: " sender_email
    read -p "Enter Frontend URL (default: http://localhost:3000): " frontend_url

    frontend_url=${frontend_url:-http://localhost:3000}

    # Add to .bashrc or .zshrc
    {
        echo 'export MAIL_USERNAME="apikey"'
        echo 'export MAIL_PASSWORD="'$sendgrid_api'"'
        echo 'export MAIL_FROM="'$sender_email'"'
        echo 'export FRONTEND_URL="'$frontend_url'"'
        echo 'export RESET_TOKEN_EXPIRY=60'
    } >> ~/.bashrc

    # Also add to current shell if using zsh
    if [ -n "$ZSH_VERSION" ]; then
        {
            echo 'export MAIL_USERNAME="apikey"'
            echo 'export MAIL_PASSWORD="'$sendgrid_api'"'
            echo 'export MAIL_FROM="'$sender_email'"'
            echo 'export FRONTEND_URL="'$frontend_url'"'
            echo 'export RESET_TOKEN_EXPIRY=60'
        } >> ~/.zshrc
    fi

    # Export for current session
    export MAIL_USERNAME="apikey"
    export MAIL_PASSWORD="$sendgrid_api"
    export MAIL_FROM="$sender_email"
    export FRONTEND_URL="$frontend_url"
    export RESET_TOKEN_EXPIRY=60

    clear
    echo ""
    echo "====== Configuration Complete ======"
    echo ""
    echo "The following environment variables have been set:"
    echo "MAIL_USERNAME=apikey"
    echo "MAIL_PASSWORD=****hidden****"
    echo "MAIL_FROM=$sender_email"
    echo "FRONTEND_URL=$frontend_url"
    echo "RESET_TOKEN_EXPIRY=60"
    echo ""
    echo "IMPORTANT: Open a new terminal window or run:"
    echo "source ~/.bashrc  (for bash)"
    echo "source ~/.zshrc   (for zsh)"
    echo ""
    echo "Note: Also update application.yml SMTP host to: smtp.sendgrid.net"
    echo "Port: 587"
    echo ""
}

setup_custom() {
    echo ""
    echo "====== Custom SMTP Configuration ======"
    echo ""

    read -p "Enter SMTP host (e.g., smtp.yourprovider.com): " smtp_host
    read -p "Enter SMTP port (default: 587): " smtp_port
    read -p "Enter SMTP username: " smtp_user
    read -sp "Enter SMTP password: " smtp_pass
    echo ""
    read -p "Enter sender email address: " sender_email
    read -p "Enter Frontend URL (default: http://localhost:3000): " frontend_url

    smtp_port=${smtp_port:-587}
    frontend_url=${frontend_url:-http://localhost:3000}

    # Add to .bashrc or .zshrc
    {
        echo 'export MAIL_HOST="'$smtp_host'"'
        echo 'export MAIL_PORT="'$smtp_port'"'
        echo 'export MAIL_USERNAME="'$smtp_user'"'
        echo 'export MAIL_PASSWORD="'$smtp_pass'"'
        echo 'export MAIL_FROM="'$sender_email'"'
        echo 'export FRONTEND_URL="'$frontend_url'"'
        echo 'export RESET_TOKEN_EXPIRY=60'
    } >> ~/.bashrc

    # Also add to current shell if using zsh
    if [ -n "$ZSH_VERSION" ]; then
        {
            echo 'export MAIL_HOST="'$smtp_host'"'
            echo 'export MAIL_PORT="'$smtp_port'"'
            echo 'export MAIL_USERNAME="'$smtp_user'"'
            echo 'export MAIL_PASSWORD="'$smtp_pass'"'
            echo 'export MAIL_FROM="'$sender_email'"'
            echo 'export FRONTEND_URL="'$frontend_url'"'
            echo 'export RESET_TOKEN_EXPIRY=60'
        } >> ~/.zshrc
    fi

    # Export for current session
    export MAIL_HOST="$smtp_host"
    export MAIL_PORT="$smtp_port"
    export MAIL_USERNAME="$smtp_user"
    export MAIL_PASSWORD="$smtp_pass"
    export MAIL_FROM="$sender_email"
    export FRONTEND_URL="$frontend_url"
    export RESET_TOKEN_EXPIRY=60

    clear
    echo ""
    echo "====== Configuration Complete ======"
    echo ""
    echo "The following environment variables have been set:"
    echo "MAIL_HOST=$smtp_host"
    echo "MAIL_PORT=$smtp_port"
    echo "MAIL_USERNAME=$smtp_user"
    echo "MAIL_PASSWORD=****hidden****"
    echo "MAIL_FROM=$sender_email"
    echo "FRONTEND_URL=$frontend_url"
    echo "RESET_TOKEN_EXPIRY=60"
    echo ""
    echo "IMPORTANT: Open a new terminal window or run:"
    echo "source ~/.bashrc  (for bash)"
    echo "source ~/.zshrc   (for zsh)"
    echo ""
    echo "Then restart your backend application for changes to take effect!"
    echo ""
}
