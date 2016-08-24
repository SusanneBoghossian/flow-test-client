import keystone = require('keystone');
import request = require('request');
import querystring = require('querystring');
import url = require('url');
import promises = require('bluebird');

var constants = require('../../constants.json');
var errors = require('../../errors.js');
var helper = require('../../helper.js');

export default function (req, res) {
    var view = new keystone.View(req, res);
    var action = helper.getAction(req);
    res.locals.section = "Your Cart";

    view.on('get', next => {
        res.locals.title = "Swisscom Shop";
        res.locals.isManual = req.query.isManual === "true" || false;
        next();
    });

    view.on('post', next => {

        var isManual = (req.body.isManual || req.query.isManual) === "true";
        if (!isManual) {
            var host = 'http://' + req.headers.host;
            console.log(host);
            var action = helper.getAction(req);
            var query = querystring.stringify({
                response_type: 'code',
                client_id: constants.mobile.clientId,
                redirect_uri: host + `/video/${action}/mobile-callback`,
                scope: 'openid profile email phone address'
            });

            var options = {
                // USE HTTP here and not HTTPS,  otherwise header enrichment fails!
                url: url.resolve(constants.natelPayServer.replace("https", "http"), 'oauth/authorize?' + query),
            };

            console.log('redirecting to :' + options.url);

            res.redirect(options.url);
        } else {
            var action = helper.getAction(req);
            res.redirect(`/video/${action}/manual`);
        }
    });


    view.render(`video/${action}/cart`);
}
