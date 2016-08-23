var keystone = require('keystone');
var request = require('request');
var url = require('url');
var promisify = require('es6-promisify');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

export default function(req, res) {
	var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    
	view.on('get', next => {
        res.locals.title = "iApp";
		res.locals.section = "Swisscom User Data";
        
        switch(action) {
            case "register": 
                res.locals.disclaimer = "By pressing 'next' you agree to send your Swisscom User Address to this website. Thereby the registration form will be filled out with your information for prompt and careful completion. You will be able to review your inputted personal details in the next step and correct if necessary.";
                break;
            case "mobile-type": 
                res.locals.disclaimer = "By pressing 'next' you agree to send your Swisscom Mobile Profile to this website. You will be able to review your profile in the next step.";
                break;
            case "roaming": 
                res.locals.disclaimer = "By pressing 'next' you agree to send your Swisscom Roaming Profile to this website. You will be able to review your profile in the next step.";
                break;
        }	 
		next();
	});

	view.render(`demo/${action}/mobile-disclaimer`);
}