define('lib', function() {
	'use strict';

	function Library(val) {
		this.generatePolyfills();
	}

	Library.prototype.generatePolyfills = function() {
		if(typeof window.HTMLCollection.prototype.forEach === 'undefined') {
			window.HTMLCollection.prototype.forEach = function(func) {
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
			if(elements instanceof window.HTMLCollection || elements instanceof Array) {
				if(elements.length === 1) {
					this.isArray = false;
					this.element = elements[0];
				}
				else {
					this.isArray = true;
					this.elements = elements;
				}
			}
			else {
				this.isArray = false;
				this.element = elements;
			}
		}

		ElementDescriptor.prototype.text = function(msg) {
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

		ElementDescriptor.prototype.remove = function() {
			var remove = function(e) {
				e.parentNode.removeChild(e);
			};

			if(this.isArray) {
				this.elements.forEach(remove);
			}
			else if(this.element) {
				remove(this.element);
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

	var executor = (function(val, root) {
		if(arguments.length === 0) {
			return document;
		}
		else if(typeof val === "function") {
			this.load(val);
			return;
		}
		else if(typeof val === "string") {
			if(root === undefined) {
				root = document;
			}

			if(root) {
				var elements = root.querySelector(val);
				return new ElementDescriptor(elements);
			}
			else {
				return new ElementDescriptor([]);
			}
		}
	}).bind(lib);

	executor.load = lib.load.bind(lib);
	executor.beforeUnload = lib.beforeUnload.bind(lib);

	return executor;
});

// allow using inheritance easily
define('extend', function() {
	'use strict';

	var ExtendConstructor = function() { };

	var extend = function(prototypeProperties, staticProperties) {
		var parent = this;
		var child, key;

		if(prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
			// we're overriding the constructor
			child = prototypeProperties.constructor;
		}
		else {
			// we're reusing the original constructor

			child = function() {
				parent.apply(this, arguments);
			};
		}

		// inherit static properties from the parent
		for(key in parent) {
			child[key] = parent[key];
		}

		// We need to setup the prototype chain to inherit from the parent
		// prototype, but without actually calling the constructor
		ExtendConstructor.prototype = parent.prototype;
		child.prototype = new ExtendConstructor();

		// add any prototype properties
		if(prototypeProperties) {
			for(key in prototypeProperties) {
				child.prototype[key] = prototypeProperties[key];
			}
		}

		// add any static properties
		if(staticProperties) {
			for(key in staticProperties) {
				child[key] = staticProperties[key];
			}
		}

		// save the actual constructor
		child.prototype.constructor = child;

		// set a property that can be used to get the parent prototype if needed
		child.__super__ = parent.prototype;

	    return child;
	};

	return extend;
});
