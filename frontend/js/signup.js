(function(){
	"use strict";

	document.getElementById("signup-submit").onclick = function(e) {
		e.preventDefault();
		var username = document.getElementById("signup_username").value;
		var password = document.getElementById("signup_password").value;
		var email = document.getElementById("signup_email").value;
		model.signUp({"username": username, "password": password, "email" : email}, function(err, res) {});
	}

}());