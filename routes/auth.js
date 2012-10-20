var https = require('https');


var media_root = 'https://radialpoint.kindlingapp.com';
var kindling_shared_secret = 'wat7gig5aps5yak7tud4quo5hey2him7';
var kindling_api_endpoint = 'radialpoint.kindlingapp.com';
var kindling_api_port = 80;

var kindling_api_headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

exports.login = function(req, res){
  res.render('login', { 
  	media_root: media_root
  });
};

exports.submit_login = function(req, res){
	console.log(req.body.email);
	console.log(req.body.password);

	// 1. authenticate

	// 2. renerate token
	// 2.1 Make a POST request to your Kindling instance, 
	// At this location: media_root + '/api/rest/v1/authenticator'
	// With these form variables:
	// user=usertoauth@useremaildomain.com
	// secret=yoursharedsecret
	// expires(optional, defaults to 3 hours. for full allowed time formats see here)=+1 day
	// pattern based on 
	// http://nodejs.org/docs/v0.4.11/api/http.html#http.request
	data = JSON.stringify({ 'user': req.body.email, 'secret': kindling_shared_secret });
	headers = kindling_api_headers;
	headers['Content-Length'] = Buffer.byteLength(data,'utf8');
	options = {
		host: kindling_api_endpoint,
		port: kindling_api_port,
		path: '/api/rest/v1/authenticator',
		method: 'POST',
		headers: headers
	};


	var request = https.request(options);

	request.on('response', function(response) {
		response.on('data', function(chunk) {
			console.log('received from kindling:')
			console.log(chunk);


			req.method = 'get';
			res.redirect('http://yahoo.com');
		});
		response.on('end', function(chunk) {
			console.log('end received')
		});
	});
	
	req.on('error', function(e) {
  		console.log('problem with request: ' + e.message);
	});

	request.write(data);
	request.end();

	console.log('wrote this request');
	console.log(request);
	// 3. redirect
};

