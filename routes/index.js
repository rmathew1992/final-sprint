
/*
 * GET home page.
 */

var Idea = require('../models/idea.js');
var User = require('../models/user.js');

exports.index = function(req, res){
	console.log('called index');
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
				else{
					res.render('home',{title:'Landing page'});
				}
			});
		}
	})
};

exports.login = function(req, res){
	console.log('called login');
	res.render('login', { title: 'Login Page' })
};

exports.home= function(req,res){
	console.log('called home');
	res.render('home',{title:'Landing Page'});
};

exports.inspire= function(req,res){
	res.render('inspire',{title:'Inspiration'});
};

exports.newidea= function(req,res){
	res.render('newidea',{title:'New Idea'});
};

exports.ideapool= function(req,res){
	Idea.find().populate('creator').exec(function(err,ideas){
		if (err){
			console.log('error finding ideas:',err);
		}
		else {
			console.log(ideas);
			res.render('ideapool', {title: 'Idea Pool', ideas: ideas});
		}
	})
}

exports.showidea = function(req,res){
	res.render('layout',{title:req.params.ideaName})
}

exports.suggestedIdeas=function(req,res){
	res.render('ideagenerate',{title:'Ideas'});
}

exports.saveidea = function(req,res){
	user = req.session;
	idea = req.body;
	User.findOne({fbid: user.fbid}).exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else{
			var newIdea = new Idea({
				title: idea.title,
				tags: idea.tags.split(","),
				description: idea.description,
				creator: [foundUser._id],
				likedBy: [],
				dislikedBy: []
			});
			newIdea.save(function(err){
				if (err){
					console.log(err);
				}
				else {
					foundUser.createdIdeas.push(newIdea._id);
					foundUser.save(function(err){
						if (err){
							console.log(err);
						}
						else{
							res.redirect('/')
						}
					})
				}
			});
		}
	});
}