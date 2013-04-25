
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
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