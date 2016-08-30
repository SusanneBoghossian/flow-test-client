import keystone = require('keystone');
import request = require('request-promise');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
   

    view.on('get', next => {    
        res.locals.firstname = req.session.myscore;
        console.log("my value in result from score:", res.locals.testvalue); 
        next ();
    });
    view.on('post', next => {       
    });
    view.render('demo/score/result');
};


