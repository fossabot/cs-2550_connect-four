define('ConnectFour.view', function() {
	"use strict";

	function View(board, width, height) {
		this.board = board;
		this.width = width;
		this.height = height;

		this.generateBoard();
		this.attachMouseEventHandlers();
	}

	View.prototype = require('EventEmitterFactory')();

	// creates the DOM for the board
	View.prototype.generateBoard = function() {
		var table = document.createElement('table');
		var cells = [];

		for(var y = 0; y < this.height; y++) {
			var row = document.createElement('tr');
			cells.push([]);

			for(var x = 0; x < this.width; x++) {
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;

				cells[y][x] = cell;
				row.appendChild(cell);
			}

			table.appendChild(row);
		}

		this.cells = cells;
		this.board.appendChild(table);
	};

	View.prototype.loadBoard = function(state) {
		if(state.board.length != this.height || state.board[0].length != this.width) {
			throw 'You can only restore a game that matches the dimensions used during initialization';
		}

		this.setTurn(state.turn);

		for(var x = 0; x < this.width; x++) {
			for(var y = 0; y < this.height; y++) {
				this.setCell({x:x, y:y}, state.board[y][x]);
			}
		}
	};

	View.prototype.setCell = function(cell, state) {
		if(state !== null) {
			this.cells[cell.y][cell.x].dataset.player = state;
			this.cells[cell.y][cell.x].classList.remove('next');
		}
		else if(this.cells[cell.y][cell.x].dataset.player) {
			delete this.cells[cell.y][cell.x].dataset.player;
		}
	};

	View.prototype.setTurn = function(player) {
		this.board.dataset.turn = player;
	};

	View.prototype.flip = function(mid_cb, end_cb) {
		var self = this;
		this.board.classList.add('emptying');

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
			self.board.classList.remove('emptying');

			if(end_cb) {
				end_cb();
			}
		}, 2000);
	};

	// attaches the mouse event handlers
	View.prototype.attachMouseEventHandlers = function() {
		var self = this;

		this.board.onclick = function() {
			// find the cell to fill, and the new cell to highlight
			var target = window.event.target;
			var cells = self.findOpenSpaceForTarget.call(self, target, true);

			if(cells) {
				var fill = cells[0];
				var highlight = cells[1];

				if(fill) {
					fill.classList.remove('next');

					if(self.emit('clickCell', {x: +fill.dataset.x, y: +fill.dataset.y})) {
						if(highlight) {
							highlight.classList.add('next');
						}
					}
				}
			}
		};

		this.board.onmouseover = function() {
			if(this.classList.contains('emptying')) {
				return;
			}
			// find the cell to highlight
			var target = window.event.target;
			var highlight = self.findOpenSpaceForTarget.call(self, target);

			if(highlight) {
				highlight.classList.add('next');
			}
		};

		this.board.onmouseout = function() {
			// find the cell to unhighlight
			var target = window.event.target;
			var highlight = self.findOpenSpaceForTarget.call(self, target);

			if(highlight) {
				highlight.classList.remove('next');
			}
		};
	};

	// finds the next open space in the same column as a target
	View.prototype.findOpenSpaceForTarget = function(target, find_prev) {
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

	return View;
});
