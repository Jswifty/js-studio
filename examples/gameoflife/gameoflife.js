/**  
 *	gameoflife.js is an object class which.
 */ 
define(function (require) {

	return function (rows, columns) {
	
		var gameoflife = this;
	
		this.rows = rows;
		this.columns = columns;
		this.grid = [];

		this.getCell = function (y, x) {
			return gameoflife.grid[y][x];
		}

		this.updateCellState = function (y, x, grid) {

			var numOfLiveNeighbours = 0;

			for (var sideY = Math.max(0, y - 1); sideY <= y + 1 && sideY < gameoflife.rows; sideY++) {
				for (var sideX = Math.max(0, x - 1); sideX <= x + 1 && sideX < gameoflife.columns; sideX++) {
					if ((sideY !== y || sideX !== x) && grid[sideY][sideX] === true) {
						numOfLiveNeighbours++;
					}
				}
			}

			return numOfLiveNeighbours === 3 || (numOfLiveNeighbours === 2 && grid[y][x] === true);
		};

		this.reset = function () {

			for (var y = 0; y < gameoflife.rows; y++) {
				gameoflife.grid[y] = [];
				for (var x = 0; x < gameoflife.columns; x++) {
					gameoflife.setCell(y, x, false);
				}
			}
		};

		this.update = function () {

			var newGrid = [];

			for (var y = 0; y < gameoflife.rows; y++) {
				newGrid[y] = [];
				for (var x = 0; x < gameoflife.columns; x++) {
					newGrid[y][x] = gameoflife.updateCellState(y, x, gameoflife.grid);
				}
			}

			gameoflife.grid = newGrid;
		};

		this.setCell = function (y, x, alive) {
			gameoflife.grid[y][x] = alive;
		};

		this.reset();
	};
});
