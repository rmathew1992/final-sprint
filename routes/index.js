
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
	res.render('login', { title: 'Login page' })
};

exports.home= function(req,res){
	res.render('home',{title:'Landing page'});
};

exports.inspire= function(req,res){
	res.render('inspire',{title:'Inspiration'});
};