
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
	Idea.find().populate('ideas').exec(function(err,ideas){
		if (err){
			console.log('error finding ideas:',err);
		}
		else {
			console.log('called home');
			res.render('home',{title:'Landing Page',ideas:ideas});
		}
	})
};

exports.inspire= function(req,res){
	Idea.find({}).populate('ideas').exec(function(err,docs){
	if(err) return console.log('error',err);
	res.render('inspire',{title:'Inspiration',ideas:docs});
	});
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

exports.showIdea = function(req,res){
	var ideaName = req.params.ideaName;
	console.log(ideaName);
	Idea.findOne({title: ideaName}).populate('creator').exec(function(err,idea){
		if (err){
			console.log('error finding idea:',err);
		}
		else {
			console.log(idea);
			res.render('ideaPage',{title:idea.title,idea:idea});
		}
	})
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
				url: '/ideas/'+idea.title,
				creator: [foundUser._id],
				likes: 1,
				dislikes: 0,
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
							res.redirect('/ideapool')
						}
					})
				}
			});
		}
	});
}
exports.randomidea= function(req,res){
	console.log('called random');
	res.render('randomidea',{title:'Random Idea'});
};

exports.renderRandomIdea = function(req,res){
	Idea.find().populate('creator').exec(function(err,ideas){
		if (err){
			console.log('error finding ideas:',err);
		}
		else {

			console.log(ideas);
			idea = randomChoice(ideas);
			res.render('_singleIdea', {idea: idea});
		}
	})
}

exports.renderYourIdeas = function(req,res){
	var user = req.session;
	User.findOne({fbid: user.fbid}).populate('createdIdeas').exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else {
			res.render('_yourIdeas',{yourIdeas:foundUser.createdIdeas});
		}
	});
}

exports.updateIdea = function(req,res){
	console.log(req.body);
	var ideaName = req.body.ideaName;
	var liked = req.body.liked;
	var user = req.session;
	User.findOne({fbid: user.fbid}).populate('createdIdeas').exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else {
			Idea.findOne({title:ideaName}).exec(function(err,foundIdea){
				if (err){
					console.log('error',err);
				}
				else {
					if (liked == 'true'){
						console.log('updating for a like');
						foundIdea.likedBy.push(foundUser._id);
						foundIdea.likes += 1;
						foundUser.likedIdeas.push(foundIdea._id);
					}
					else{
						console.log('updating for a dislike');
						foundIdea.dislikedBy.push(foundUser._id);
						foundIdea.dislikes += 1
						foundUser.dislikedIdeas.push(foundIdea._id);
					}
					foundUser.save(function(err){
						if (err){
							console.log(err);
						}
						else {
							foundIdea.save(function(err){
								if (err){
									console.log(err);
								}
								else {
									res.send('success');
								}
							});
						}
					});
				}
			});
		}
	});
}

function randInt(min,max){
	return Math.floor(Math.random()*(max - min + 1))+min;
}

function randomChoice(list){
	var index = randInt(0,list.length-1);
	return list[index]
}