define('ConnectFour.model', function() {
	"use strict";

	var PLAYER = {
		RED: 'red',
		BLACK: 'black'
	};

	function Model(width, height) {
		this.width = width;
		this.height = height;
		this.restart();
	}

	Model.PLAYER = PLAYER;

	Model.prototype = require('EventEmitterFactory')();

	Model.prototype.restart = function() {
		this.turn = PLAYER.RED;
		this.board = [];

		for(var y = 0; y < this.height; y++) {
			this.board[y] = [];

			for(var x = 0; x < this.width; x++) {
				this.board[y][x] = null;
			}
		}

		this.emit('restart', {
			turn: this.turn,
			board: this.board
		});
	};

	Model.prototype.loadBoard = function(state) {
		if(state.board.length != this.height || state.board[0].length != this.width) {
			throw 'You can only restore a game that matches the dimensions used during initialization';
		}

		this.turn = state.turn;
		this.board = state.board;
		this.emit('loadBoard', state);
	};

	Model.prototype.setCell = function(cell, player) {
		if(cell.y === (this.height - 1) || this.board[cell.y + 1][cell.x] !== null) {
			this.board[cell.y][cell.x] = player;
			this.emit('setCell', cell, player);

			return true;
		}
	};

	Model.prototype.setTurn = function(turn) {
		this.turn = turn;
		this.emit('setTurn', turn);
	};

	Model.prototype.makeMove = function(cell) {
		var player = this.turn;

		if(this.setCell(cell, player)) {
			this.setTurn(player === PLAYER.RED ? PLAYER.BLACK : PLAYER.RED);
			this.emit('madeMove', cell, player);

			return true;
		}
		else {
			return false;
		}
	};

	return Model;
});
