const TelegramBot = require('node-telegram-bot-api');
const token = '1007279553:AAFkoRTwYuYQ4bs8nxo7ANX-Fd30uPGvyWg';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, "Hello World");    
});