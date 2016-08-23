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

exports['default'] = function (req, res) {

	var host = 'http://' + req.headers.host;
	console.log(host);

	var query = querystring.stringify({
		response_type: 'code',
		client_id: constants.swisscomsmsflow.clientId,
		redirect_uri: host + '/swisscom-sms-flow/user-info',
		scope: 'openid profile email phone address'
	});

	var options = {
		url: url.resolve(constants.natelPayServer, 'oauth/authorize?' + query)
	};

	console.log('redirecting to :' + options.url);

	res.redirect(options.url);
};

module.exports = exports['default'];