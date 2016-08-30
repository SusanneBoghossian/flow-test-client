import keystone = require('keystone');
import request = require('request');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

// function requestUserInfo(access_token, userconsent) {
// 	var options = {
// 		url: url.resolve(constants.natelPayServer, 'api/user') + '?userconsent=' + userconsent + '&schema=openid',
// 		headers: {
// 			'Authorization': 'Bearer ' + access_token,
// 			'Accept': 'application/json'
// 		}
// 	};

// 	return promises.promisify(request.get)(options)
// 		.then(function(response) {
// 			var result = JSON.parse(response['body']);
// 			if (result.code) {
// 				console.log(result);
// 				throw new errors.FlowTestClientError(result);
// 			} else {
// 				return result;
// 			}
// 		});
// }

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
    view.on('post', next => {
        console.log("i am in view.on post");
      
        console.log("the sent body is: ", req.body["address.locality"]);
        //res.locals.userInfo.given_name = req.body.userInfo.given_name;
        res.redirect('/demo/score/result');
    });
    view.render('demo/score/score');
};


