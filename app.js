var express = require('express')
var app = express();
const translate = require('google-translate-api');

app.use(express.static('frontend'));

// English
const ENG_PHRASES = ["Hello world", "How are you", "I am well", "Where is the washroom", "I am hungry", "He is hungry", "One hot dog please", "Thank you", "Have a nice day", "We are playing"];
// French
const FR_PHRASES = ["S'il vous plaît", "Bonjour", "Je ne comprends pas", "Merci", "D'accord", "Je ne sais pas", "Au revoir", "Je suis de Canada", "Excusez-moi", "De rien"];
// German
const DE_DE_PHRASES = ["das ist Bescheuert", "Entschuldigung", "Vielen Dank", "Nein danke", "Ich spreche nicht viel Deutsch", "Ich verstehe nicht", "Ich gehe zum Park", "Darf ich mir einen Stadtplan ansehen", 
			"Können Sie das übersetzen", "Können Sie langsamer sprechen"];


app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.get('/api/phrases/:lang/random/', function(req, res, next) {
	var lang = req.params.lang;
	var i = Math.floor((Math.random() * 10));
	if (lang === "en") {
		res.json(ENG_PHRASES[i]);
	} else if (lang === "fr") {
		res.json(FR_PHRASES[i]);
	} else if (lang === "de-DE") {
		res.json(DE_DE_PHRASES[i]);
	}
	return next();
});


app.get('/api/translate/:phrase/', function(req, res, next) {
	var phrase = req.params.phrase;

	translate(phrase, {to: 'en'}).then(result => {
		res.json(result.text);
		return next();
	}).catch(err => {
		console.error(err);
		return next();
	});
});

app.get('/.well-known/acme-challenge/:content', function(req, res){
	res.send(req.params.content);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening')
});