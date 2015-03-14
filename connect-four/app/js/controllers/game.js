define('controllers/game', ['models/game', 'views/game'], function(Model, View) {
	'use strict';

	function GameController() {
		this.initialize();
	}

	GameController.prototype.initialize = function() {
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

		this.data.on('restart', function(state) {
			self.view.flip(function() {
				self.view.loadBoard(state);
			});
		});

		this.view.on('clickCell', function(cell) {
			return self.data.makeMove(cell);
		});

		this.view.on('restart', function() {
			self.data.restart();
		});

		this.data.loadSampleBoard();
	};

	return GameController;
});

$(function() {
	require('controllers/game', function(GameController) {
		new GameController();
	});
});
