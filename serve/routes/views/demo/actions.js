"use strict";
var keystone = require('keystone');
var constants = require('../../constants.json');
var helper = require('../../helper');
exports = module.exports = function (req, res) {
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
};
