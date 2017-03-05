var express = require('express')
var app = express();

app.use(express.static('frontend'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening')
});