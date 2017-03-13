//http://stiltsoft.com/blog/2013/05/google-chrome-how-to-use-the-web-speech-api/
var view = (function(){
	"use strict";
	
	var final_transcript = '';
	
	var toMatch = "";
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = false;	//allows for end of speech detection
	recognition.interimResults = true;
	recognition.lang = "de-DE";
	
	autoRequestMedia: true;
	
	document.getElementById("start_speech").onclick = function(e){
		record_on();
	}
	
	document.getElementById("start_tts").onclick = function(e){
		speak_phrase();
	}
	
	document.getElementById("new_phrase").onclick = function(e){
		set_new_phrase();
	}
	
	document.getElementById("eng_selector").onclick = function(e){
		setLanguage("en");
	}
	
	document.getElementById("fr_selector").onclick = function(e){
		setLanguage("fr");
	}
	
	document.getElementById("de_de_selector").onclick = function(e){
		setLanguage("de-DE");
	}
	
	var setLanguage = function (lang) {
		clearTranscript();
		recognition.lang = lang;
		set_new_phrase();
	}
	
	var first_char = /\S/;
	function capitalize(s) {
		return s.replace(first_char, function(m) { return m.toUpperCase(); });
	};
	
	window.onload = function(){
		set_new_phrase();
	}
	
	var set_new_phrase = function(){
		model.getRandomPhrase(recognition.lang, function(err, res) {
			clearTranscript();
			model.getTranslation(res, function(err, result) {
				document.getElementById("translation_span").innerHTML = result;
			});
			document.getElementById("question_span").innerHTML = res;
		});
	};
	
	var speak_phrase = function(){
		speak(document.getElementById("question_span").innerHTML);
	};
	
	var record_on = function(){
		document.getElementById("score_text").innerHTML = "";
		model.getRandomPhrase(recognition.lang, function(err, res) {
			toMatch = document.getElementById("question_span").innerHTML;
			var but = document.getElementById("start_speech");
			but.src = "media/mic-on.png";
			document.getElementById("start_speech").onclick = function(e){
				record_off();
			}
			recognition.start();
		});
	};

	var record_off = function(){
		recognition.stop();
		var but = document.getElementById("start_speech");
		but.src = "media/mic.png";
		document.getElementById("start_speech").onclick = function(e){
			record_on();
		}
	};
	
	recognition.onresult = function (event) {
		var interim_transcript = '';

		if (typeof(event.results) == 'undefined') {
		  recognition.onend = null;
		  recognition.stop();
		  return;
		}

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			}else{
				interim_transcript += event.results[i][0].transcript;
			}
		}
		final_transcript = capitalize(final_transcript);
		final_span.innerHTML = final_transcript;
		interim_span.innerHTML = interim_transcript;
	};

	recognition.onend = function (){
		record_off();
		var result = score();
		document.getElementById("score_text").innerHTML = "Score: " + Math.floor(result*100) + " %";
		
		model.getTranslation(final_transcript, function(err, res) {
			final_span.innerHTML = final_transcript + " (" + res + ")";
		});
	}
	
	recognition.onstart = function (){
		clearTranscript();
	}
	
	var clearTranscript = function () {
		final_transcript = '';
		final_span.innerHTML = '';
		interim_span.innerHTML = '';
		document.getElementById("score_text").innerHTML = '';
	}
	
	// Thanks Stephen Walther:
	// http://stephenwalther.com/archive/2015/01/05/using-html5-speech-recognition-and-text-to-speech
	function speak(text, callback) {
		var u = new SpeechSynthesisUtterance();
		u.rate = 0.5
		u.text = text;
		u.lang = recognition.lang;
	 
		u.onend = function () {
			if (callback) {
				callback();
			}
		};
	 
		u.onerror = function (e) {
			if (callback) {
				callback(e);
			}
		};
	 
		speechSynthesis.speak(u);
	}
	
	var score = function () {
		var res = final_transcript.split(" ");
		var desired = toMatch.split(" ");
		var count = 0;
		var i;
		for (i = 0; i < Math.min(desired.length, res.length); i++){
			if (desired[i].toLowerCase() === res[i].toLowerCase()) {
				count ++;
			}
		}
		return count / desired.length;
	}
	
	return view;
	
}());