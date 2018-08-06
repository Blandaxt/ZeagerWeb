// // // Include the server in your file
// const server = require('server');
// //
// // const app = require(express);
// // const { get, post } = server.router;
// //
// // // Handle requests to the url "/" ( http://localhost:3000/ )
// // server([
// //   get('/', function(req,res) {
// //       res.sendfile('./index.html');
// //      });
// // // app.get('/', function(req,res) {
// // //     res.sendfile('./index.html');
// // //    });
// const http = require('http');
// const fs = require('fs')
// const url = require('url');
// var querystring = require('querystring');
// const figlet = require('figlet')
//
// const server = http.createServer(function(req, res) {
//   const page = url.parse(req.url).pathname;
//   var params = querystring.parse(url.parse(req.url).query);
//   console.log(page);
//   if (page == '/') {
//     fs.readFile('index.html', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//     });
//   }
//   /*else if (page == '/otherpage') {
//     fs.readFile('hi.html', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//       // otherpage
//     });
//   }
//   else if (page == '/otherotherpage') {
//     fs.readFile('otherotherpage.html', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//     });
//   }
//   else if (page == '/api') {
//     if('student' in params){
//       if(params['student']== 'leon'){
//         res.writeHead(200, {'Content-Type': 'application/json'});
//         var objToJson = {
//           name: "leon",
//           status: "Boss Man",
//           currentOccupation: "Baller"
//         }
//         res.end(JSON.stringify(objToJson));
//       }//student = leon
//       else if(params['student'] != 'leon'){
//         res.writeHead(200, {'Content-Type': 'application/json'});
//         var objToJson = {
//           name: "unknown",
//           status: "unknown",
//           currentOccupation: "unknown"
//         }
//         res.end(JSON.stringify(objToJson));
//       }//student != leon
//     }//student if
//   }//else if
//   else if (page == '/css/style.css'){
//     fs.readFile('css/style.css', function(err, data) {
//       res.write(data);
//       res.end();
//     });
//   }else if (page == '/js/main.js'){
//     fs.readFile('js/main.js', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/javascript'});
//       res.write(data);
//       res.end();
//     });
//   }*/else{
//     figlet('404!!', function(err, data) {
//       if (err) {
//           console.log('Something went wrong...');
//           console.dir(err);
//           return;
//       }
//       res.write(data);
//       res.end();
//     });
//   }
// });
//
// server.listen(8000);
//
// console.log("Going on port: " + server);
//
// // MongoDB is a cross-platform and open-source document-oriented database, a kind of NoSQL database. As a NoSQL database, MongoDB shuns the relational database's table-based structure to adapt JSON-like documents that have dynamic schemas which it calls BSON.

// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000
//
// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'html')
//   .get('/', (req, res) => res.render('index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static('static'));

// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
