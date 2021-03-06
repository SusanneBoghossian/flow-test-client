import keystone = require('keystone');
import request = require('request');
import querystring = require('querystring');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

export default function(req, res) {

	var host = 'http://' + req.headers.host;
	console.log(host);

	var query = querystring.stringify({
		response_type: 'code',
		client_id: constants.swisscomsmsflow.clientId,
		redirect_uri: host + '/swisscom-sms-flow/user-info',
		scope: 'openid profile email phone address'
	});

	var options = {
		url: url.resolve(constants.natelPayServer, 'oauth/authorize?' + query),
	};

	console.log('redirecting to :' + options.url);

	res.redirect(options.url);
}
