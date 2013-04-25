
/*
 * GET home page.
 */

var Idea = require('../models/idea.js');
var User = require('../models/user.js');

exports.index = function(req, res){
	req.facebook.api('/me', function(err, user) {
		if (err) {
			console.log(err)
		}
		else {
			console.log(user);
			User.findOne({fbid: user.id}).exec(function(err, foundUser) {
				if (foundUser == null){
					console.log('User not found.');
					var newUser = new User({
						fbid: user.id,
						name: user.name,
						createdIdeas: [],
						likedIdeas: [],
						dislikedIdeas: []
					});
					newUser.save(function(){
						if (err){
							console.log(err);
						}
						else {
							res.render('home',{title:'Landing page'});
						}
					});
				}
			});
		}
	})
};

exports.login = function(req, res){
	res.render('login', { title: 'Login Page' })
};

exports.home= function(req,res){
	res.render('home',{title:'Landing Page'});
};
exports.inspire= function(req,res){
	res.render('inspire',{title:'Inspiration'});
};
exports.newidea= function(req,res){
	res.render('newidea',{title:'New Idea'});
};
exports.ideapool= function(req,res){
	res.render('ideapool',{title:'Idea Pool'});
}
exports.ideas=function(req,res){
	res.render('ideagenerate',{title:'Ideas'});
}
