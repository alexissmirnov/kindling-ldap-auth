var https = require('https');
var querystring = require('querystring');
var ldap = require('ldapjs');
require('longjohn');

var media_root = 'https://radialpoint.kindlingapp.com';
var kindling_shared_secret = process.env.KINDLING_SHARED_SECRET;
var kindling_api_endpoint = 'radialpoint.kindlingapp.com';
var kindling_api_port = 443;

var ldap_client = ldap.createClient({
	url: 'ldaps://yul01wdc02.rp.corp:636'
});
var ldap_domain = 'rp';


// ldapsearch -H ldaps://yul01wdc02.rp.corp:636 -D rp\\alexiss -W -v -x -b DC=rp,DC=corp objectClass=user 

function authenticate(user, password, on_success, on_error) {
	// TODO: don't add the domain in case the user specifies one
	ldap_client.bind(ldap_domain + '\\' + user,  password, function(err) {
		if( err ) {
			on_error(err);
		} else {
			on_success();
		}
	});
}


exports.login = function(req, res){
  res.render('login', { 
	media_root: media_root
  });
};

exports.submit_login = function(req, res){
	var on_auth_success = function() {
		// 2. renerate token
		// 2.1 Make a POST request to your Kindling instance, 
		// At this location: media_root + '/api/rest/v1/authenticator'
		// With these form variables:
		// user=usertoauth@useremaildomain.com
		// secret=yoursharedsecret
		// expires(optional, defaults to 3 hours. for full allowed time formats see here)=+1 day
		// pattern based on 
		// http://nodejs.org/docs/v0.4.11/api/http.html#http.request
		console.log(req.query);

		data = querystring.stringify({ 
			'user': req.body.username, 
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
				kindling_response = JSON.parse(kindling_response);

				console.log(kindling_response.error);
				console.log(kindling_response.success);
				// error handling
				// {"error":"Authentication secret was incorrect","errorCode":"FORBIDDEN"}
				if ( kindling_response.success ) {
					req.method = 'get';
					res.redirect(media_root + '/login/?user=' + 
						kindling_response.username + "&token=" + kindling_response.token);
				} else if( kindling_response.error !== undefined ) {
					res.render('error', {
						'title': kindling_response.error, 
						'description': kindling_response.errorCode
					});
				} else {
					res.render('error', {
						'title': "Unknown error", 
						'description': "!(kindling_response.success) && !(kindling_response.error !== undefined)"
					});
				}
			});
		});



		request.write(data);
		//request.end();

		console.log('wrote request');
	};

	var on_auth_fail = function(err) {
		res.render('error', { title: err.name, description: err.message });
	}
	
	authenticate(req.body.username, req.body.password, on_auth_success, on_auth_fail);
};
