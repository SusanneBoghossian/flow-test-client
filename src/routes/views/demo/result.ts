import keystone = require('keystone');
import request = require('request-promise');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
   

    view.on('get', next => {        
        next ();
    });
    view.on('post', next => {       
    });
    view.render('demo/score/result');
};


