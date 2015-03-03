define('ConnectFour.controller', ['ConnectFour.model', 'ConnectFour.view'], function(Model, View) {
	'use strict';

	function ConnectFour() {
		var self = this;

		this.data = new Model();
		this.view = new View();

		this.data.on('loadBoard', function(state) {
			self.view.loadBoard(state);
		});

		this.data.on('setCell', function(cell, player) {
			self.view.setCell(cell, player);
		});

		this.data.on('setTurn', function(player) {
			self.view.setTurn(player);
		});

		this.data.on('winnerFound', function(cells, player) {
			self.view.winnerFound(cells, player);
		});

		this.view.on('clickCell', function(cell) {
			return self.data.makeMove(cell);
		});

		this.data.on('restart', function(state) {
			self.view.flip(function() {
				self.view.loadBoard(state);
			});
		});

		this.data.loadSampleBoard();
	}

	ConnectFour.prototype.restart = function() {
		this.data.restart();
	};

	return ConnectFour;
});

$(function() {
	require('ConnectFour.controller', function(ConnectFour) {
		window.game = new ConnectFour();
	});
});
