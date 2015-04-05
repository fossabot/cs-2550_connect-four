define('lib/core', function() {
	'use strict';

	var root = null;
	var ready = false;

	var Library = function(selector, context) {
		return new Library.fn.init(selector, context);
	};

	Library.extend = function(target) {
		if(!target) {
			return null;
		}

		for(var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for(var key in arguments[i]) {
				target[key] = arguments[i][key];
			}
		}
	};

	Library.fn = Library.prototype = {
		constructor: Library,
		find: function(selector) {
			return this.constructor(selector, this);
		},

		each: function(handler) {
			for(var i = 0; i < this.length; i++) {
				handler.call(this[i]);
			}

			return this;
		},

		ready: function(handler) {
			if(ready) {
				handler.apply(root);
			}
			else {
				window.addEventListener('load', function() {
					handler.apply(root);
				});
			}

			return this;
		}
	};

	Library.fn.init = function(selector, context) {
		if(!selector) {
			// handle empty selectors
			return this;
		}

		if(typeof selector === 'string') {
			if(selector[0] === '#' && !context) {
				// handle $(#id)

				this[0] = document.getElementById(selector.substr(1));
				this.length = 1;

				return this;
			}
			else {
				// handle $(expr, context)

				if(context instanceof Library) {
					context = context[0];
				}

				var elements = (context || document).querySelectorAll(selector);

				for(var i = 0; i < elements.length; i++) {
					this[i] = elements[i];
				}

				this.length = elements.length;

				return this;
			}
		}
		else if(selector.nodeType) {
			// handle $(DOM Element)

			this[0] = selector;
			this.length = 1;

			return this;
		}
		else if(typeof selector === 'function') {
			// handle $(function)
			return root.ready(selector);
		}
	};

	Library.fn.init.prototype = Library.fn;

	root = new Library.fn.init(document);

	root.ready(function() {
		ready = true;
	});

	return Library;
});

define('lib', ['lib/core'], function(Library) {
	Library.extend(Library.fn, {
		on: function(event, handler) {
			this.each(function() {
				this.addEventListener(event, function(e) {
					handler.call(Library(this), e);
				});
			});
		},

		text: function(msg) {
			this.each(function() {
				this.innerText = msg;
			});

			return this;
		},

		remove: function() {
			this.each(function() {
				this.parentNode.removeChild(this);
			});

			return this;
		}
	});

	Library.extend(Library, {
		ajax: function(options) {
			var self = this;
			var request = new XMLHttpRequest();

			request.onreadystatechange = function() {
				if(this.readyState === 4) {
					if(this.status >= 200 && this.status < 300) {
						var type = this.getResponseHeader('content-type');
						var data = this.responseText;

						if(type === 'application/json') {
							data = JSON.parse(data);
						}

						if(options.success) {
							options.success.call(self, this, data);
						}
					}
					else {
						if(options.failure) {
							var err = {};
							options.failure.call(self, this, err);
						}
					}

					if(options.always) {
						options.always.call(self, this);
					}
				}
			};

			request.open(options.method || 'GET', options.url);
			request.send();
		}
	});

	return Library;
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
