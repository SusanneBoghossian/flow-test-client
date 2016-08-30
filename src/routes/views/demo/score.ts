import keystone = require('keystone');
import request = require('request-promise');
import url = require('url');
import promises = require('bluebird');
import querystring = require('querystring');

var helper = require('../../helper.js');
var constants = require('../../constants.json');
var errors = require('../../errors.js');

interface scoreValues {
    msisdn: number;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
}

function requestScore(scoreObj: scoreValues) {
    var postData = querystring.stringify({
        msisdn: scoreObj.msisdn,
        firstname: scoreObj.firstname,
        lastname: scoreObj.lastname,
        address: scoreObj.address,
        city: scoreObj.city,
        // grant_type: "client_credentials"
    });
    var options = {
        method: "POST",
        url: url.resolve(constants.natelPayServer, 'api/score'),
        headers: {
            'Authorization': 'Basic ' + helper.getAuthToken(constants.smsflow.clientId, constants.smsflow.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        },
        body: postData
    };
  
    return request(options)
        .then(function (res) {
            var result = JSON.parse(res);
            console.log ("show me result",result);
            if (result.code) {//an error occured
                console.log("score.ts function request has ERRORS");
                console.log(result.code);
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
        next();
    });
    view.on('post', next => {//res.locals gets undefined    
        
        var scoreObj = {
            msisdn: req.body.msisdn,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            city: req.body.city,    
        }
        var promise;
        promise = requestScore(scoreObj);
        promise.then(response => {
            console.log("promise is ok");
            res.locals.score = response || {};                      
            req.session.score = res.locals.score;          
            console.log("SCORE", req.session.score);
            res.redirect('/demo/score/result');
            //next ();            
        }).catch(error => {
            console.log("promise error logging:::",error);
            req.flash('error', error.message);
            //next();
            res.redirect('/demo/score/score');
        });

        
    });
    view.render('demo/score/score');
};


