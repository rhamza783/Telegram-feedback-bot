#!/bin/bash
# Coded by 7ife

# Load environment variables from a .env file if present
load_env() {
    if [ -f .env ]; then
        export $(cat .env | xargs)
    fi
}

# Install Node.js and npm if not already installed
install_node() {
    echo "Checking for Node.js and npm..."
    if ! command -v node > /dev/null 2>&1; then
        echo "Installing Node.js..."
        apt update && apt install -y nodejs
    else
        echo "Node.js is already installed."
    fi
}

# Start the bot and redirect output to a log file
start_bot() {
    echo "Starting the Telegram bot..."
    npm start >> bot.log 2>&1 &
}

# Handle graceful shutdown
shutdown() {
    echo "Stopping the bot..."
    # Insert any cleanup commands here
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM signals for graceful shutdown
trap shutdown SIGINT SIGTERM

# Display custom ASCII art and author information
clear
echo "Your ASCII art here"
echo ""
echo "Github: https://github.com/yourusername"
echo "E-mail: youremail@example.com"
echo ""

# Install Node.js and Telegraf
echo "Installing NodeJS and Telegraf..."
install_node
npm install -g telegraf
echo "Installation successful"
sleep 2

# Prompt user for bot token and replace in index.js
read -p "Enter <bot_token> received from @BotFather >>> " botToken
if [[ "$botToken" != "" ]]; then
    sed -i "s/YOUR_TOKEN/$botToken/gi" index.js
    echo "Token replaced successfully"
fi

# Prompt user for admin ID and replace in index.js
read -p "Enter Telegram ID (use @userinfobot to get it) >>> " adminId
if [[ "$adminId" != "" ]]; then
    sed -i "s/123456789/$adminId/gi" index.js
    echo "Admin ID replaced successfully"
fi

# Install project dependencies
echo "Installing dependencies..."
npm install
echo "Dependencies installed"
sleep 1

# Start the bot
start_bot

# Keep the script running indefinitely
while true; do
    sleep 5
done

