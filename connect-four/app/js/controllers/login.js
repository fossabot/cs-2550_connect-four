define('controllers/login', [
	'controller',
	'models/user',
	'views/login'
], function(Controller, User, View) {
	'use strict';

	var LoginController = Controller.extend({
		initialize: function() {
			var self = this;

			this.view = new View();
			this.user = new User();

			this.view.on('login', function(options) {
				self.login(options);
			});

			this.user.on('error', function(error) {
				self.view.trigger('error', info);
			});
		},

		login: function(options) {
			var self = this;
			
			this.user.login(options, function(error, info) {
				if(error) {
					self.view.trigger('error', error);
				}
				else {
					window.location.href = 'game.html';
				}
			});
		}
	});

	return LoginController;
});

$(function() {
	require('controllers/login', function(LoginController) {
		new LoginController();
	});
});
