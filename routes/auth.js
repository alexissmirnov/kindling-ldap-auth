var https = require('https');
var querystring = require('querystring');
var longjohn = require('longjohn');

var media_root = 'https://radialpoint.kindlingapp.com';
var kindling_shared_secret = process.env.KINDLING_SHARED_SECRET;
var kindling_api_endpoint = 'radialpoint.kindlingapp.com';
var kindling_api_port = 443;

exports.login = function(req, res){
  res.render('login', { 
	media_root: media_root
  });
};

exports.submit_login = function(req, res){
	//res.render('index', { title: 'Express' });

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
	data = querystring.stringify({ 
		'user': req.body.email, 
		'secret': kindling_shared_secret 
	});

	options = {
		host: kindling_api_endpoint,
		port: kindling_api_port,
		path: '/api/authenticator',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length	
		}
	};


	var request = https.request(options, function(response) {
		response.setEncoding('utf8');

		response.on('data', function(kindling_response) {
			console.log('received from kindling:');
			console.log(kindling_response);

			// error handling
			// {"error":"Authentication secret was incorrect","errorCode":"FORBIDDEN"}
			if( kindling_response.error != undefined ) {
				req.method = 'get';
				res.redirect('http://yahoo.com');
			}

			req.method = 'get';
			res.redirect('http://yahoo.com');
		});
		response.on('end', function(chunk) {
			console.log('end received');
		});
	});

	request.on('socket', function(socket) {
		socket.on('connect', function () {
			console.log('socket connected!');
		});
		socket.on('close', function () {
			console.log('socket closed!');
		});
	});


	
	// req.on('error', function(e) {
	// 	console.log('problem with request: ' + e.message);
	// });

	request.write(data);
	//request.end();

	console.log('wrote request');
	//console.log(request);
	// 3. redirect
};
