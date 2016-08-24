/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
"use strict";
var _ = require('lodash');
/**
    Initialises the standard view locals

    The included layout depends on the navLinks array to generate
    the navigation in the header, you may wish to change this array
    or replace it with your own templates / logic.
*/
function initLocals(req, res, next) {
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
}
exports.initLocals = initLocals;
;
/**
    Fetches and clears the flashMessages before a view is rendered
*/
function flashMessages(req, res, next) {
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };
    res.locals.messages = _['any'](flashMessages, function (msgs) {
        return msgs.length;
    }) ? flashMessages : false;
    next();
}
exports.flashMessages = flashMessages;
;
/**
    Prevents people from accessing protected pages when they're not signed in
 */
function requireAdminUser(req, res, next) {
    if (req.user && req.user.isDemo && req.path.indexOf('demo') < 0)
        res.redirect("/demo");
    if (!req.user || !req.user.isAdmin) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/signin?return=' + req.path);
    }
    else {
        next();
    }
}
exports.requireAdminUser = requireAdminUser;
;
function requireDemoUser(req, res, next) {
    if (!req.user || (!req.user.isDemo && !req.user.isAdmin)) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/signin?return=' + req.path);
    }
    else {
        next();
    }
}
exports.requireDemoUser = requireDemoUser;
;
