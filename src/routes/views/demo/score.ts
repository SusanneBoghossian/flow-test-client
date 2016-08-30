import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');
import querystring = require('querystring');

var helper = require('../../helper.js');
var constants = require('../../constants.json');
var errors = require('../../errors.js');

function requestToken(username, password) {
	var postData = querystring.stringify({
		grant_type: 'password',
		username: username,
		password: password,
		scope: 'openid profile email phone address'
	});
	var options = {
		url: url.resolve(constants.natelPayServer, 'oauth/token'),
		headers: {
			'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId,constants.smsflow.clientSecret),
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		},
		body: postData
	};

	return promises.promisify(request.post)(options)
		.then(response => {
			var result = JSON.parse(response['body']);
			if (result.code) {
				throw new errors.FlowTestClientError(result);
			} else {
				return result;
			}
		});
}

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    res.locals.section = "Score anzeigen";

    view.on('get', next => {
        console.log("hallo from score.ts file");
        res.locals.title = "iApp";
        res.locals.requiredText = "Feld muss ausgefüllt sein";
        res.locals.hint = "Bitte füllen Sie das Formular aus."
        res.locals.address = {};
        res.locals.userInfo = {};       
        next ();
    });
    view.on('post', next => {//res.locals gets undefined    
        req.session.myscore = req.body.firstname;
        //res.locals.userInfo.given_name = req.body.userInfo.given_name;
        res.redirect('/demo/score/result');
    });
    view.render('demo/score/score');
};


