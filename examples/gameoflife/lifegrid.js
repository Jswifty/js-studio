define([
	"js-studio/mouse/mouse",
	"js-studio/canvasview/canvasview"
], function (Mouse, CanvasView) {

	var PI2 = Math.PI * 2;

	return function (container, rows, columns, speed) {

		var lifeGrid = this;

		lifeGrid.rows = rows || 400;
		lifeGrid.columns = columns || 400;

		lifeGrid.birthColor = { r: 0, g: 255, b: 0, a: 1 };
		lifeGrid.deathColor = { r: 255, g: 125, b: 0, a: 1 };

		lifeGrid.drawMode = true;

		lifeGrid.lifeSpan = 500;

		lifeGrid.ambientGlow = 0;

		lifeGrid.timeInterval = 1 / (speed || 30);
		lifeGrid.timeBuffer = 0;

		lifeGrid.grid = [];
		lifeGrid.shadowCells = [];

		/* Create a CanvasView to draw the life grid. */
		lifeGrid.canvasView = new CanvasView(container);
		lifeGrid.canvasView.style.boxShadow = "0px 0px 5px 0px white";
		lifeGrid.canvasView.onResize(function (width, height) {
			var length = Math.min(width, height) - 20;
			var canvas = lifeGrid.canvasView;

			canvas.width = length;
			canvas.height = length;
			canvas.style.top = ((container.offsetHeight - length) / 2) + "px";
			canvas.style.left = ((container.offsetWidth - length) / 2) + "px";
		});
		lifeGrid.canvasView.setRender(function (context, width, height) {
			context.clearRect(0, 0, width, height);

			if (lifeGrid.ambientGlow > 0) {
				context.globalCompositeOperation = "lighter";
			}

			var cellWidth = width / lifeGrid.columns;
			var cellHeight = height / lifeGrid.rows;

			lifeGrid.drawShadowCells(context, cellWidth, cellHeight);

			for (var y = 0; y < lifeGrid.rows; y++) {
				for (var x = 0; x < lifeGrid.columns; x++) {
					lifeGrid.drawCell(lifeGrid.getCell(y, x), y, x, context, cellWidth, cellHeight);
				}
			}
		});

		/* Create a Mouse and setup a mouse listener to map mouse behaviour to the life grid. */
		lifeGrid.mouse = new Mouse(lifeGrid.canvasView);
		function mouseEvent (event) {
			var mouse = event.mouse;
			var position = mouse.position;

			var shadawCells = [];

			if (mouse.isLeftButton === true && position && position.x && position.y) {
				var pointX = Math.floor(position.x / lifeGrid.canvasView.width * lifeGrid.columns);
				var pointY = Math.floor(position.y / lifeGrid.canvasView.height * lifeGrid.rows);

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
		lifeGrid.mouse.onMouseOver(mouseEvent);
		lifeGrid.mouse.onMouseOut(mouseEvent);
		lifeGrid.mouse.onMouseMove(mouseEvent);
		lifeGrid.mouse.onMouseDown(mouseEvent);

		lifeGrid.start = function () {
			lifeGrid.canvasView.start();
		};

		lifeGrid.pause = function () {
			lifeGrid.canvasView.pause();
		};

		lifeGrid.resume = function () {
			lifeGrid.canvasView.resume();
		};

		lifeGrid.setSpeed = function (speed) {
			lifeGrid.timeInterval = speed > 0 ? 1 / speed : 0;
			lifeGrid.timeBuffer = 0;
		};

		lifeGrid.setDrawMode = function (drawMode) {
			lifeGrid.drawMode = drawMode;
		};

		lifeGrid.setLifeSpan = function (lifeSpan) {
			lifeGrid.lifeSpan = parseInt(lifeSpan, 10);
		};

		lifeGrid.setBirthColor = function (color) {
			lifeGrid.birthColor = color;
		};

		lifeGrid.setDeathColor = function (color) {
			lifeGrid.deathColor = color;
		};

		lifeGrid.setAmbientGlow = function (ambientGlow) {
			lifeGrid.ambientGlow = ambientGlow;
		}

		lifeGrid.getCell = function (y, x) {
			return lifeGrid.grid[y][x];
		};

		lifeGrid.setCell = function (y, x, alive) {
			lifeGrid.grid[y][x] = alive ? Math.max(1, lifeGrid.grid[y][x]) : 0;
		};

		lifeGrid.setShadowCells = function (shadowCells) {
			lifeGrid.shadowCells = shadowCells;
		};

		lifeGrid.reset = function () {
			for (var y = 0; y < lifeGrid.rows; y++) {
				lifeGrid.grid[y] = [];

				for (var x = 0; x < lifeGrid.columns; x++) {
					lifeGrid.grid[y][x] = 0;
				}
			}
		};

		lifeGrid.drawShadowCells = function (context, cellWidth, cellHeight) {
			context.fillStyle = "rgba(125, 125, 125, 0.5)";

			var shadowCells = lifeGrid.shadowCells;

			for (var i = 0; i < shadowCells.length; i++) {
				var x = shadowCells[i].x;
				var y = shadowCells[i].y;

				context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
			}
		};

		lifeGrid.drawCell = function (cellAge, y, x, context, cellWidth, cellHeight) {
			if (cellAge > 0) {
				var red = lifeGrid.birthColor.r;
				var green = lifeGrid.birthColor.g;
				var blue = lifeGrid.birthColor.b;
				var alpha = lifeGrid.birthColor.a;

				if (lifeGrid.lifeSpan > 0) {
					var delta = cellAge / lifeGrid.lifeSpan;

					red += Math.round((lifeGrid.deathColor.r - red) * delta);
					green += Math.round((lifeGrid.deathColor.g - green) * delta);
					blue += Math.round((lifeGrid.deathColor.b - blue) * delta);
					alpha += Math.round((lifeGrid.deathColor.a - alpha) * delta);
				}

				if (lifeGrid.ambientGlow > 0) {
					var centerX = (x + 0.5) * cellWidth;
					var centerY = (y + 0.5) * cellHeight;
					var radius = cellWidth * lifeGrid.ambientGlow;
					var gradient = context.createRadialGradient(centerX ,centerY , 0, centerX, centerY, radius);
					gradient.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
					gradient.addColorStop(0.1, "rgba(255, 255, 255, " + (0.8 * alpha) + ")");
					gradient.addColorStop(0.4, "rgba(" + red + ", " + green + ", " + blue + ", " + (0.2 * alpha) + ")");
					gradient.addColorStop(1, "rgba(" + red + ", " + green + ", " + blue + ", 0)");

					context.beginPath();
          context.fillStyle = gradient;
					context.arc(centerX, centerY, radius, PI2, false);
					context.closePath();
          context.fill();
				} else {
					context.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
					context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
				}
			}
		};

		lifeGrid.update = function (timeDiff) {
			lifeGrid.timeBuffer += timeDiff;

			while (lifeGrid.timeInterval > 0 && lifeGrid.timeBuffer >= lifeGrid.timeInterval) {
				lifeGrid.timeBuffer -= lifeGrid.timeInterval;

				var newGrid = [];

				for (var y = 0; y < lifeGrid.rows; y++) {
					newGrid[y] = [];
					for (var x = 0; x < lifeGrid.columns; x++) {
						newGrid[y][x] = lifeGrid.updateCellState(y, x, lifeGrid.grid);
					}
				}

				lifeGrid.grid = newGrid;
			}
		};

		lifeGrid.updateCellState = function (y, x, grid) {
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

		lifeGrid.updateStatus = function (status) {
			lifeGrid.rows = status.rows;
			lifeGrid.columns = status.columns;
			lifeGrid.reset();
			lifeGrid.drawMode = status.drawMode;
			lifeGrid.setSpeed(status.updating === true ? status.speed : 0);
			lifeGrid.setLifeSpan(status.lifeSpan || 0);
			lifeGrid.setBirthColor(status.birthColor || { r: 0, g: 255, b: 0, a: 1 });
			lifeGrid.setDeathColor(status.deathColor || { r: 255, g: 0, b: 0, a: 1 });
		};

		lifeGrid.canvasView.animator.addRenderFunction(lifeGrid, lifeGrid.update);
		lifeGrid.reset();
	};
});
