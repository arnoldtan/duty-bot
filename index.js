const TelegramBot = require('node-telegram-bot-api');
const token = require('./token.js').TOKEN;

const bot = new TelegramBot(token, {polling: true});

var db = new Map();

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

bot.onText(/\/join (.+)/, (msg, match) => {
	if(db.get(msg.from.id) === undefined) {
		db.set(msg.from.id, {
			name: match[1],
			ad: []
		});
		bot.sendMessage(msg.chat.id, "Welcome " + match[1] + "!");
	} else bot.sendMessage(msg.chat.id, "You have already joined");
});

bot.onText(/\/leave/, (msg) => {
	db.delete(msg.from.id);
	bot.sendMessage(msg.chat.id, "ORD loh!");
	bot.kickChatMember(msg.chat.id, msg.from.id);
});

bot.onText(/\/calendar/, (msg) => {	
	bot.sendMessage(msg.chat.id, "Pick your free dates", {
		"reply_markup": {
		  "inline_keyboard": calendar
		}
	}); 
});

bot.on("callback_query", (callback_query) => {
	const data = callback_query.data;
	var cur = db.get(callback_query.from.id);
	cur.ad.push(data);
	db.set(callback_query.from.id, cur);
  bot.answerCallbackQuery(callback_query.id, "You picked " + data);
  console.log(db);
})