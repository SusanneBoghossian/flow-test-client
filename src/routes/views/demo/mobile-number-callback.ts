import keystone = require('keystone');
import request = require('request');
import querystring = require('querystring');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

export default function(req, res) {
	var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    var msisdn = req.query.msisdn;
        console.log(msisdn);
        
    var viewName = msisdn ? "mobile-number" : "index";
    
	view.on('get', next => {
		
        res.locals.msisdn = msisdn;
        
		if(!msisdn){
            req.flash('error', 'No MSISDN Number was found in Header');
        }
        
        next();
	});   
    
    console.log(viewName);
    view.render(`demo/${viewName}`);
}
