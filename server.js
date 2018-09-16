'use strict';

var express = require('express');
var mongo = require('mongodb');
require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var bodyParser = require('body-parser');
console.log(process.env.MONGO_URI);
console.log('test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  var cors = require('cors');

  var app = express();

  // Basic Configuration 
  var port = process.env.PORT || 3000;

  /** this project needs a db !! **/
  // mongoose.connect(process.env.MONGOLAB_URI);

  app.use(cors());

  /** this project needs to parse POST bodies **/
  // you should mount the body-parser here
  app.use(bodyParser.urlencoded({extended: false}));

  app.use('/public', express.static(process.cwd() + '/public'));

  app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });


  // your first API endpoint... 
  app.get("/api/hello", function (req, res) {
    res.json({ greeting: 'hello API' });
  });


  app.listen(port, function () {
    console.log('Node.js listening ....');
  });

});



//npm install ... modules (add dotenv, nodemon)
//set root to cd\github\p3
//use nodemon server.js to start live monitoring
//ctrl+c to stop
