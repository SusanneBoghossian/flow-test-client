var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promisify = require('es6-promisify');

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

	return promisify(request.get)(options)
		.then(response => {
			var result = JSON.parse(response.body);
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