var express = require('express')
var app = express();
const translate = require('google-translate-api');

app.use(express.static('frontend'));

const ENG_PHRASES = ["Hello world", "How are you", "I am well", "Where is the washroom", "I am hungry", "He is hungry", "One hot dog please", "Thank you", "Have a nice day", "We are playing"];
const FR_PHRASES = ["S'il vous plaît", "Bonjour", "Je ne comprends pas", "Merci", "D'accord", "Je ne sais pas", "Au revoir", "Je suis de Canada", "Excusez-moi", "De rien"];

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.get('/api/phrases/:lang/random/', function(req, res, next) {
	var lang = req.params.lang;
	var i = Math.floor((Math.random() * 10));
	console.log(lang);
	if (lang == "en") {
		res.json(ENG_PHRASES[i]);
	} else if (lang == "fr") {
		res.json(FR_PHRASES[i]);
	}
	return next();
});


app.get('/api/translate/:phrase/', function(req, res, next) {
	var phrase = req.params.phrase;
	console.log(phrase);

	translate(phrase, {to: 'en'}).then(result => {
		res.json(result.text);
		return next();
	}).catch(err => {
		console.error(err);
		return next();
	});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening')
});