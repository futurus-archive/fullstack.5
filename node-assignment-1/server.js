/**
 * Created by vunguyen on 1/3/17.
 */
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

var dishRouter = require('./dishRouter');

dishRouter(express, bodyParser, function (err, result) {
   if (err) {
       console.log(err);
   } else {
       app.use('/dishes', result);
   }
});

var promoRouter = require('./promoRouter');

promoRouter(express, bodyParser, function (err, result) {
    if (err) {
        console.log(err);
    } else {
        app.use('/promotions', result);
    }
});

var leaderRouter = require('./leaderRouter');

leaderRouter(express, bodyParser, function (err, result) {
    if (err) {
        console.log(err);
    } else {
        app.use('/leadership', result);
    }
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
