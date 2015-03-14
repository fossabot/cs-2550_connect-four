define('views/game', function() {
	'use strict';

	function GameView() {
		this.game = $('#connect-four').element;
		this.board = document.createElement('table');
		this.game.appendChild(this.board);

		this.attachMouseEventHandlers();
	}

	GameView.prototype = require('EventEmitterFactory')();

	// creates the DOM for the board
	GameView.prototype.generateBoard = function(board) {
		// remove any existing rows
		while(this.board.firstChild) {
			this.board.removeChild(this.board.firstChild);
		}

		var cells = [];

		for(var y = 0; y < this.height; y++) {
			var row = document.createElement('tr');
			cells.push([]);

			for(var x = 0; x < this.width; x++) {
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;

				if(board[y][x]) {
					cell.dataset.player = board[y][x];
				}

				cells[y][x] = cell;
				row.appendChild(cell);
			}

			this.board.appendChild(row);
		}

		this.cells = cells;
	};

	GameView.prototype.loadBoard = function(state) {
		this.height = state.board.length;
		this.width = state.board[0].length;

		this.setTurn(state.turn);
		this.generateBoard(state.board);
	};

	GameView.prototype.setCell = function(cell, state) {
		if(state !== null) {
			this.cells[cell.y][cell.x].dataset.player = state;
			this.cells[cell.y][cell.x].classList.remove('next');
		}
		else if(this.cells[cell.y][cell.x].dataset.player) {
			delete this.cells[cell.y][cell.x].dataset.player;
			this.cells[cell.y][cell.x].classList.remove('winning-cell');
		}
	};

	GameView.prototype.setTurn = function(player) {
		this.game.dataset.turn = player;
		this.game.classList.remove('won');
	};

	GameView.prototype.winnerFound = function(cells, player) {
		var self = this;

		cells.forEach(function(cell) {
			self.cells[cell.y][cell.x].classList.add('winning-cell');
		});

		this.game.classList.add('won');
	};

	GameView.prototype.flip = function(mid_cb, end_cb) {
		var self = this;
		this.game.classList.add('emptying');
		this.emptying = true;

		setTimeout(function() {
			if(mid_cb) {
				mid_cb();
			}

			for(var i = 0; i < self.height; i++) {
				for(var j = 0; j < self.width; j++) {
					self.cells[i][j].classList.remove('next');
				}
			}
		}, 1000);

		setTimeout(function() {
			self.emptying = false;
			self.game.classList.remove('emptying');

			if(end_cb) {
				end_cb();
			}
		}, 2000);
	};

	// attaches the mouse event handlers
	GameView.prototype.attachMouseEventHandlers = function() {
		var self = this;

		this.board.addEventListener('click', function(e) {
			if(this.emptying) {
				return;
			}

			// find the cell to fill, and the new cell to highlight
			var target = e.target;
			var cells = self.findOpenSpaceForTarget.call(self, target, true);

			if(cells) {
				var fill = cells[0];
				var highlight = null;

				if(fill) {
					if(fill.classList.contains('next')) {
						fill.classList.remove('next');
						highlight = cells[1];
					} else {
						// Don't highlight the next cell if the current one wasn't highlighted.
						// This happens on mobile devices.

						highlight = null;
					}

					if(self.emit('clickCell', {x: +fill.dataset.x, y: +fill.dataset.y})) {
						if(highlight) {
							highlight.classList.add('next');
						}
					}
				}
			}
		});

		this.board.addEventListener('mouseover', function(e) {
			if(this.classList.contains('emptying')) {
				return;
			}

			// find the cell to highlight
			var target = e.target;
			var highlight = self.findOpenSpaceForTarget.call(self, target);

			if(highlight) {
				highlight.classList.add('next');
			}
		});

		this.board.addEventListener('mouseout', function(e) {
			// find the cell to unhighlight
			var target = e.target;
			var highlight = self.findOpenSpaceForTarget.call(self, target);

			if(highlight) {
				highlight.classList.remove('next');
			}
		});

		var button = this.game.parentNode.querySelector('button');

		button.addEventListener('click', function(e) {
			self.emit('restart');
		});
	};

	// finds the next open space in the same column as a target
	GameView.prototype.findOpenSpaceForTarget = function(target, find_prev) {
		var prev = null;
		var next = null;

		if(target.tagName === 'TD') {
			var x = target.dataset.x;

			for(var y = 0; y < this.height; y++) {
				var cell = this.cells[y][x];

				if(cell.dataset.player) {
					break;
				}
				else {
					prev = next;
					next = cell;
				}
			}

			if(find_prev) {
				return [next, prev];
			}
			else {
				return next;
			}
		}
		else {
			return null;
		}
	};

	return GameView;
});
