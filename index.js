const TelegramBot = require('node-telegram-bot-api');
const token = '1007279553:AAFkoRTwYuYQ4bs8nxo7ANX-Fd30uPGvyWg';

const bot = new TelegramBot(token, {polling: true});

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var calendar = [];
var today = new Date();
var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
var lengthOfMonth = lastDayOfMonth.getDate();
for(var d=1; d<=lengthOfMonth; ++d) {
	cd_arr = [];
	var cd = new Date(today.getFullYear(), today.getMonth(), d, 8);
	cd_arr.push(days[cd.getDay()].toString() + " " + cd.getDate().toString() + "/" + (cd.getMonth()+1).toString() + "/" + cd.getFullYear().toString());
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