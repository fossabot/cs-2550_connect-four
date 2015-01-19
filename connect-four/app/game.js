(function() {
	function ConnectFour(board) {
		this.board = board;
		this.width = 7;
		this.height = 6;
		
		this.generateBoard();
		this.attachMouseEventHandlers();
	}
	
	ConnectFour.prototype.generateBoard = function() {
		// make a matrix with 7x0 columns
		this.cells = [[], [], [], [], [], [], []];
		
		// save each TD element in the matrix
		var rows = this.board.querySelectorAll('tr');
		
		for(var i = 0; i < this.width; i++) {
			for(var j = 0; j < this.height; j++) {
				var cell = rows[j].children[i];
				this.cells[i][j] = cell;
				
				// save the coordinates to make later operations easier
				cell.dataset.x = i;
				cell.dataset.y = j;
			}
		}
	};
	
	ConnectFour.prototype.restart = function() {
		var self = this;
		
		this.board.classList.add('emptying');
		
		setTimeout(function() {
			for(var i = 0; i < self.width; i++) {
				for(var j = 0; j < self.height; j++) {
					delete self.cells[i][j].dataset.player;
					self.cells[i][j].classList.remove('next');
				}
			}
		}, 1000);
		
		setTimeout(function() {
			self.board.classList.remove('emptying');
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
				var cell = this.cells[x][y];
				
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
