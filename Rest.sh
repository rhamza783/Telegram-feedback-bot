#!/bin/bash
# Coded by rhamza783

# Load environment variables from a .env file if present
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Clear the terminal
clear

# Display custom ASCII art and author information
echo "
 _        ___ ______  __  _____     ______   ____  _      __  _      ____  ____         ___  ____    ____  _      ____ _____ __ __     
| |      /  _]      ||  |/ ___/    |      | /    || |    |  |/ ]    |    ||    \       /  _]|    \  /    || |    |    / ___/|  |  |    
| |     /  [_|      ||_ (   \_     |      ||  o  || |    |  ' /      |  | |  _  |     /  [_ |  _  ||   __|| |     |  (   \_ |  |  |    
| |___ |    _]_|  |_|  \|\__  |    |_|  |_||     || |___ |    \      |  | |  |  |    |    _]|  |  ||  |  || |___  |  |\__  ||  _  |    
|     ||   [_  |  |      /  \ |      |  |  |  _  ||     ||     \     |  | |  |  |    |   [_ |  |  ||  |_ ||     | |  |/  \ ||  |  |    
|     ||     | |  |      \    |      |  |  |  |  ||     ||  .  |     |  | |  |  |    |     ||  |  ||     ||     | |  |\    ||  |  |    
|_____||_____| |__|       \___|      |__|  |__|__||_____||__|\_|    |____||__|__|    |_____||__|__||___,_||_____||____|\___||__|__|    
                                                                                                                                       
"
echo ""
echo "Github: https://github.com/rhamza783"
echo "E-mail: rhamza783@example.com"
echo ""

# Start the bot and redirect output to a log file
echo "Starting the Telegram bot..."
npm start >> bot.log 2>&1 &

# Function to handle graceful shutdown
function shutdown() {
    echo "Stopping the bot..."
    # Insert any cleanup commands here
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM signals for graceful shutdown
trap shutdown SIGINT SIGTERM

# Keep the script running indefinitely
while true; do
    sleep 5
done
