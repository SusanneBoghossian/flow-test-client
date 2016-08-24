import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');


export default function(req, res) {
	var view = new keystone.View(req, res);

	view.on('get', next => {
        res.locals.title = "Swisscom Shop";
        next();
	});

	view.render('video/buy/product');
}
