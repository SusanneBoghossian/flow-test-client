import keystone = require('keystone');
import request = require('request-promise');
import url = require('url');
import promises = require('bluebird');
import _ = require('lodash');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

function requestStatus(access_token,action) {
	var options = {			
		method: 'GET',
		url: url.resolve(constants.natelPayServer, 'api/' + action) + '?schema=openid',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Accept': 'application/json'	
		}
	};

	return request(options)
		.then(function (res) {				
			var result = res;
			console.log ("show me result",res);
			if(action === "mobile-type" && result.poolId) {
				if(result.poolId === "-700")
					result.billingType = "prepaid";
				else
					result.billingType = "postpaid";
			}
			
			if (result.code) {
				console.log(result.code);
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);

	var action = helper.getAction(req);
	res.locals.section = helper.getSection(action);
	res.locals.status = {};

	view.on('get', next => {
		if (!req.session.access_token)
			return res.redirect("/demo/" + action);

		res.locals.title = "iApp";
		
		var promise;
		
		if(action === "mobile-type") {
			promise = Promise.all([requestStatus(req.session.access_token, "imsi"), requestStatus(req.session.access_token, "roaming"), requestStatus(req.session.access_token, "mobile-type")])
			.then((values)=> _.merge(values[0],values[1],values[2]));
		} else {
			promise = requestStatus(req.session.access_token, action);
		}

		promise
			.then(response => {				
				res.locals.status = response || {};
				delete req.session.access_token;
				next();
			})
			.catch(error => {
				console.log(error);
				req.flash('error', error.message);
				next();
			});
	});

	view.render(`demo/${action}/${action}`);
}