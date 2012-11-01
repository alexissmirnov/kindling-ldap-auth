var assert = require('assert');

var ldap = require('ldapjs');
var client = ldap.createClient({
	url: 'ldaps://yul01wdc02.rp.corp:636'
});
var domain = 'rp';


// cat ~/.ldaprc
// TLS_REQCERT never
// ldapsearch -H ldaps://yul01wdc02.rp.corp:636 -D rp\\alexiss -W -v -x -b DC=rp,DC=corp objectClass=user 


function authenticate(user, password, on_success, on_error) {
	// TODO: don't add the domain in case the user specifies one
	client.bind(domain + '\\' + user,  password, function(err) {
		if( err ) {
			on_error(err);
		} else {
			on_success();
		}
	});
}

function ask(question, callback) {
 var stdin = process.stdin, stdout = process.stdout;
 
 stdin.resume();
 stdin.setEncoding('utf8');
 stdout.write(question + ": ");
 
 stdin.once('data', function(data) {
 	data = data.toString().trim();
	callback(data);
 });
}

ask("password:", function(password) {
	authenticate('alexiss', 
		password, 
		function() { 
			client.search("DC=rp,DC=corp", 
				{filter: "(&(objectClass=user)(sAMAccountName=alexissx))"}, 
				function(err, res) {
				  assert.ifError(err);

				  res.on('searchEntry', function(entry) {
				    console.log('entry: ' + JSON.stringify(entry.object));
				  });
				  res.on('searchReference', function(referral) {
				    console.log('referral: ' + referral.uris.join());
				  });
				  res.on('error', function(err) {
				    console.error('error: ' + err.message);
				  });
				  res.on('end', function(result) {
				    console.log('status: ' + result.status);
				    console.log(result);
				    console.log(result.json);
				    
				  });
				});  
		}, 
		function(err) { 
			console.log("ERROR");
	  		console.log(err.dn);
	  		console.log(err.code);
	  		console.log(err.name);
	  		console.log(err.message);
		}
	);
});
