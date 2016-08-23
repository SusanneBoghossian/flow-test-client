"use strict";

var keystone = require('keystone');

exports = module.exports = function (req, res) {

	res.header("Access-Control-Allow-Origin", "*");

	var view = new keystone.View(req, res),
	    locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Finished';

	// Render the view
	view.render('finished');
};