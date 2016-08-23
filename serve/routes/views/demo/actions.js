"use strict";
var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');
function default_1(req, res) {
    var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    res.locals.section = helper.getSection(action);
    view.on('get', function (next) {
        res.locals.title = "iApp";
        res.locals.ipTokenUrl = "https://pipe.swisscom.com:8443/getToken";
        if (req.session.error) {
            req.flash('error', req.session.error);
            delete req.session.error;
        }
        next();
    });
    view.render("demo/index");
}
exports.__esModule = true;
exports["default"] = default_1;
