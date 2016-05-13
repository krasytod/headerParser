'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);


app.get('*', function(req, res){
	var ip = "ipaddress: "+req.headers['x-forwarded-for']; //req.connection.remoteAddress)
	//bg,en-US;q=0.8,en;q=0.6
	var lang ="language: "+ req.headers["accept-language"].split(",")[0];
	var client_info  = req.headers['user-agent'] ; 
	var os_match = /(\x28.*?\x29)/g 
	client_info = "software: "+os_match.exec(client_info)[1]
	//res.write(client_info)
	res.end( "{"+ip+", "+lang+", "+client_info+"}");

});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});