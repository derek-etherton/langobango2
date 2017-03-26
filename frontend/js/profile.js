(function(){
	"use strict";

	window.onload = function(){
		model.getActiveUsername(function (err, res) {
			if (err){
			}
			
			if (res !== "") {
				login();
				model.getUser(res, function(err, res){
					var user = res;
					document.getElementById("username-label").innerHTML = user.username;
					console.log(user.scores);
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