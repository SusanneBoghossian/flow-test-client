"use strict";
var keystone = require('keystone');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');
function default_1(req, res) {
    var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    res.locals.section = "";
    view.on('get', function (next) {
        res.locals.title = "Swisscom Shop";
        next();
    });
    view.render("video/" + action + "/index");
}
exports.__esModule = true;
exports["default"] = default_1;
