import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

function requestUserInfo(access_token, userconsent) {
	var options = {
		url: url.resolve(constants.natelPayServer, 'api/user') + '?userconsent=' + userconsent + '&schema=openid',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Accept': 'application/json'
		}
	};

	return promises.promisify(request.get)(options)
		.then(function(response) {
			var result = JSON.parse(response['body']);
			if (result.code) {
				console.log(result);
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);

	view.on('get', next => {
		requestUserInfo(req.session.access_token, req.session.postCode)
			.then(response => {
				console.log(response);
				res.locals.address = response.address;
				res.locals.userInfo = response;
				delete res.locals.userInfo.address;
				next();
			})
			.catch(error => {
				req.flash('error', error.message);
				next();
			});
	});

	view.render('header-enrichment/user-info');
}
