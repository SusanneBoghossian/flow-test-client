var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

export default function(req, res) {

	var host ='http://' + req.headers.host;
	console.log(host);

	var query = querystring.stringify({
		response_type: 'code',
		client_id: constants.headerenrichment.clientId,
		redirect_uri: host + '/header-enrichment/enter-consent',
		scope: 'openid profile email phone address'
	});

	var options = {
		// USE HTTP here and not HTTPS,  otherwise header enrichment fails!
		url: url.resolve(constants.natelPayServer.replace("https","http"), 'oauth/authorize?' + query),
	};

	console.log('redirecting to :' + options.url);

	res.redirect(options.url);
}
