const TelegramBot = require('node-telegram-bot-api');
const token = '1007279553:AAFkoRTwYuYQ4bs8nxo7ANX-Fd30uPGvyWg';

const bot = new TelegramBot(token, {polling: true});

console.log(new Date(2019, 9, 2));
var calendar = [];
var today = new Date();
var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
var lengthOfMonth = lastDayOfMonth.getDate();
console.log(lengthOfMonth);
for(var d=1; d<=lengthOfMonth; ++d) {
	cd_arr = [];
	var cd = new Date(today.getFullYear(), today.getMonth(), d);
	cd_arr.push(cd);
	calendar.push(cd_arr);
}

bot.onText(/\/calendar/, (msg) => {	
  bot.sendMessage(msg.chat.id, "Pick your free dates", {
		"reply_markup": {
		  "keyboard": calendar
		}
	});    
});

bot.onText(/\d{1,2}/g, (msg) => {
	console.log(msg.from.id);
	bot.sendMessage(msg.chat.id, "You have chosen " + msg.text);
});