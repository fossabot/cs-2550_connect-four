define('models/user', ['model'], function(Model) {
	'use strict';

	var User = Model.extend({
		loginURL: 'http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php',

		initialize: function() {
			var info = window.localStorage.getItem('cs2550timestamp');

			if(info) {
				info = JSON.parse(info);
				this.username = info.username;
				this.timestamp = info.timestamp;
			}
			else {
				this.username = null;
				this.timestamp = null;
			}
		},

		isLoggedIn: function() {
			return (this.username !== null);
		},

		login: function(options, callback) {
			var self = this;
			var http = new XMLHttpRequest();
			var post = 'userName=' + options.username + '&password=' + options.password;

			http.open('POST', this.loginURL, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			http.onreadystatechange = function() {
				if(http.readyState === 4 && http.status === 200) {
					var response = JSON.parse(http.responseText);

					if(response.result === 'invalid') {
						response.message = "The username or password you entered is invalid.";
						callback(response, null);
					}
					else {
						var info = {
							username: response.userName,
							timestamp: response.timestamp
						};

						self.username = info.username;
						self.timestamp = info.timestamp;

						window.localStorage.setItem('cs2550timestamp', JSON.stringify(info));
						callback(null, response);
					}
				}
			};

			http.send(post);
		},

		logout: function() {
			window.localStorage.removeItem('cs2550timestamp');
		}
	});

	return User;
});
