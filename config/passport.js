var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.id);

});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use('local.signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function (req, email, password, done) {
	var name = req.body.name;
	req.checkBody('email', 'invalid Email').notEmpty().isEmail();
	req.checkBody('name', 'invalid Name').notEmpty();	
	req.checkBody('password', 'invalid password').notEmpty().isLength({
		min: 5
	});
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function (error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({
		email: email,
	}, function (err, user) {
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, {
				message: 'email is already in use'
			});
		}
		var newUser = new User();
		newUser.email = email;
		newUser.name = name;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function (err, result) {
			if (err) {
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));


passport.use('local.signin', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		req.checkBody('email', 'invalid Email').notEmpty().isEmail();
		req.checkBody('password', 'invalid password').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var messages = [];
			errors.forEach(function (error) {
				messages.push(error.msg);
			});
			return done(null, false, req.flash('error', messages));
		}
		User.findOne({
			email: email,
		}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'No User Found'
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'No User Found'
				});
			}
			return done(null, user);
		});
	}));