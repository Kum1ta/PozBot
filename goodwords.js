  fs = require('fs');
  
  function replyMessage(author, goodwords) {

	// a = Math.random();
	let msg;

	if (Math.random() < 0.10)
		msg = (goodwords.shiny[Math.round(Math.random() * (goodwords.shiny.length - 1))]);
	else{
		fm = Math.random() < 0.5 ? goodwords.male : goodwords.female;
		msg = fm.formules[Math.round(Math.random() * (fm.formules.length - 1))] 
		msg += " " + fm.gw[Math.round(Math.random() * (fm.gw.length - 1))] + " " + author;
	}
	msg += " " + goodwords.end[Math.round(Math.random() * (goodwords.end.length - 1))];
	return (msg)
  }

  function isthanks(message) {
	content = message.content.toLowerCase().replace(/[éèêë]/g, 'e');
	goodwords = JSON.parse(fs.readFileSync('goodword.json', 'utf8'));
	tmp = goodwords.gw
	tmp.push(...goodwords.female.gw)
	tmp.push(...goodwords.male.gw)
	for (const word of tmp) {
	  const regex = new RegExp(`\\b${word}\\b`, "i");
	  if (regex.test(content)) {
		message.reply(replyMessage(message.author.displayName, goodwords));
		return false;
	  }
	}
	if ((content.includes("thank") || content.includes("thx") || content.includes("merci") || content.includes("mrc") )) {
		if (Math.random() < 0.8)
			return true;
		message.reply(goodwords.thanks[Math.round(Math.random() * (goodwords.thanks.length - 1))]);
	}
	return false;
  }

  module.exports = { isthanks };