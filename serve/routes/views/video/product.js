"use strict";
var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
function default_1(req, res) {
    var view = new keystone.View(req, res);
    view.on('get', function (next) {
        res.locals.title = "Swisscom Shop";
        next();
    });
    view.render('video/buy/product');
}
exports.__esModule = true;
exports["default"] = default_1;
