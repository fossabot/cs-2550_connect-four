define('views/login', ['base'], function(Base) {
	'use strict';

	var LoginView = Base.extend({
		constructor: function() {
			this.initialize();
		},

		initialize: function() {
			this.form = $('#login').element;

			this.form.addEventListener('submit', function(e) {
				e.preventDefault();

				window.location.href = 'game.html';
			});
		}
	});

	return LoginView;
});
