BASE_DIR = __dirname;

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3001;
var app = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var dbUrl = 'mongodb://localhost/blog';
var logger = require('morgan');

mongoose.connect(dbUrl);

app.set('views','./app/views/');
app.use(bodyParser.json());// for parsing application/json
app.use(bodyParser.urlencoded({extended:true}));// for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname,'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname,'app/views'),{
  index:false
}));
app.locals.moment = require('moment');
app.use(cookieParser());
app.use(logger('dev'));

require('./config/routes')(app);

app.listen(port);
console.log("GDT's blog is run at 127.0.0.1:"+port);
