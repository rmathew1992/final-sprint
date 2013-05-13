
/*
 * GET home page.
 */

var Idea = require('../models/idea.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');

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
						dislikedIdeas: [],
						comments: []
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
					Idea.find().populate('creator').exec(function(err,ideas){
						if(err){
							return console.log('error',err);
						}
						else {
							res.render('home',{title:'Landing page',ideas:ideas});
						}
					});
				}
			});
		}
	})
};

exports.login = function(req, res){
	console.log('called login');
	res.render('login', { title: 'Login Page' })
};

exports.feedback = function(req, res){
	console.log('called feedback');
	res.render('feedback', { title: 'Feedback' })
};

exports.home= function(req,res){
	Idea.find().populate('creator').exec(function(err,ideas){
		if (err){
			console.log('error finding ideas:',err);
		}
		else {
			console.log('called home');
			console.log(ideas);
			res.render('home',{title:'Landing Page',ideas:ideas});
		}
	})
};

exports.inspire= function(req,res){
	Idea.find().populate('creator').exec(function(err,ideas){
		if(err){
			return console.log('error',err);
		}
		else {
			var idea = randomChoice(ideas,1)[0];
			console.log(idea);
			res.render('inspire',{title:'Inspiration',idea:idea,single:true});
		}
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
			res.render('ideapool', {title: 'Idea Pool', ideas: ideas,numIdeas:ideas.length});
		}
	})
}

exports.showIdea = function(req,res){
	var ideaName = req.params.ideaName;
	console.log(ideaName);
	Idea.findOne({title: ideaName}).populate('creator comments').exec(function(err,foundIdea){
		if (err){
			console.log('error finding idea:',err);
		}
		else {
			console.log(foundIdea.creator);
			res.render('ideaPage',{title:foundIdea.title,idea:foundIdea});
		}
	})
}

exports.suggestedIdeas=function(req,res){
	res.render('ideagenerate',{title:'Ideas'});
}

