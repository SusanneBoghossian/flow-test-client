"use strict";
var keystone = require('keystone');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');
function default_1(req, res) {
    var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    var msisdn = req.query.msisdn;
    console.log(msisdn);
    var viewName = msisdn ? "mobile-number" : "index";
    view.on('get', function (next) {
        res.locals.msisdn = msisdn;
        if (!msisdn) {
            req.flash('error', 'No MSISDN Number was found in Header');
        }
        next();
    });
    console.log(viewName);
    view.render("demo/" + viewName);
}
exports.__esModule = true;
exports["default"] = default_1;
