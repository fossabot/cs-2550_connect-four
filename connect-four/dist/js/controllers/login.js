define('controllers/login', ['base', 'models/user', 'views/login'], function(Base, User, View) {
	'use strict';

	var LoginController = Base.extend({
		constructor: function() {
			var self = this;
			
			this.view = new View();
		}
	});

	return LoginController;
});

$(function() {
	require('controllers/login', function(LoginController) {
		new LoginController();
	});
});
