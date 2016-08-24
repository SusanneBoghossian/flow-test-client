import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

export default function(req, res) {
	var view = new keystone.View(req, res);
	var action = helper.getAction(req);
	res.locals.section = helper.getSection(action);
	
	view.on('get', next => {
		res.locals.title = "iApp";
		res.locals.ipTokenUrl = "https://pipe.swisscom.com:8443/getToken";
		
		if(req.session.error) {
			req.flash('error', req.session.error);
			delete req.session.error;
		}
		
		next();
	});

	view.render(`demo/${action}/index`);
}
