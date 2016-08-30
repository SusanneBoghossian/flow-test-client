import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');
import querystring = require('querystring');

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

	return promises.promisify(request.post)(options)
		.then(response => {
			var result = JSON.parse(response['body']);
			if (result.code) {
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}


exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	
	var action = helper.getAction(req);
	res.locals.section = helper.getSection(action);

	view.on('get', next => {
        res.locals.title = "iApp";
		next();
	});

	view.on('post', next => {
        res.locals.title = "iApp";
		requestPin(req.body.msisdn)
			.then(pin => {
				req.session.msisdn = req.body.msisdn;
				req.session.pin = pin;
				res.redirect(`/demo/${action}/enter-pin`);
			})
			.catch(error => {				
				req.flash('error', error.message);
				next();
			});
	});

	view.render('demo/auto');
}
