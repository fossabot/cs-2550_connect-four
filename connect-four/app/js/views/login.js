define('views/login', ['view'], function(View) {
	'use strict';

	var LoginView = View.extend({
		initialize: function() {
			var self = this;

			this.form = $('#login').element;

			if(this.getCurrentMediaQuery() === 3) {
				this.form.querySelector('input[name="username"]').focus();
			}

			this.form.addEventListener('submit', function(e) {
				self.events['submit login'].call(self, e);
			});
		},

		enable: function(enabled) {
			var fields = this.form.querySelectorAll('input');

			Array.prototype.forEach.call(fields, function(field) {
				field.disabled = !enabled;
			});
		},

		events: {
			'submit login': function(e) {
				this.enable(false);
				e.preventDefault();

				var info = {
					username: e.currentTarget.querySelector('input[name="username"]').value,
					password: e.currentTarget.querySelector('input[name="password"]').value
				};

				this.emit('login', info);
			},

			error: function(error) {
				this.enable(true);

				var username = this.form.querySelector('input[name="username"]');
				var password = this.form.querySelector('input[name="password"]');

				password.value = '';

				if(this.getCurrentMediaQuery() === 3) {
					if(username.value === '') {
						username.focus();
					}
					else {
						password.focus();
					}
				}

				var container = this.form.querySelector('.error');
				container.innerText = error.message;

				// shake login
				var form = this.form;
				form.classList.add('error');
				form.classList.remove('shake');

				setTimeout(function() {
					form.classList.add('shake');
				}, 0);
			}
		}
	});

	return LoginView;
});
