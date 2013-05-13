
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Facebook = require('facebook-node-sdk')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.COOKIE_SECRET));
  app.use(express.session({secret: ' hi wolfie =) '}));
  app.use(Facebook.middleware({ appId: '592198594123789', secret: '5c39850ad7130c483f719d42ec19252f' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/final-sprint');
});

app.configure('development', function(){
  app.set('host', 'localhost:' + process.env.PORT)
  app.use(express.errorHandler());
});


//req.user is actually facebook ID not name
function facebookGetUser() {
  console.log('called facebookgetuser');
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.render('login', {title: "Welcome to IdeaFish"})
      } else {
        req.session.fbid = user;
        next();
      }
    });
  }
}

app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});
app.get('/logout', facebookGetUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
});

app.get('/', facebookGetUser(), routes.index);
app.get('/home',routes.home);
app.get('/newidea',routes.newidea);
app.get('/inspire',routes.inspire);
app.get('/ideas/:ideaName',routes.showIdea);
app.get('/ideapool',routes.ideapool);
app.get('/randomidea',routes.randomidea);
app.post('/renderRandomIdea',routes.renderRandomIdea);
app.get('/yourIdeas',routes.renderYourIdeas);
app.get('/feedback',routes.feedback);
app.post('/saveidea',routes.saveidea);
app.post('/updateIdea',routes.updateIdea);
app.post('/search',routes.search);
app.post('/saveComment',routes.saveComment);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// :)

//We should leave notes to our instructors in the comments

//Sounds like a plan.

  
