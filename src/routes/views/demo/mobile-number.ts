import keystone = require('keystone');
import request = require('request');
import querystring = require('querystring');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

function requestMSISDN(ipToken) {

	var options = {
		url: url.resolve(constants.natelPayServer, 'api/msisdn?ipToken=' + encodeURIComponent(ipToken)),
		headers: {
			'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId, constants.smsflow.clientSecret),
		}
	};

	return promises.promisify(request.get)(options)
		.then(response => {
			var result = JSON.parse(response['body']);
			if (result.code) {
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}

export default function (req, res) {
	var view = new keystone.View(req, res);
	var host = 'http://' + req.headers.host;
	console.log(host);

	requestMSISDN(req.body.ipToken).then(result => {
		res.redirect("/demo/mobile-number-callback?msisdn=" + result.msisdn);
	}).catch(e => {
		console.log(e);
		req.session.error = "" + e;
		res.redirect("/demo");
	});
}