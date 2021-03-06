const TelegramBot = require('node-telegram-bot-api');
const token = require('./token.js').TOKEN;

const bot = new TelegramBot(token, {polling: true});

var db = new Map();

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var today = new Date();
var calendar = [[{ text: months[today.getMonth()], callback_data: "X" }],
				[{ text: "S", callback_data: "X"},
				 { text: "M", callback_data: "X"},
				 { text: "T", callback_data: "X"},
				 { text: "W", callback_data: "X"},
				 { text: "T", callback_data: "X"},
				 { text: "F", callback_data: "X"},
				 { text: "S", callback_data: "X"}]];
var lastDateOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
var lengthOfMonth = lastDateOfMonth.getDate();
var firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
var firstDayOfMonth = firstDateOfMonth.getDay();
var lastDayOfMonth = lastDateOfMonth.getDay();
var dutylist = [];
for(var i=0; i<lengthOfMonth; ++i) dutylist.push('');
var month = [];

calendar.push([]);
for(var i=0; i<firstDayOfMonth; ++i) calendar[2].push({ text: " ", callback_data: "X"});
for(var d=1; d<=lengthOfMonth; ++d) {
	var cur = firstDayOfMonth + d;
	var row = Math.ceil(cur / 7);
	if(calendar.length < 2 + row) calendar.push([]);
	var cd = new Date(today.getFullYear(), today.getMonth(), d, 8);
	var cd_str = days[cd.getDay()].toString() + " " + cd.getDate().toString() + "/" + (cd.getMonth()+1).toString() + "/" + cd.getFullYear().toString()
	calendar[row + 1].push({ text: d.toString(), callback_data: cd_str });
	month.push(cd_str);
}
for(var i=lastDayOfMonth+1; i<7; ++i) calendar[calendar.length-1].push({ text: " ", callback_data: "X"});

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
	if(data === "X") bot.answerCallbackQuery(callback_query.id, "Invalid Selection");
	else {
		var cur = db.get(callback_query.from.id);
		var day = data.split(" ")[1].split("/")[0];
		dutylist[Number(day)-1] = cur.name;
		cur.ad.add(data);
		db.set(callback_query.from.id, cur);
		bot.answerCallbackQuery(callback_query.id, "You picked " + data);
		console.log(db);
	}
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
	var text = "";
	for(var i=0; i<lengthOfMonth; ++i){
		text = text.concat(month[i] + ": ");
				if(dutylist[i] == ""){
			text = text.concat("Not assigned" + "\n");
		}
		else{
			text = text.concat(dutylist[i] + "\n");
		}
		text = text.concat("\n");
	} 
	bot.sendMessage(msg.chat.id, text);
});
