define([
	"js-studio/canvasview/canvasview"
], function (CanvasView) {

	return function (rows, columns, container) {
	
		var lifeGrid = this;

		this.rows = rows;
		this.columns = columns;
		
		this.grid = [];
		
		this.color = {
			r: 255,
			g: 125,
			b: 0
		};

		this.shadowCells = [];
		
		this.paused = false;

		/* Create a CanvasView. */
		this.canvasView = new CanvasView(container);
		this.canvasView.canvas.id = "gameofLife";
		this.canvasView.canvas.style.zIndex = 0;

		this.start = function () {
			lifeGrid.canvasView.start();
		};

		this.pause = function () {
			lifeGrid.paused = true;
		};

		this.resume = function () {
			lifeGrid.paused = false;
		};

		this.setSpeed = function (speed) {
			lifeGrid.canvasView.animator.FPS = speed;
		};

		this.getCell = function (y, x) {
			return lifeGrid.grid[y][x];
		};

		this.setCell = function (y, x, alive) {
			lifeGrid.grid[y][x] = alive;
		};

		this.setShadowCells = function (shadowCells) {
			lifeGrid.shadowCells = shadowCells;
		};

		this.clearShadowCells = function () {
			lifeGrid.shadowCells = [];
		};

		this.updateCellState = function (y, x, grid) {

			var numOfLiveNeighbours = 0;

			for (var sideY = Math.max(0, y - 1); sideY <= y + 1 && sideY < lifeGrid.rows; sideY++) {
				for (var sideX = Math.max(0, x - 1); sideX <= x + 1 && sideX < lifeGrid.columns; sideX++) {
					if ((sideY !== y || sideX !== x) && grid[sideY][sideX] === true) {
						numOfLiveNeighbours++;
					}
				}
			}

			return numOfLiveNeighbours === 3 || (numOfLiveNeighbours === 2 && grid[y][x] === true);
		};

		this.reset = function () {

			for (var y = 0; y < lifeGrid.rows; y++) {
				lifeGrid.grid[y] = [];
				for (var x = 0; x < lifeGrid.columns; x++) {
					lifeGrid.setCell(y, x, false);
				}
			}
		};

		this.render = function () {

			if (lifeGrid.paused === false) {
				lifeGrid.update();
			}

			lifeGrid.draw();
		};

		this.update = function () {

			var newGrid = [];

			for (var y = 0; y < lifeGrid.rows; y++) {
				newGrid[y] = [];
				for (var x = 0; x < lifeGrid.columns; x++) {
					newGrid[y][x] = lifeGrid.updateCellState(y, x, lifeGrid.grid);
				}
			}

			lifeGrid.grid = newGrid;
		};

		this.draw = function () {
			
			lifeGrid.canvasView.draw(function (context, width, height) {

				var cellWidth = width / lifeGrid.columns;
				var cellHeight = height / lifeGrid.rows;
				
				context.clearRect(0, 0, width, height);

				context.fillStyle = "rgba(" + lifeGrid.color.r + ", " + lifeGrid.color.g + ", " + lifeGrid.color.b + ", 0.5)";

				for (var i = 0; i < lifeGrid.shadowCells.length; i++) {

					var x = lifeGrid.shadowCells[i].x;
					var y = lifeGrid.shadowCells[i].y;

					context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
				}

				context.fillStyle = "rgba(" + lifeGrid.color.r + ", " + lifeGrid.color.g + ", " + lifeGrid.color.b + ", 1)";

				for (var y = 0; y < lifeGrid.rows; y++) {
					for (var x = 0; x < lifeGrid.columns; x++) {
						if (lifeGrid.getCell(y, x)) {
							context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
						}
					}
				}
			});
		};

		this.canvasView.animator.addRenderFunction(this, this.render);
		
		this.reset();
	};
});
