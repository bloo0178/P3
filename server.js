'use strict';

var express = require('express');
var mongo = require('mongodb');
require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var bodyParser = require('body-parser');
console.log(process.env.MONGO_URI);
console.log('test');

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function () {

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

  /*       ---LOGIC---
  -Pull the URL from the field
  -Test if the URL is valid
  -Show the json at api/shorturl/new
  -Store the URL in the database via json
  -Allow for an ad-hoc URL at api/shorturl/[x]
  --Need to search database for x
  --If doesn't exist, "error: no short URL for given input"
  */



  var Schema = mongoose.Schema;
  var shorturlSchema = new Schema({
    originalurl : String,
    //index : Number,
   // shorturl : String
  });

  var ShortURL = mongoose.model('ShortURL', shorturlSchema);



    //pulls the URL from the field within the body
    app.post('/api/shorturl/new', function(req, res, next) {
      let newURL = new ShortURL({
        originalurl : req.body.url, 
      });
      newURL.save(function(err) {
        if (err) {
          res.send(err);
        }
        console.log("DB successfully updated...");
        //return done(null, newURL);
      });
      next();
    }, function( req, res) {
      res.json({test2: req.body.url});
    }
    );



  // your first API endpoint... 
  app.get("/api/hello", function (req, res) {
    res.json({ greeting: 'hello API' });
  });

  


  app.listen(port, function () {
    console.log('Node.js listening ....');
  });

//});



//npm install ... modules (add dotenv, nodemon)
//set root to cd\github\p3
//use nodemon server.js to start live monitoring
//ctrl+c to stop
