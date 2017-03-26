(function(){
	"use strict";
	
	var READABLE_LANGS = {"en" : "English", "de-DE" : "German", "fr" : "French"};

	window.onload = function(){
		model.getActiveUsername(function (err, res) {
			if (err){
			}
			
			if (res !== "") {
				login();
				model.getUser(res, function(err, res){
					var user = res;
					document.getElementById("username-label").innerHTML = user.username;
					var scores = user.scores;
					
					if (Object.keys(user.scores).length === 0){
						document.getElementById("scoreboard").innerHTML = "You haven't completed any language sets yet!";
					} else {
						for (var key in user.scores) {
							document.getElementById("scoreboard").innerHTML += '<tr class="values">\
											<td>' + READABLE_LANGS[key] + '</td>\
											<td>' + user.scores[key] + ' %</td>\
										  </tr>'
						}
					}
				});
			}
		});
	}
	
	var login = function() {
		document.getElementById("signin-bar").innerHTML = '<li id="signout">\
		  <a href="#signout">Sign Out</a>\
		</li>'
		document.getElementById("profile_link").style.display = "block";
		document.getElementById("signout").onclick = function() {
			model.signOut(function(err, res){
				if(err){
				
				} else {
					logout();
				}
			});
		};
	}
	
	var logout = function() {
		model.signOut(function(err, res) {
			if (err){
			}
			
			location.reload();
		});
	}

}());