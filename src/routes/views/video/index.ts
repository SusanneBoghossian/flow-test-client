import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var action = helper.getAction(req);
	res.locals.section = "";
	
	view.on('get', next => {
		res.locals.title = "Swisscom Shop";
		next();
	});

	view.render(`video/${action}/index`);
}
