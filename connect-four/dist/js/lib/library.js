define('lib', function() {
	'use strict';

	function Library(val) {
		this.generatePolyfills();
	}

	Library.prototype.generatePolyfills = function() {
		if(typeof HTMLCollection.prototype.forEach === 'undefined') {
			HTMLCollection.prototype.forEach = function(func) {
				for(var i = 0; i < this.length; i++) {
					func(this[i]);
				}
			};
		}
	};

	var CallbackHandler = (function() {
		function CallbackHandler(callback) {
			var self = this;

			this.executor = function() {
				return self.execute.call(self, this, arguments);
			};

			this.executor.handler = this;

			if(arguments.length === 1) {
				this.callback = callback;
			}
		}

		CallbackHandler.prototype = Object.create(Array.prototype);

		CallbackHandler.prototype.execute = function(obj, args) {
			var responses = [];

			for(var i = 0; i < this.length; i++) {
				responses.push(this[i].apply(obj, arguments));
			}

			if(this.callback) {
				return this.callback(responses);
			}
		};

		return CallbackHandler;
	})();

	var ElementDescriptor = (function() {
		function ElementDescriptor(elements) {
			if(elements instanceof HTMLCollection || elements instanceof Array) {
				this.isArray = true;
				this.elements = elements;
			}
			else {
				this.element = elements;
				this.isArray = false;
			}
		}

		ElementDescriptor.prototype.setText = function(msg) {
			var setText = function(e) {
				e.innerHTML = msg;
			};

			if(this.isArray) {
				this.elements.forEach(setText);
			}
			else if(this.element) {
				setText(this.element);
			}
		};

		return ElementDescriptor;
	})();

	Library.prototype.load = function(func) {
		var handler = null;

		if(!window.onload || !window.onload.handler) {
			handler = new CallbackHandler();

			if(window.onload) {
				handler.push(window.onload);
			}

			window.onload = handler.executor;
		}
		else {
			handler = window.onload.handler;
		}

		handler.push(func);
	};

	Library.prototype.beforeUnload = function(func) {
		var handler = null;

		if(!window.onbeforeunload || !window.onbeforeunload.handler) {
			handler = new CallbackHandler(function(items) {
				var messages = items.filter(function(i) {
					return (typeof i === "string");
				});

				if(messages.length > 0) {
					return messages.join('\n');
				}
				else {
					return undefined;
				}
			});

			if(window.onbeforeunload) {
				handler.push(window.onbeforeunload);
			}

			window.onbeforeunload = handler.executor;
		}
		else {
			handler = window.onbeforeunload.handler;
		}

		handler.push(func);
	};

	var lib = new Library();

	var executor = (function(val) {
		var obj = null;

		if(arguments.length === 0) {
			return document;
		}
		else if(typeof val === "function") {
			this.load(val);
			return;
		}
		else if(typeof val === "string") {
			var element, elements;

			if(val.indexOf('#') === 0) {
				element = document.getElementById(val.substr(1));
				obj = new ElementDescriptor(element);
			}
			else if(val.indexOf('.') === 0) {
				elements = document.getElementsByClassName(val.substr(1));
				obj = new ElementDescriptor(elements);
			}
			else {
				elements = document.getElementsByTagName(val.substr(1));
				obj = new ElementDescriptor(elements);
			}

			return obj;
		}
	}).bind(lib);

	executor.load = lib.load.bind(lib);
	executor.beforeUnload = lib.beforeUnload.bind(lib);

	return executor;
});

// allow using on and emit
define('EventEmitter', function() {
	'use strict';

	return {
		on: function(event, fn) {
			if(!this._listeners) {
				this._listeners = {};
			}

			if(!this._listeners[event]) {
				this._listeners[event] = [];
			}

			this._listeners[event].push(fn);
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
		}
	};
});

define('EventEmitterFactory', ['EventEmitter'], function(em) {
	'use strict';

	return function() {
		return Object.create(em);
	};
});

// I know this kinda defeats the purpose of using require, but
// I'm not quite ready to switch to it yet. I'm too attached to $
window.$ = require('lib');
