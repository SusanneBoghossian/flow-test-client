"use strict";
var keystone = require('keystone');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
function default_1(req, res) {
    var view = new keystone.View(req, res);
    view.on('get', function (next) {
        res.locals.title = "iApp Premium";
        res.locals.premium = true;
        res.locals.section = "Funktionen freigeschaltet!";
        next();
    });
    view.render('demo/register/premium');
}
exports.__esModule = true;
exports["default"] = default_1;