exports.saveidea = function(req,res){
	var user = req.session;
	console.log(req.session);
	var idea = req.body;
	if (idea.anonymous !== undefined){
		var anonymous = true;
	}
	else{
		var anonymous = false;
	}
	User.findOne({fbid: user.fbid}).exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else{
			console.log(foundUser);
			var newIdea = new Idea({
				title: idea.title,
				anonymous: anonymous,
				tags: idea.tags.split(","),
				description: idea.description,
				preview: idea.description.substr(0,200)+'...',
				url: '/ideas/'+idea.title,
				creator: [foundUser._id],
				likes: 1,
				dislikes: 0,
				likedBy: [],
				dislikedBy: [],
				comments: []
			});
			newIdea.save(function(err){
				if (err){
					console.log(err);
				}
				else {
					foundUser.createdIdeas.push(newIdea._id);
					foundUser.likedIdeas.push(newIdea._id);
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
	console.log('called');
	var numIdeas = req.body.numIdeas;
	console.log('numIdeas',numIdeas);
	var single = (numIdeas > 1) ? false : true;
	console.log(single);
	Idea.find().populate('creator').exec(function(err,ideas){
		if (err){
			console.log('error finding ideas:',err);
		}
		else {
			var ideas = randomChoice(ideas,numIdeas);
			// res.render('_singleIdea', {ideas: ideas});
			res.render('_ideas', {ideas: ideas,numIdeas:numIdeas});
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
	User.findOne({fbid: user.fbid}).populate('createdIdeas dislikedIdeas likedIdeas').exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else {
			Idea.findOne({title:ideaName}).exec(function(err,foundIdea){
				if (err){
					console.log('error',err);
				}
				else {
					var likeIncr = 0;
					var dislikeIncr = 0;
					if (liked == 'true'){
						if (alreadyIn(foundUser.likedIdeas,ideaName)){
							console.log("won't update");
						}
						else if (alreadyIn(foundUser.dislikedIdeas,ideaName)){
							console.log('updating for a dislike to a like');
							foundIdea.likedBy.push(foundUser._id);
							foundUser.likedIdeas.push(foundIdea._id);
							foundIdea.likes += 1;
							likeIncr += 1;
							foundIdea.dislikedBy.pop(foundUser._id)
							foundUser.dislikedIdeas.pop(foundIdea._id);
							foundIdea.dislikes -= 1;
							dislikeIncr -= 1;
						}
						else{
							console.log('updating for a like');
							foundIdea.likedBy.push(foundUser._id);
							foundIdea.likes += 1;
							likeIncr += 1;
							foundUser.likedIdeas.push(foundIdea._id);
						}
					}
					if (liked == 'false'){
						if (alreadyIn(foundUser.dislikedIdeas,ideaName)){
							console.log("won't update");
						}
						else if (alreadyIn(foundUser.likedIdeas,ideaName)){
							console.log('updating from like to a dislike');
							foundIdea.likedBy.pop(foundUser._id);
							foundUser.likedIdeas.pop(foundIdea._id);
							foundIdea.likes -= 1;
							likeIncr -= 1;
							foundIdea.dislikedBy.push(foundUser._id)
							foundUser.dislikedIdeas.push(foundIdea._id);
							foundIdea.dislikes += 1;
							dislikeIncr += 1;
						}
						else{
							console.log('updating for a dislike');
							foundIdea.dislikedBy.push(foundUser._id);
							foundIdea.dislikes += 1
							dislikeIncr += 1;
							foundUser.dislikedIdeas.push(foundIdea._id);
						}
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
									res.send({likeIncr:likeIncr,dislikeIncr:dislikeIncr});
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.search = function(req,res){
	var query = req.body.query;
	var results = []
	Idea.find().populate('creator').exec(function(err,ideas){
		for (var i = 0; i < ideas.length; i++){
			var idea = ideas[i];
			if (contains(idea.title,query) || contains(idea.description,query) || (idea.tags.indexOf(query) != -1)){
				results.push(idea);
			}
		}
		var found = (results.length > 0) ? true : false ;
		res.render('search',{results:results,found:found,query:query,title:'Search Results'});
	});
};

exports.saveComment = function(req,res){
	var user = req.session;
	var data = req.body;
	console.log(req.body);
	console.log(req.session);
	User.findOne({fbid: user.fbid}).exec(function(err, foundUser) {
		if (err){
			console.log('error',err);
		}
		else{
			Idea.findOne({title: data.ideaName}).exec(function(err,foundIdea){
				if (err){
					console.log('error',err);
				}
				else{
					console.log(foundUser);
					console.log(foundIdea);
					var newComment = new Comment({
						anonymous: data.anonymous,
						text: data.text,
						creatorName: foundUser.name,
						creator: [foundUser._id],
						idea: [foundIdea._id]
					})
					newComment.save(function(err){
						if (err){
							console.log(err);
						}
						else {
							foundUser.comments.push(newComment._id);
							foundIdea.comments.push(newComment._id);
							res.send('Success');
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
										res.send('Success');
									}
								});
							}
						});
					});
				};
			});
		}
	});
}

function randInt(min,max){
	return Math.floor(Math.random()*(max - min + 1))+min;
}

function randomChoice(list,nChoices){
	var indexes = []
	while (indexes.length < nChoices){
		var potentialIndex = randInt(0,list.length-1);
		if (indexes.indexOf(potentialIndex) == -1){
			indexes.push(potentialIndex);
		}
	}
	var ideas = [];
	for (var i = 0; i < indexes.length; i++){
		ideas.push(list[indexes[i]])
	}
	return ideas
}

function contains(str,substr){
	var str = str.toLowerCase();
	var substr = substr.toLowerCase();
	if (str.indexOf(substr) != -1){
		return true;
	}
	else{
		return false;
	}
}

function alreadyIn(ideas,name){
	for (var i = 0; i < ideas.length; i++){
		if (ideas[i].title == name){
			return true
		}
	}
	return false;
}