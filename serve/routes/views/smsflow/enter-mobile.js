"use strict";
var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promises = require('bluebird');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');
function requestPin(mobileNumber) {
    var postData = querystring.stringify({
        msisdn: mobileNumber
    });
    var options = {
        url: url.resolve(constants.natelPayServer, 'api/sms'),
        headers: {
            'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId, constants.smsflow.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        },
        body: postData
    };
    console.log(options);
    return promises.promisify(request.post)(options)
        .then(function (response) {
        var result = JSON.parse(response['body']);
        if (result.code) {
            throw new errors.FlowTestClientError(result);
        }
        else {
            return result;
        }
    });
}
function default_1(req, res) {
    var view = new keystone.View(req, res);
    view.on('post', function (next) {
        requestPin(req.body.mobileNumber)
            .then(function (pin) {
            req.session.mobileNumber = req.body.mobileNumber;
            req.session.pin = pin;
            res.redirect('/sms-flow/enter-pin');
        })
            .catch(function (error) {
            req.flash('error', error.message);
            next();
        });
    });
    view.render('sms-flow/enter-mobile');
}
exports.__esModule = true;
exports["default"] = default_1;
