/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
"use strict";
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};
// Setup Route Bindings
exports = module.exports = function (app) {
    // Views
    app.get('/', middleware.requireAdminUser, routes.views.index);
    app.all('/sms-flow', middleware.requireAdminUser, routes.views.smsflow['enter-mobile']);
    app.all('/sms-flow/enter-pin', middleware.requireAdminUser, routes.views.smsflow['enter-pin']);
    app.get('/sms-flow/user-info', middleware.requireAdminUser, routes.views.smsflow['user-info']);
    app.post('/sms-flow/user-info', middleware.requireAdminUser, routes.views.finished);
    app.all('/header-enrichment', middleware.requireAdminUser, routes.views.headerenrichment['auth']);
    app.all('/header-enrichment/enter-consent', middleware.requireAdminUser, routes.views.headerenrichment['enter-consent']);
    app.get('/header-enrichment/user-info', middleware.requireAdminUser, routes.views.headerenrichment['user-info']);
    app.post('/header-enrichment/user-info', middleware.requireAdminUser, routes.views.finished);
    app.all('/swisscom-sms-flow', middleware.requireAdminUser, routes.views.swisscomsmsflow['auth']);
    app.get('/swisscom-sms-flow/user-info', middleware.requireAdminUser, routes.views.swisscomsmsflow['user-info']);
    app.post('/swisscom-sms-flow/user-info', middleware.requireAdminUser, routes.views.finished);
    app.all('/signin', routes.views.session.signin);
    app.get('/signout', routes.views.session.signout);
    app.get("/demo", middleware.requireDemoUser, routes.views.demo.actions);
    app.post("/demo/mobile-number", middleware.requireDemoUser, routes.views.demo['mobile-number']);
    app.get("/demo/mobile-number-callback", middleware.requireDemoUser, routes.views.demo['mobile-number-callback']);
    app.get("/demo/:action", middleware.requireDemoUser, routes.views.demo.index);
    app.all("/demo/:action/manual", middleware.requireDemoUser, routes.views.demo.manual);
    app.get("/demo/:action/mobile", middleware.requireDemoUser, routes.views.demo.mobile);
    app.get("/demo/:action/mobile-callback", middleware.requireDemoUser, routes.views.demo['mobile-callback']);
    app.get("/demo/:action/mobile-disclaimer", middleware.requireDemoUser, routes.views.demo['mobile-disclaimer']);
    app.all("/demo/:action/user-info", middleware.requireDemoUser, routes.views.demo.manual);
    app.all("/demo/:action/auto", middleware.requireDemoUser, routes.views.demo.auto);
    app.all("/demo/:action/enter-pin", middleware.requireDemoUser, routes.views.demo['enter-pin']);
    app.get("/demo/:action/premium", middleware.requireDemoUser, routes.views.demo.premium);
    app.get("/demo/:action/status", middleware.requireDemoUser, routes.views.demo.status);
    app.get("/video/:action", middleware.requireDemoUser, routes.views.video.index);
    app.all("/video/:action/cart", middleware.requireDemoUser, routes.views.video.cart);
    app.all("/video/:action/manual", middleware.requireDemoUser, routes.views.video.manual);
    app.get("/video/:action/mobile-callback", middleware.requireDemoUser, routes.views.video['mobile-callback']);
    app.get("/video/:action/product", middleware.requireDemoUser, routes.views.video.product);
};
