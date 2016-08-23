var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

function requestPin(mobileNumber) {
	var postData = querystring.stringify({
		msisdn: mobileNumber
	});

	var options = {
		url: url.resolve(constants.natelPayServer, 'api/sms'),
		headers: {
			'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId,constants.smsflow.clientSecret),
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		},
		body: postData
	};

	console.log(options);

	return promisify(request.post)(options)
		.then(response => {
			var result = JSON.parse(response.body);
			if (result.code) {
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}

export default function(req, res) {
	var view = new keystone.View(req, res);

	view.on('post', next => {
		requestPin(req.body.mobileNumber)
			.then(pin => {
				req.session.mobileNumber = req.body.mobileNumber;
				req.session.pin = pin;
				res.redirect('/sms-flow/enter-pin');
			})
			.catch(error => {
				req.flash('error', error.message);
				next();
			});
	});

	view.render('sms-flow/enter-mobile');
}
