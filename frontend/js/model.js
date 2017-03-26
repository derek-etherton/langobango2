var model = (function(){
    "use strict";
	
	var phraseSet;
	var activeLang;
	var phraseIndex = -1;
	var scores;

	var doAjax = function (method, url, body, json, callback){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(e){
			switch(this.readyState){
				 case (XMLHttpRequest.DONE):
					if (this.status === 200) {
						if(json) return callback(null, JSON.parse(this.responseText));
						return callback(null, this.responseText);
					}else{
						return callback(this.responseText, null);
					}
			}
		};
		xhttp.open(method, url, true);
		if (json && body){
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.send(JSON.stringify(body));  
		}else{
			xhttp.send(body);
		}
    };

    var model = {};
	var activeUser;

	model.signIn = function(data, callback) {
		doAjax('POST', '/api/signin/', data, true, function(err, res) {
			activeUser = res;
			callback(err, res);
		});
	}
	
	model.signUp = function(data, callback) {
		doAjax('PUT', '/api/users/', data, true, function(err, res) {
			callback(err, res);
		});
	}
	
	model.signOut = function(callback) {
		doAjax('GET', '/api/signout/', null, false, function(err, res) {
			callback(err, res);
		});
	}

	model.getRandomPhrase = function(lang, callback) {
		doAjax('GET', '/api/phrases/' + lang + '/random/', null, true, function(err, res) {
			callback(err, res);
		});
	};
	
	model.loadPhraseSet = function(lang, callback) {
		doAjax('GET', '/api/phrases/' + lang + '/', null, true, function(err, res) {
			if (err) {
				callback(err, res);
			}

			activeLang = lang;
			phraseIndex = -1;
			phraseSet = res;
			scores = [phraseSet.size];
			callback(err, phraseSet);
		});
	};

	
	model.getNextPhrase = function(lang, callback) {
		phraseIndex += 1;
		var result = {};
		result.phrase = phraseSet[phraseIndex];
		if (phraseIndex == phraseSet.length - 1) {
			result.finalPhrase = true;
		}
		
		scores[phraseIndex] = 0;
		callback(null, result);
	};

	model.getTranslation = function(phrase, callback) {
		doAjax('GET', '/api/translate/' + phrase + '/', null, true, function(err, res) {
			callback(err, res);
		});
	};

	model.addScore = function (score) {
		if (score) {
			scores[phraseIndex] = score;
		}
	}
	
	model.getFinalScore = function (callback) {
		var score = finalScore();

		model.getActiveUsername(function(err, res){
			model.updateUserScore(res, {"language" : activeLang, "score" : score});
		});
	
		callback(null, score);
	}
	
	model.updateUserScore = function(username, data){
		doAjax("PATCH", "/api/users/" + username + "/scores/", data, true, function(err, res){
			
		});
	}
	
	model.getUser = function(username, callback){
		doAjax('GET', '/api/users/' + username + '/', null, true, function(err, res) {
			callback(err, res);
		});
	}
	
	var finalScore = function(){
		var sum = 0;
		for (var i = 0; i < scores.length; i++){
			sum += scores[i];
		}

		return Math.floor(sum/scores.length);
	}

    model.getActiveUsername = function(callback) {
        var keyValuePairs = document.cookie.split('; ');
        for(var i in keyValuePairs){
            var keyValue = keyValuePairs[i].split('=');
            if(keyValue[0] === 'username') return callback(null, keyValue[1]);
        }
        return callback("No active user", null);
    }
	
    return model;    
}());