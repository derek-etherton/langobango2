var model = (function(){
    "use strict";

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

	model.getRandomPhrase = function(lang, callback) {
		doAjax('GET', '/api/phrases/' + lang + '/random/', null, true, function(err, res) {
			callback(err, res);
		});
	};
	
	model.getTranslation = function(phrase, callback) {
		doAjax('GET', '/api/translate/' + phrase + '/', null, true, function(err, res) {
			callback(err, res);
		});
	};

    return model;    
}());