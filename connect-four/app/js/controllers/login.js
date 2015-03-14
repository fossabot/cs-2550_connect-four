define('controllers/login', ['models/user', 'views/login'], function(User, View) {
	'use strict';

	function LoginController() {
		this.initialize();
	}

	LoginController.prototype.initialize = function() {
		var self = this;

		this.view = new View();
	};

	return LoginController;
});

$(function() {
	require('controllers/login', function(LoginController) {
		new LoginController();
	});
});
