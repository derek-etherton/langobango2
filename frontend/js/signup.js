(function(){
	"use strict";

	document.getElementById("signup-submit").onclick = function(e) {
		e.preventDefault();
		var username = document.getElementById("signup_username").value;
		var password = document.getElementById("signup_password").value;
		var passConfirm = document.getElementById("signup_pass_confirm").value;
		var email = document.getElementById("signup_email").value;
		if (password == passConfirm){
			model.signUp({"username": username, "password": password, "email" : email}, function(err, res) {
				if (err) {
					alert ("Failed to create account");
				}
				if (res) {
					window.location.replace('index.html');
					alert("Account created");
				}
			});
		}else{
			alert("Passwords do not match!");
		}

	}

}());