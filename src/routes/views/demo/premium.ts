import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');


exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);

	view.on('get', next => {
        res.locals.title = "iApp Premium";
		res.locals.premium = true;
		res.locals.section = "Funktionen freigeschaltet!";
		next();
	});

	view.render('demo/register/premium');
}
