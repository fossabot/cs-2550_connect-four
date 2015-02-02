(function() {
	"use strict";

	function ConnectFour(board) {
		this.board = board;
		this.width = 7;
		this.height = 6;

		this.generateBoard(this.width, this.height);
		this.attachMouseEventHandlers();

		this.restoreState([
			[null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null],
			[null, null, null, null, 'red', null, null],
			['red', 'red', null, 'black', 'black', null, null],
			['red', 'black', 'black', 'black', 'red', 'black', null],
			['red', 'black', 'red', 'red', 'black', 'black', 'red']
		]);
	}

	ConnectFour.prototype.generateBoard = function(width, height) {
		var table = document.createElement('table');
		var cells = [];

		for(var y = 0; y < height; y++) {
			var row = document.createElement('tr');
			cells.push([]);

			for(var x = 0; x < width; x++) {
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
		this.board.dataset.turn = "red";
	};

	ConnectFour.prototype.restoreState = function(state) {
		if(state.length != this.height || state[0].length != this.width) {
			throw {
				message: 'You can only restore a game that matches the current dimensions'
			};
		}

		for(var x = 0; x < this.width; x++) {
			for(var y = 0; y < this.height; y++) {
				var turn = state[y][x];

				if(turn !== null) {
					this.cells[y][x].dataset.player = turn;
				}
				else {
					delete this.cells[y][x].dataset.player;
				}
			}
		}
	};

	ConnectFour.prototype.restart = function() {
		var self = this;

		this.board.classList.add('emptying');

		setTimeout(function() {
			for(var i = 0; i < self.height; i++) {
				for(var j = 0; j < self.width; j++) {
					delete self.cells[i][j].dataset.player;
					self.cells[i][j].classList.remove('next');
				}
			}
		}, 1000);

		setTimeout(function() {
			self.board.classList.remove('emptying');
			self.board.dataset.turn = 'red';
		}, 2000);
	};

	// attaches the mouse event handlers
	ConnectFour.prototype.attachMouseEventHandlers = function() {
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
					fill.dataset.player = board.dataset.turn;

					// toggle the current turn
					self.board.dataset.turn = board.dataset.turn == 'red' ? 'black' : 'red';

					if(highlight) {
						highlight.classList.add('next');
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
	ConnectFour.prototype.findOpenSpaceForTarget = function(target, find_prev) {
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

	var board = document.getElementById('connect-four');
	window.game = new ConnectFour(board);
})();
