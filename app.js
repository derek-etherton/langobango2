var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
const translate = require('google-translate-api');
var validator = require('express-validator');

app.use(express.static('frontend'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

var Datastore = require('nedb');
var users = new Datastore({ filename: 'db/users.db', autoload: true});

// English
const ENG_PHRASES = ["Hello world", "How are you", "I am well", "Where is the washroom", "I am hungry", "He is hungry", "One hot dog please", "Thank you", "Have a nice day", "We are playing"];
// French
const FR_PHRASES = ["S'il vous plaît", "Bonjour", "Je ne comprends pas", "Merci", "D'accord", "Je ne sais pas", "Au revoir", "Je suis de Canada", "Excusez-moi", "De rien"];
// German
const DE_DE_PHRASES = ["das ist Bescheuert", "Entschuldigung", "Vielen Dank", "Nein danke", "Ich spreche nicht viel Deutsch", "Ich verstehe nicht", "Ich gehe zum Park", "Darf ich mir einen Stadtplan ansehen", 
			"Können Sie das übersetzen", "Können Sie langsamer sprechen"];


var session = require('express-session');

app.use(session({
    secret: 'keycat dog',
    resave: false,
    saveUninitialized: true,
}));

var User = function(user){
	var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
	this.scores = {};
	this.email = user.email;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.saltedHash === value);
};

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

// SIGN UP
app.put('/api/users/', function (req, res, next) {
	req.check('username', 'Username should be alpha & nonempty').notEmpty().isAlpha();
	req.check('password', 'Password must be nonempty').notEmpty();
	req.sanitizeBody('username').toString();
	req.sanitizeBody('password').toString();
	
	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			res.status(400).end('Validation errors: ' + util.inspect(result.array()));
			return next();
		} else {
			var data = new User(req.body);

			users.insert(data, function (err, user) {
				if (err){
					res.status(409).end("Error inserting user");
					return next();
				}
				res.json(user._id);
				return next();
			});
		}
	});

});

// SIGN IN
app.post('/api/signin/', function (req, res, next) {
    if (!req.body.username || ! req.body.password) return res.status(400).send("Bad Request");

    users.findOne({username: req.body.username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user || !checkPassword(user, req.body.password)) return res.status(401).end("Unauthorized");
        req.session.user = user;
        res.cookie('username', user.username);
		// res.setHeader('Set-Cookie', cookie.serialize('username', String(user.username), {
			// secure: true,
			// sameSite: true,
			// maxAge: 60 * 60 * 24 * 7 // 1 week 
		// }));
        return res.json(user);
    });
});

// SIGN OUT
app.get('/api/signout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        res.cookie('username', "");
        return res.end();
    });
});

// GET USER
app.get('/api/users/:username/', function (req, res, next) {
	users.findOne({username:req.params.username}, function(err, user){
		if (err) return res.status(500).end(err);
		return res.json(user);
	});
});

// UPDATE USER SCORE
app.patch('/api/users/:username/scores/', function (req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    // var data = {};
    // data[req.body.language] = req.body.score;
	users.findOne({username:req.params.username}, function(err, user){
        if (err) return res.status(500).end(err);

		if (req.session.user.username != user.username){
			return res.status(403).end("Forbidden");
		}

		var data = user.scores;
		data[req.body.language] = req.body.score;
		users.update({username : req.params.username}, {$set: { scores : data } },  {multi:false}, function (err, n) {
			if (err) return res.status(404);
			return res.json("Update successful");
		});
	});
});

// GEN RANDOM PHRASE
app.get('/api/phrases/:lang/random/', function(req, res, next) {
	var lang = req.params.lang;
	// TODO: Make function of size of lang
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

// Get phrase set
app.get('/api/phrases/:lang/', function(req, res, next) {
	var lang = req.params.lang;
	
	if (lang === "en") {
		res.json(ENG_PHRASES);
	} else if (lang === "fr") {
		res.json(FR_PHRASES);
	} else if (lang === "de-DE") {
		res.json(DE_DE_PHRASES);
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
	res.send('kcxGQPaeTBI1vwhWXxpxQnL0n9a8D56sEtVSdDnsYO8.XjlwRXicJTVSxfHDcE1vPrhfQn3sItrnzg7O1m5dUDU');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening')
});