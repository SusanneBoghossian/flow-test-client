/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

import _ = require('lodash');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

export  function initLocals (req, res, next) {

	var locals = res.locals;

	locals.navLinks = [{
		label: 'Home',
		key: 'home',
		href: '/'
	}];

	locals.user = req.user;
    locals.nextButton = "Weiter";

	locals.constants = require('./constants.json');

	next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

export function flashMessages(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _['any'](flashMessages, function(msgs) { //if Err: _.any   has changed to:  _['any']
		return msgs.length;
	}) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

export function requireAdminUser(req, res, next) {

	if(req.user && req.user.isDemo && req.path.indexOf('demo') < 0)
		res.redirect("/demo");

	if (!req.user || !req.user.isAdmin) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin?return=' + req.path);
	} else {
		next();
	}
};

export function requireDemoUser(req, res, next) {

	if (!req.user || (!req.user.isDemo && !req.user.isAdmin)) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin?return=' + req.path);
	} else {
		next();
	}
};
