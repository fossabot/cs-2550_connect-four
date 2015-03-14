define('models/user', ['base'], function(Base) {
	'use strict';

	var User = Base.extend({
		loginURL: 'http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php',

		login: function(options, callback) {
			var http = new XMLHttpRequest();
			var post = 'userName=' + options.username + '&password=' + options.password;

			http.open('POST', this.loginURL, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			http.onreadystatechange = function() {
				if(http.readyState == 4 && http.status == 200) {
					var response = JSON.parse(http.responseText);

					if(response.result === 'invalid') {
						callback(response, null);
					}
					else {
						window.location.href = 'game.html';
					}
				}
			};

			http.send(post);
		}
	});

	return User;
});
