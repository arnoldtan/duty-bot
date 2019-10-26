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
	cd_str = days[cd.getDay()].toString() + " " + cd.getDate().toString() + "/" + (cd.getMonth()+1).toString() + "/" + cd.getFullYear().toString()
	cd_arr.push({
		text: cd_str,
		callback_data: cd_str
	});
	calendar.push(cd_arr);
}

bot.onText(/\/calendar/, (msg) => {	
  bot.sendMessage(msg.chat.id, "Pick your free dates", {
		"reply_markup": {
		  "inline_keyboard": calendar
		}
	});    
});

bot.on("callback_query", (callback_query) => {
	const data = callback_query.data;
  bot.answerCallbackQuery(callback_query.id, "You picked " + data);
})