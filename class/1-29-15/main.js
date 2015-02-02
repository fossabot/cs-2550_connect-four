(function() {
	var onload = [];

	function ElementCollection(elements) {
		this.elements = elements;
		return this;
	};

	ElementCollection.prototype.setText = function(msg) {
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].innerHTML = msg;
		}
	};

	function $(val) {
		var obj = null;

		if(arguments.length === 0) {
			return document;
		}
		else if(typeof val === "string") {
			if(val.indexOf('#') === 0) {
				var element = document.getElementById(val.substr(1));
				obj = new ElementCollection([element]);
			}
			else if(val.indexOf('.') === 0) {
				var elements = document.getElementsByClassName(val.substr(1));
				obj = new ElementCollection(elements);
			}
			else {
				var elements = document.getElementsByTagName(val.substr(1));
				obj = new ElementCollection(elements);
			}

			return obj;
		}
		else if(typeof val === "function") {
			onload.push(val);
		}

		return obj;
	}

	if(window && document) {
		window.onload = function() {
			onload.forEach(function(c) {
				c();
			})
		}
	}

	window.$ = $;
})();

$(function() {
	$('#title').setText('msg');
	$('.msg').setText('inDiv');
});
