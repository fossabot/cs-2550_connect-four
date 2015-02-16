define('ConnectFour.controller', ['ConnectFour.model', 'ConnectFour.view'], function(Model, View) {
	"use strict";

	function ConnectFour(board) {
		var self = this;

		this.width = 7;
		this.height = 6;

		this.data = new Model(this.width, this.height);
		this.view = new View(board, this.width, this.height);

		this.data.on('loadedBoard', function(state) {
			self.view.loadBoard(state);
		});

		this.data.on('setCell', function(cell, player) {
			self.view.setCell(cell, player);
		});

		this.data.on('setTurn', function(player) {
			self.view.setTurn(player);
		});

		this.view.on('cell_clicked', function(cell) {
			return self.data.makeMove(cell);
		});

		this.data.on('restart', function(state) {
			self.view.flip(function() {
				self.view.loadBoard(state);
			});
		});

		this.data.loadBoard({
			board: [
				[null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null],
				[null, null, null, null, 'red', null, null],
				['red', 'red', null, 'black', 'black', null, null],
				['red', 'black', 'black', 'black', 'red', 'black', null],
				['red', 'black', 'red', 'red', 'black', 'black', 'red']
			],
			turn: 'red'
		});
	}

	ConnectFour.prototype.restart = function() {
		this.data.restart();
	};

	return ConnectFour;
});

$(function() {
	require('ConnectFour.controller', function(ConnectFour) {
		var board = $('#connect-four').element;
		window.game = new ConnectFour(board);
	});
});
