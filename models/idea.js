var mongoose = require('mongoose');
var User = require('./user');

var ideaSchema = mongoose.Schema({
	title: String,
	tags: Array,
	description: String,
	creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

var Idea = mongoose.model('Idea',ideaSchema);

module.exports = Idea;