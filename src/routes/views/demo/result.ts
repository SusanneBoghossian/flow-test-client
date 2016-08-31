import keystone = require('keystone');
import request = require('request-promise');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
   
    console.log("hello from RESULT");
    view.on('get', next => {    
        res.locals.title = "iApp";
        res.locals.section = "Score anzeigen";
        res.locals.score = req.session.score;        
        var localScoreObj = res.locals.score;
        for (var val in localScoreObj)//gives me firstname, msisdn, etc.
        {            
            var valueToRound = localScoreObj[val].score;
            localScoreObj[val].score = Math.round(valueToRound * 100);
            console.log("myval", localScoreObj[val].score);
            
        }
        console.log("localscore", localScoreObj)//look up if the score has changed to new
        //overgive modified score values 
        res.locals.score = localScoreObj;
        next ();
    });
    view.on('post', next => {       
    });
    view.render('demo/score/result');
};


