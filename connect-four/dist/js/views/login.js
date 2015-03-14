define('views/login', function() {
	'use strict';

	function LoginView() {
		this.form = $('#login').element;

		this.form.addEventListener('submit', function(e) {
			e.preventDefault();
			
			window.location.href = 'game.html';
		});
	}

	return LoginView;
});
