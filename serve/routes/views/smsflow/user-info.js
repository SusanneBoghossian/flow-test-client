"use strict";
var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');
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
    return promisify(request.get)(options)
        .then(function (response) {
        var result = JSON.parse(response.body);
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
    view.on('get', function (next) {
        requestUserInfo(req.session.access_token, req.session.postCode)
            .then(function (response) {
            console.log(response);
            res.locals.address = response.address;
            res.locals.userInfo = response;
            delete res.locals.userInfo.address;
            next();
        })
            .catch(function (error) {
            req.flash('error', error.message);
            next();
        });
    });
    view.render('sms-flow/user-info');
}
exports.__esModule = true;
exports["default"] = default_1;
