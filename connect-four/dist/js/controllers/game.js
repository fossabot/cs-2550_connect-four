define('controllers/game', [
	'controller',
	'models/game',
	'views/game',
	'models/user'
], function(Controller, Model, View, User) {
	'use strict';

	var GameController = Controller.extend({
		initialize: function() {
			var self = this;

			this.data = new Model();
			this.view = new View();
			this.user = new User();

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

			this.view.on('logout', function() {
				self.user.logout();
				window.location.href = 'login.html';
			});

			this.data.loadSampleBoard();

			if(this.user.isLoggedIn()) {
				this.view.setUser(this.user);
			}
			else {
				this.view.setUser(null);
			}
		}
	});

	return GameController;
});

require(['lib', 'controllers/game'], function($, GameController) {
	$(function() {
		var controller = new GameController();
	});
});
