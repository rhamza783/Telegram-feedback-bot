const { Telegraf } = require('telegraf');
require('dotenv').config();
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = process.env.OWNER_ID; // Bot owner's Telegram ID
const userIDsFile = 'user_ids.txt'; // File to store user IDs

// Load existing user IDs from the file (if any)
let userIDs = [];
if (fs.existsSync(userIDsFile)) {
    const data = fs.readFileSync(userIDsFile, 'utf8');
    userIDs = data.split('\n').filter((id) => id.trim() !== '');
}

// Register the /help command
bot.command('help', (ctx) => {
    ctx.reply('Hey, I am Hamza Younis. How can I assist you? Feel free to chat with me.');
});

// Register the /about command
bot.command('about', (ctx) => {
    ctx.reply('This is a Telegram bot created using Telegraf by Hamza Younis.');
});

// Register the /ping command with response time
bot.command('ping', async (ctx) => {
    // Send a "wait" message
    await ctx.reply('Calculating ping time... Please wait.');

    // Record the start timestamp
    const start = Date.now();

    // Simulate some processing time (you can adjust this as needed)
    await sleep(1000); // Example: 1 second delay

    // Calculate the response time
    const deltaPing = Date.now() - start;

    // Get the current uptime
    const uptime = process.uptime();

    // Send the ping and uptime information
    await ctx.reply(`🏓 Pong! Response time: ${deltaPing}ms\nUptime: ${formatUptime(uptime)}`);
});

// Helper function to format uptime
function formatUptime(seconds) {
    // ... (your existing formatUptime function)
}

// Helper function to simulate processing time
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to forward messages from users to the owner
bot.on('text', (ctx) => {
    if (ctx.from.id.toString() !== ownerId) {
        console.log(`Forwarding message from ${ctx.from.id} to owner.`);
        ctx.telegram.forwardMessage(ownerId, ctx.from.id, ctx.message.message_id)
            .then((forwardedMessage) => {
                console.log(`Message forwarded to owner with message ID: ${forwardedMessage.message_id}`);
                // Store the mapping of the forwarded message to the original sender's ID
                userIDs.push(ctx.from.id.toString());
                fs.writeFileSync(userIDsFile, userIDs.join('\n'));
            })
            .catch((error) => {
                console.error('Error forwarding message:', error);
                ctx.reply('There was an error sending your message. Please try again later.');
            });
    }
});

// Register the /broadcast command
bot.command('broadcast', (ctx) => {
    const broadcastMessage = 'Hello, this is a broadcast message from your bot!'; // Set your desired broadcast message
    userIDs.forEach((userID) => {
        ctx.telegram.sendMessage(userID, broadcastMessage)
            .catch((error) => {
                console.error(`Error sending broadcast message to user ID: ${userID}`, error);
            });
    });
    ctx.reply('Broadcast sent to all users.');
});

// Start polling
bot.launch();
