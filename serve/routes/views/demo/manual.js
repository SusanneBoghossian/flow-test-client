"use strict";
var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promises = require('bluebird');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
function requestUserInfo(access_token, userconsent) {
    var options = {
        url: url.resolve(constants.natelPayServer, 'api/user') + '?userconsent=' + userconsent + '&schema=openid',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json'
        }
    };
    return promises.promisify(request.get)(options)
        .then(function (response) {
        var result = JSON.parse(response['body']);
        if (result.code) {
            console.log(result);
            throw new errors.FlowTestClientError(result);
        }
        else {
            return result;
        }
    });
}
function default_1(req, res) {
    var view = new keystone.View(req, res);
    res.locals.section = "Funktionen freischalten";
    view.on('get', function (next) {
        res.locals.title = "iApp";
        res.locals.requiredText = "Feld muss ausgefüllt sein";
        if (req.session.access_token) {
            requestUserInfo(req.session.access_token, req.session.postCode)
                .then(function (response) {
                console.log(response);
                res.locals.hint = "Bitte kontrollieren Sie Ihre Angaben.";
                res.locals.address = response.address || {};
                res.locals.userInfo = response || {};
                delete res.locals.userInfo.address;
                delete req.session.access_token;
                delete req.session.postCode;
                next();
            })
                .catch(function (error) {
                req.flash('error', error.message);
                next();
            });
        }
        else {
            res.locals.hint = "Bitte füllen Sie das Formular aus.";
            res.locals.address = {};
            res.locals.userInfo = {};
            next();
        }
    });
    view.on('post', function (next) {
        res.locals.title = "iApp";
        res.redirect('/demo/register/premium');
    });
    view.render('demo/register/manual');
}
exports.__esModule = true;
exports["default"] = default_1;
