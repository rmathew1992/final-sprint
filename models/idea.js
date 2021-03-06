var mongoose = require('mongoose');
var User = require('./user');
var Comment = require('./comment');

var ideaSchema = mongoose.Schema({
	title: String,
	anonymous: Boolean,
	tags: Array,
	description: String,
	preview: String,
	url: String,
	likes: Number,
	dislikes: Number,
	creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

var Idea = mongoose.model('Idea',ideaSchema);

module.exports = Idea;