var require, define;

(function() {
	'use strict';

	var modules = {};

	define = function(name, dependencies, fn) {
		if(arguments.length < 2) {
			throw "define needs at least two arguments";
		}
		else if(arguments.length === 2) {
			fn = dependencies;
			dependencies = [];
		}

		modules[name] = window.require(dependencies, fn);
	};

	require = function(dependencies, fn) {
		if(arguments.length === 1) {
			if(typeof dependencies === "string") {
				return modules[dependencies];
			}
			else {
				throw "require needs two arguments, or one string";
			}
		}
		else if(typeof dependencies === "string") {
			dependencies = [dependencies];
		}

		var depArray = [];

		dependencies.forEach(function(item) {
			depArray.push(modules[item]);
		});

		return fn.apply(window, depArray);
	};
})();
