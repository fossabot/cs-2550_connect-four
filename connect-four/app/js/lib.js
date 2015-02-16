var cs2550_lib = (function() {
	function Library(val) {
		this.generatePolyfills();
	};

	Library.prototype.generatePolyfills = function() {
		if(typeof HTMLCollection.prototype.forEach === 'undefined') {
			HTMLCollection.prototype.forEach = function(func) {
				for(var i = 0; i < this.length; i++) {
					func(this[i]);
				}
			}
		}
	};

	CallbackHandler = (function() {
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
		}

		return CallbackHandler;
	})();

	ElementDescriptor = (function() {
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
			}

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
			if(val.indexOf('#') === 0) {
				var element = document.getElementById(val.substr(1));
				obj = new ElementDescriptor(element);
			}
			else if(val.indexOf('.') === 0) {
				var elements = document.getElementsByClassName(val.substr(1));
				obj = new ElementDescriptor(elements);
			}
			else {
				var elements = document.getElementsByTagName(val.substr(1));
				obj = new ElementDescriptor(elements);
			}

			return obj;
		}
	}).bind(lib);

	executor.load = lib.load.bind(lib);
	executor.beforeUnload = lib.beforeUnload.bind(lib);

	return executor;
})();

if(window && !window.$) {
	window.$ = cs2550_lib;
}
