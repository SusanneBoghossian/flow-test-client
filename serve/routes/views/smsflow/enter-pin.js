'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

function requestToken(username, password) {
	var postData = querystring.stringify({
		grant_type: 'password',
		username: username,
		password: password,
		scope: 'openid profile email phone address'
	});

	var options = {
		url: url.resolve(constants.natelPayServer, 'oauth/token'),
		headers: {
			'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId, constants.smsflow.clientSecret),
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		},
		body: postData
	};

	return promisify(request.post)(options).then(function (response) {
		var result = JSON.parse(response.body);
		if (result.code) {
			throw new errors.FlowTestClientError(result);
		} else {
			return result;
		}
	});
}

exports['default'] = function (req, res) {
	var view = new keystone.View(req, res);

	view.on('post', function (next) {
		res.locals.enteredPin = req.body.pin || '';
		res.locals.enteredPostCode = req.body.postCode || '';

		res.locals.pin = req.body.hiddenPin;
		res.locals.mobileNumber = req.body.hiddenMobileNumber;

		if (!req.body.pin) {
			req.flash('error', 'PIN is required.');
			return next();
		}
		if (!req.body.postCode) {
			req.flash('error', 'Postcode is required.');
			return next();
		}
		requestToken(req.body.hiddenMobileNumber, req.body.pin).then(function (result) {
			req.session.postCode = req.body.postCode;
			req.session.access_token = result.access_token;
			var idToken = JSON.parse(new Buffer(result.id_token.split('.')[1], 'base64').toString('ascii'));
			if (idToken.aud === constants.smsflow.clientId) {
				res.redirect('/sms-flow/user-info');
			} else {
				req.flash('error', 'ID Token audience does not match Client Id');
				next();
			}
		})['catch'](function (error) {
			res.locals.pin = req.body.hiddenPin;
			res.locals.mobileNumber = req.body.hiddenMobileNumber;
			req.flash('error', error.message);
			next();
		});
	});

	view.on('get', function (next) {
		res.locals.enteredPin = '';
		res.locals.enteredPostCode = '';
		res.locals.pin = req.session.pin;
		res.locals.mobileNumber = req.session.mobileNumber;
		next();
	});

	view.render('sms-flow/enter-pin');
};

module.exports = exports['default'];