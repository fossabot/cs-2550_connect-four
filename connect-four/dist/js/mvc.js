define('base', ['extend'], function(extend) {
	var Base = function() {
		this._listeners = {};
		this.initialize();
	};

	Base.prototype = {
		initialize: function() { },

		on: function(event, fn) {
			if(!this._listeners[event]) {
				this._listeners[event] = [];
			}

			this._listeners[event].push(fn);
		},

		off: function(event, fn) {
			if(this._listeners[event]) {
				var idx = this._listeners[event].indexOf(fn);

				if(idx !== -1) {
					this._listeners[event].splice(idx);
				}
			}
		},

		emit: function(event) {
			var args = Array.prototype.slice.call(arguments, 1);
			var success = true;

			if(this._listeners && this._listeners[event]) {
				this._listeners[event].forEach(function(listener) {
					if(listener.apply(this, args) === false) {
						success = false;
					}
				});
			}

			return success;
		},

		trigger: function(name) {
			if(this.events && this.events[name]) {
				this.events[name].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};

	Base.extend = extend;
	Base.prototype.constructor = Base;

	return Base;
});

define('model', ['base'], function(Base) {
	var Model = Base.extend({
		initialize: function() {

		}
	});

	return Model;
});

define('view', ['base'], function(Base) {
	var indicator = document.createElement('div');
	indicator.className = 'media-query-detector';

	$(function() {
		document.body.appendChild(indicator);
	});

	var View = Base.extend({
		initialize: function() {

		},

		getCurrentMediaQuery: function() {
			return parseInt(window.getComputedStyle(indicator).zIndex);
		}
	});

	return View;
});

define('controller', ['base'], function(Base) {
	var Controller = Base.extend({
		initialize: function() {

		}
	});

	return Controller;
});
