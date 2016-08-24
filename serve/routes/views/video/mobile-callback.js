"use strict";
var keystone = require('keystone');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var promises = require('bluebird');
var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');
function requestToken(code) {
    var postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: code
    });
    var options = {
        url: url.resolve(constants.natelPayServer, 'oauth/token'),
        headers: {
            'Authorization': 'Basic ' + helper.getAuthToken(constants.mobile.clientId, constants.mobile.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData
    };
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
    var action = helper.getAction(req);
    view.on('get', function (next) {
        var code = req.query.code;
        requestToken(code)
            .then(function (result) {
            req.session.postCode = req.body.postCode;
            req.session.access_token = result.access_token;
            var idToken = JSON.parse(new Buffer(result.id_token.split('.')[1], 'base64').toString('ascii'));
            if (idToken.aud === constants.mobile.clientId) {
                return res.redirect("/video/" + action + "/manual");
            }
            else {
                req.flash('error', 'ID Token audience does not match Client Id');
                next();
            }
        })
            .catch(function (error) {
            req.flash('error', error.message);
            next();
        });
    });
    view.render("video/" + action + "/index");
}
exports.__esModule = true;
exports["default"] = default_1;
