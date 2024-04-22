// Connecting modules
const Telegraf = require('telegraf');
const fs = require('fs'); // File system module for logging

// General settings
let config = {
    "token": "YOUR_TOKEN", // Bot token
    "admin": 123456789 // bot owner id (replace with actual ID)
};
const CHAT_ID = 123456789; // bot owner id (replace with actual ID)

// Creating a bot object
const bot = new Telegraf(config.token);

// Function to create a hidden link
function getHiddenLink(url, parse_mode = "markdown") {
    const emptyChar = "‎";
    switch (parse_mode) {
        case "HTML":
            return `<a href="${url}">${emptyChar}</a>`;
        default:
            throw new Error("invalid parse_mode");
    }
}

// Message to confirm successful installation
bot.telegram.sendMessage(
    CHAT_ID,
    `
    <b>Great, you have successfully installed a feedback bot!</b>
    ${getHiddenLink("https://your-link.com/image.png", "HTML")}
    `,
    { parse_mode: "HTML" }
);

// Text Settings
let replyText = {
    "helloAdmin": "Now share your bot and wait for messages.",
    "helloUser": "Greetings, send me a message. I will try to answer as soon as possible.",
    "replyWrong": "Please use the Reply function to reply to the user's message directly.",
    "help": "Here are the commands you can use: /feedback, /report, /help",
    "feedback": "Thank you for your feedback!",
    "report": "Your report has been recorded. We will look into it shortly."
};

// Checking the user's rights
let isAdmin = (userId) => {
    return userId == config.admin;
};

// Function to log messages
function logMessage(message) {
    fs.appendFile('bot.log', message + '\n', (err) => {
        if (err) throw err;
    });
}

// We redirect the admin from the user or notify the admin about the error
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
        logMessage(`Message from ${ctx.from.id}: ${ctx.message.text}`);
    }
};

// Bot Start
bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id) ? replyText.helloAdmin : replyText.helloUser);
    logMessage(`Start command used by ${ctx.from.id}`);
});

// Command handlers
bot.command('help', (ctx) => ctx.reply(replyText.help));
bot.command('feedback', (ctx) => {
    ctx.reply(replyText.feedback);
    logMessage(`Feedback from ${ctx.from.id}: ${ctx.message.text}`);
});
bot.command('report', (ctx) => {
    ctx.reply(replyText.report);
    logMessage(`Report from ${ctx.from.id}: ${ctx.message.text}`);
});

// Listening for the presence of the message object
bot.on('message', (ctx) => {
    if (ctx.message.reply_to_message && ctx.message.reply_to_message.forward_from && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    } else {
        forwardToAdmin(ctx);
    }
});

// bot launch
bot.launch()
    .then(() => console.log("Bot Launched"))
    .catch(console.error);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
