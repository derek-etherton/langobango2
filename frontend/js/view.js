//http://stiltsoft.com/blog/2013/05/google-chrome-how-to-use-the-web-speech-api/
var view = (function(){
	"use strict";
	
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = "en";
	
	autoRequestMedia: true;
	
	recognition.onresult = function (event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			document.getElementById('textarea').value = event.results[i][0].transcript;
		}
	};
	
	document.getElementById("start_speech").onclick = function(e){
		record_on();
	}
	
	var record_on = function(){
		var but = document.getElementById("start_speech");
		but.innerHTML = "stop speech detect";
		document.getElementById("start_speech").onclick = function(e){
			record_off();
		}
		recognition.start();
	};

	var record_off = function(){
		recognition.stop();
		var but = document.getElementById("start_speech");
		but.innerHTML = "start speech detect";
		document.getElementById("start_speech").onclick = function(e){
			record_on();
		}
	};
	
	return view;
	
}());