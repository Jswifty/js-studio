define([
	"js-studio/mouse/mouse",
	"js-studio/mouse/mouselistener",
	"js-studio/canvasview/canvasview"
], function (Mouse, MouseListener, CanvasView) {

	return function (container, rows, columns, speed) {

		var lifeGrid = this;

		this.rows = rows || 400;
		this.columns = columns || 400;

		this.color = { r: 255, g: 125, b: 0 };

		this.lifeSpan = 500;

		this.drawMode = true;

		this.timeInterval = 1 / (speed || 30);
		this.timeBuffer = 0;

		this.grid = [];
		this.shadowCells = [];

		/* Create a CanvasView to draw the life grid. */
		this.canvasView = new CanvasView(container);
		this.canvasView.canvas.style.boxShadow = "0px 0px 5px 2px white";
		this.canvasView.onResize = function () {
			var length = Math.min(container.offsetWidth, container.offsetHeight) - 20;
			var canvas = lifeGrid.canvasView.canvas;

			canvas.width = length;
			canvas.height = length;
			canvas.style.top = ((container.offsetHeight - length) / 2) + "px";
			canvas.style.left = ((container.offsetWidth - length) / 2) + "px";
		};
		this.canvasView.onResize();

		/* Create a Mouse and setup a mouse listener to map mouse behaviour to the life grid. */
		this.mouse = new Mouse(this.canvasView.canvas);
		this.mouseListener = new MouseListener();
		this.mouseListener.onMouseOver = this.mouseListener.onMouseOut = this.mouseListener.onMouseMove = this.mouseListener.onMouseDown = function (event) {
			var mouse = event.mouse;
			var position = mouse.position;

			var shadawCells = [];

			if (position && position.x && position.y) {
				var pointX = Math.floor(position.x / lifeGrid.canvasView.getWidth() * lifeGrid.columns);
				var pointY = Math.floor(position.y / lifeGrid.canvasView.getHeight() * lifeGrid.rows);

				if (mouse.isMouseDown === true) {
					for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
						for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
							lifeGrid.setCell(y, x, lifeGrid.drawMode === true);
						}
					}
				}

				for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
					for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
						shadawCells.push({ y: y, x: x });
					}
				}
			}

			lifeGrid.setShadowCells(shadawCells);
		};
		this.mouse.addMouseListener(this.mouseListener);

		this.start = function () {
			lifeGrid.canvasView.start();
		};

		this.pause = function () {
			lifeGrid.canvasView.pause();
		};

		this.resume = function () {
			lifeGrid.canvasView.resume();
		};

		this.setSpeed = function (speed) {
			lifeGrid.timeInterval = speed > 0 ? 1 / speed : 0;
			lifeGrid.timeBuffer = 0;
		};

		this.setDrawMode = function (drawMode) {
			lifeGrid.drawMode = drawMode;
		};

		this.setLifeSpan = function (lifeSpan) {
			lifeGrid.lifeSpan = parseInt(lifeSpan, 10);
		};

		this.setColor = function (color) {
			lifeGrid.color = color;
		};

		this.getCell = function (y, x) {
			return lifeGrid.grid[y][x];
		};

		this.setCell = function (y, x, alive) {
			lifeGrid.grid[y][x] = alive ? Math.max(1, lifeGrid.grid[y][x]) : 0;
		};

		this.setShadowCells = function (shadowCells) {
			lifeGrid.shadowCells = shadowCells;
		};

		this.updateCellState = function (y, x, grid) {
			var cellAge = grid[y][x];

			if (lifeGrid.lifeSpan > 0 && cellAge >= lifeGrid.lifeSpan) {
				return 0;
			} else {
				var numOfLiveNeighbours = 0;

				for (var sideY = Math.max(0, y - 1); sideY <= y + 1 && sideY < lifeGrid.rows; sideY++) {
					for (var sideX = Math.max(0, x - 1); sideX <= x + 1 && sideX < lifeGrid.columns; sideX++) {
						if ((sideY !== y || sideX !== x) && grid[sideY][sideX] > 0) {
							numOfLiveNeighbours++;
						}
					}
				}

				if (numOfLiveNeighbours === 3) {
	        cellAge += 1;
	      } else if (numOfLiveNeighbours !== 2) {
	        cellAge = 0;
	      }

	      if (cellAge > 0) {
	        cellAge++;
	      }
			}

      return cellAge;
		};

		this.reset = function () {
			for (var y = 0; y < lifeGrid.rows; y++) {
				lifeGrid.grid[y] = [];

				for (var x = 0; x < lifeGrid.columns; x++) {
					lifeGrid.grid[y][x] = 0;
				}
			}
		};

		this.render = function (timeDiff) {
			lifeGrid.timeBuffer += timeDiff;

			while (lifeGrid.timeInterval > 0 && lifeGrid.timeBuffer >= lifeGrid.timeInterval) {
				lifeGrid.timeBuffer -= lifeGrid.timeInterval;
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
				context.clearRect(0, 0, width, height);

				var cellWidth = width / lifeGrid.columns;
				var cellHeight = height / lifeGrid.rows;

				lifeGrid.drawShadowCells(context, cellWidth, cellHeight);

				context.fillStyle = "rgba(" + lifeGrid.color.r + ", " + lifeGrid.color.g + ", " + lifeGrid.color.b + ", " + lifeGrid.color.a + ")";

				for (var y = 0; y < lifeGrid.rows; y++) {
					for (var x = 0; x < lifeGrid.columns; x++) {
						lifeGrid.drawCell(lifeGrid.getCell(y, x), y, x, context, cellWidth, cellHeight);
					}
				}
			});
		};

		this.drawShadowCells = function (context, cellWidth, cellHeight) {
			context.fillStyle = "rgba(125, 125, 125, 0.5)";

			var shadowCells = lifeGrid.shadowCells;

			for (var i = 0; i < shadowCells.length; i++) {
				var x = shadowCells[i].x;
				var y = shadowCells[i].y;

				context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
			}
		};

		this.drawCell = function (cellAge, y, x, context, cellWidth, cellHeight) {
			if (cellAge > 0) {
				context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
			}
		};

		this.updateStatus = function (status) {
			lifeGrid.rows = status.rows;
			lifeGrid.columns = status.columns;
			lifeGrid.reset();
			lifeGrid.drawMode = status.drawMode;
			lifeGrid.setSpeed(status.updating === true ? status.speed : 0);
			lifeGrid.setLifeSpan(status.lifeSpan || 0);
			lifeGrid.setColor(status.color || { r: 255, g: 125, b: 0 });
		};

		this.canvasView.animator.addRenderFunction(this, this.render);

		this.reset();
	};
});
