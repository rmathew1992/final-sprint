var mongoose = require('mongoose');
var Idea = require('./idea');

var userSchema = mongoose.Schema({
	fbid: String,
	name: String,
	createdIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
	likedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
	dislikedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }]
});

var User = mongoose.model('User',userSchema);

module.exports = User;