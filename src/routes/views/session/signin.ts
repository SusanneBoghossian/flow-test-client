import keystone = require('keystone');

export default function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.showFlashMessages = false;

	view.on('post', {
		action: 'signin'
	}, next => {

		locals.showFlashMessages = true;

		if (!req.body.username || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}

		var onSuccess = () => {
			if(req.query.return) {
				if(req.user.isDemo && req.query.return.indexOf('demo') < 0)
					return res.redirect("/demo");

				return res.redirect(req.query.return);
			}

			res.redirect('/');
		};

		var onFail = () => {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		};

		keystone.session.signin({
			email: req.body.username,
			password: req.body.password
		}, req, res, onSuccess, onFail);

	});

	// Render the view
	view.render('session/signin');

}
