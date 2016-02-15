/**  
 *	lifegrid.js is an object class which.
 */ 
define(function (require) {

	var CanvasView = require("./canvasview");

	return function (rows, columns, divContainer, animator) {
	
		var lifegrid = this;

		this.rows = rows;
		this.columns = columns;
		this.grid = [];

		/* Create a CanvasView. */
		this.canvasView = new CanvasView(divContainer, animator);
		this.canvasView.canvas.id = "game_of_life";
		this.canvasView.canvas.style.zIndex = 0;

		this.getCell = function (y, x) {
			return lifegrid.grid[y][x];
		};

		this.setCell = function (y, x, alive) {
			lifegrid.grid[y][x] = alive;
		};

		this.updateCellState = function (y, x, grid) {

			var numOfLiveNeighbours = 0;

			for (var sideY = Math.max(0, y - 1); sideY <= y + 1 && sideY < lifegrid.rows; sideY++) {
				for (var sideX = Math.max(0, x - 1); sideX <= x + 1 && sideX < lifegrid.columns; sideX++) {
					if ((sideY !== y || sideX !== x) && grid[sideY][sideX] === true) {
						numOfLiveNeighbours++;
					}
				}
			}

			return numOfLiveNeighbours === 3 || (numOfLiveNeighbours === 2 && grid[y][x] === true);
		};

		this.reset = function () {

			for (var y = 0; y < lifegrid.rows; y++) {
				lifegrid.grid[y] = [];
				for (var x = 0; x < lifegrid.columns; x++) {
					lifegrid.setCell(y, x, false);
				}
			}
		};

		this.render = function () {

			lifegrid.update();

			lifegrid.canvasView.draw(function (context, width, height) {

				var cellWidth = width / lifegrid.columns;
				var cellHeight = height / lifegrid.rows;
				
				context.clearRect(0, 0, width, height);

				context.fillStyle = "#FF8800";

				for (var y = 0; y < lifegrid.rows; y++) {
					for (var x = 0; x < lifegrid.columns; x++) {
						if (lifegrid.getCell(y, x)) {
							context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
						}
					}
				}
			});
		};

		this.update = function () {

			var newGrid = [];

			for (var y = 0; y < lifegrid.rows; y++) {
				newGrid[y] = [];
				for (var x = 0; x < lifegrid.columns; x++) {
					newGrid[y][x] = lifegrid.updateCellState(y, x, lifegrid.grid);
				}
			}

			lifegrid.grid = newGrid;
		};
	};
});
