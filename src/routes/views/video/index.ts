var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

export default function(req, res) {
	var view = new keystone.View(req, res);
	var action = helper.getAction(req);
	res.locals.section = "";
	
	view.on('get', next => {
		res.locals.title = "Swisscom Shop";
		next();
	});

	view.render(`video/${action}/index`);
}
