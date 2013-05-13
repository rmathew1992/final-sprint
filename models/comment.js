var mongoose = require('mongoose');
var User = require('./user');
var Idea = require('./idea');

var commentSchema = mongoose.Schema({
	anonymous: Boolean,
	text: String,
	creatorName: String,
	creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	idea: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }]
});

var Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;