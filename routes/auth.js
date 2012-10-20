exports.login = function(req, res){
  res.render('login', { 
  	media_root: 'http://radialpoint.kindlingapp.com'
  });
};

exports.submit_login = function(req, res){
	req.method = 'get';
	res.redirect('http://yahoo.com');
};

