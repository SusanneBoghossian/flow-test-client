'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

exports['default'] = function (req, res) {
	var view = new keystone.View(req, res);

	view.on('get', function (next) {
		res.locals.title = "iApp Premium";
		res.locals.premium = true;
		res.locals.section = "Funktionen freigeschaltet!";
		next();
	});

	view.render('demo/register/premium');
};

module.exports = exports['default'];