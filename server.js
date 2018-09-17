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
  /*Wipe the database on start so index/ shortURL code starts from 0 
  for each use*/
  db.dropDatabase();

  // Basic Configuration 
  var cors = require('cors');
  var app = express();
  var port = process.env.PORT || 3000;
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  const dns = require('dns');
  const url = require('url');
  app.use('/public', express.static(process.cwd() + '/public'));

  app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  var Schema = mongoose.Schema;

  var index = 0;

  var shorturlSchema = new Schema({
    originalurl: String,
    index: Number, //this also servers as the shortURL
    //shorturl : Number
  });

  var ShortURL = mongoose.model('ShortURL', shorturlSchema);

  /*This function uses Node's DNS functionality to validate
  a URL. This will be chained within the POST function below.*/
  let validateURL = (URL, callback) => {
    let testURL = url.parse(URL);
    testURL = testURL.hostname;
    dns.lookup(testURL, (err, addresses) => {
      if (addresses == undefined) {
        callback(err);
      }
      else {
        callback();
      }
    })
  }

  //pulls the URL from the field within the body
  app.post('/api/shorturl/new', function (req, res) {
    index += 1;
    //check for valid URL 
    let inputURL = req.body.url;
    let regex = /^http(s?):\/\/.*/i; //have to accomodate nothing preceding www. as well
    validateURL(inputURL, function (err) {
      if (err || !regex.test(inputURL)) {
        res.json({ callback: 'error with the URL' })

      } else {
        let newURL = new ShortURL({
          originalurl: req.body.url,
          index: index
        });
        newURL.save(function (err) {
          if (err) {
            res.send(err);
          }
          console.log("DB successfully updated...");
          res.json({ original_url: req.body.url, short_url: newURL.index });
        });
      }
    })
  });

  //Chained in the app.get function below. Declared here for readability. 
  let findURLByIndex = function (URLindex, callback) {
    ShortURL.find({ index: URLindex }, (err, record) => {
      if (err) {
        callback(err, null);
      } else if (record == null) {
        callback(null,null);
      }
      else {
        console.log("Record found..." + record[0]);
        callback(null, record[0]);
      }
    });
  };

  app.get('/api/shorturl/:index', function (req, res) {
    let searchIndex = req.params.index;
    findURLByIndex(searchIndex, function (err, index) {
      if (err) {
        console.log(err);
      } else if (index == null) {
        res.send('ShortURL does not exist.');
      } else 
      {
      res.redirect(index.originalurl);
      }
    });
  });

  app.listen(port, function () {
    console.log('Node.js listening ....');
  });
});

/* Local Run Instructions - will need to set up project on Glitch */
//npm install ... modules (add dotenv, nodemon)
//set root to cd\github\p3
//use nodemon server.js to start live monitoring
//ctrl+c to stop
