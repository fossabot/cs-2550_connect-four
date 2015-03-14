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
				self.user.login(options, function(error, info) {
					if(error) {
						self.view.events.error.call(self.view, error);
					}
					else {

					}
				});
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
