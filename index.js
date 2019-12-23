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
			ad: new Set()
		});
		bot.sendMessage(msg.chat.id, "Welcome " + match[1] + "!");
		console.log(db);
	} else bot.sendMessage(msg.chat.id, "You have already joined");
});

bot.onText(/\/leave/, (msg) => {
	db.delete(msg.from.id);
	bot.sendMessage(msg.chat.id, "You have left. ORD loh!");
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
	cur.ad.add(data);
	db.set(callback_query.from.id, cur);
  bot.answerCallbackQuery(callback_query.id, "You picked " + data);
  console.log(db);
})

bot.onText(/\/roster/, (msg) => {
	var roster = "";
	var it = db.values();
	for(var i = 0; i<db.size; i++){
		roster = roster.concat(it.next().value.name + "\n");
	}
	bot.sendMessage(msg.chat.id, "Here is the roster:\n" + roster);{
	}
});

bot.onText(/^\/check (\d{1,2})\/(\d{1,2})\/(\d{4})$/, (msg, match) => {
	var it = db.values();
	var date = "";
	date = date.concat(msg.text.replace("/check ",""));
	var fulldate = new Date(match[2] + "/" + match[1] + "/" + match[3]);
	fulldate = days[fulldate.getDay()];
	fulldate = fulldate.concat(" ");
	fulldate = fulldate.concat(date);
	bot.sendMessage(msg.chat.id, fulldate);
	for(var i = 0; i<db.size; i++){
		var user = it.next().value;
		if(user.ad.has(fulldate)){
			bot.sendMessage(msg.chat.id, user.name);
		}
	}
});

bot.onText(/\/duty/, (msg) => {
	bot.sendMessage(msg.chat.id, "Here is the duty roster for the month:");
	var it = db.values();
	var text = "";
	for(var i = 0; i<db.size; i++){
		var user = it.next().value;
		for (var it2 = user.ad.values(), val= null; val=it2.next().value; ) {
		var line = val;
		line = line.concat(": " +user.name + "\n");
    	text = text.concat(line);
        }
	}
	bot.sendMessage(msg.chat.id, text);
});
