/**  
 *	gameoflife.js is an object class which.
 */ 
define(function (require) {

	var LifeGrid = require("lifegrid");
	var ControlMenu = require("controlmenu");
	var Mouse = require("../../src/mouse/mouse");
	var MouseListener = require("../../src/mouse/mouselistener");

	return function (container, rows, columns) {
	
		var gameoflife = this;

		this.isDrawMode = true;

		/* Life grid, which creates a canvas. */
		this.lifeGrid = new LifeGrid(rows, columns, container);
			
		this.mouse = new Mouse(this.lifeGrid.canvasView.canvas);

		this.mouseListener = new MouseListener();
		this.mouseListener.onMouseOver = mouseHandler;
		this.mouseListener.onMouseOut = mouseHandler;
		this.mouseListener.onMouseMove = mouseHandler;
		this.mouseListener.onMouseDown = mouseHandler;
		this.mouseListener.onMouseUp = mouseHandler;
		
		this.mouse.addMouseListener(this.mouseListener);

		function mouseHandler (event) {

			var lifeGrid = gameoflife.lifeGrid;

			var mouse = event.mouse;
			var position = mouse.position;

			if (position && position.x && position.y) {

				var pointX = Math.floor(position.x / lifeGrid.canvasView.getWidth() * lifeGrid.columns);
				var pointY = Math.floor(position.y / lifeGrid.canvasView.getHeight() * lifeGrid.rows);

				if (mouse.isMouseDown === true) {

					for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
						for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
							lifeGrid.setCell(y, x, gameoflife.isDrawMode);
						}
					}
				}

				var shadawCells = [];

				for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
					for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
						shadawCells.push({ y: y, x: x });
					}
				}

				lifeGrid.setShadowCells(shadawCells);
			}

			else {
				lifeGrid.setShadowCells([]);
			}

			lifeGrid.draw();
		}

		this.start = function () {
			gameoflife.lifeGrid.start();
		};

		this.setDrawMode = function (drawMode) {
			gameoflife.isDrawMode = drawMode;
		};

		this.controlMenu = new ControlMenu(container, gameoflife.lifeGrid.pause, gameoflife.lifeGrid.resume, gameoflife.lifeGrid.setSpeed, this.setDrawMode);

		/* Scene Styling. */
		var sceneStyle = document.createElement("style");
		sceneStyle.type = "text/css";
		sceneStyle.innerHTML = [
			".gameOfLifeStyle {",
				"-webkit-user-select: none;",
				"-moz-user-select: none;",
				"-ms-user-select: none;",
				"-o-user-select: none;",
				"user-select: none;",
				"overflow: hidden;",
			"}"
		].join(" ");

		/* Insert the scene styling into the the header of the web page. */
		document.getElementsByTagName("head")[0].appendChild(sceneStyle);

		/* Apply the scene's styling onto the container. */
		container.className = "gameOfLifeStyle";

		/* Finally, reset the game. */
		this.lifeGrid.reset();
	};
});
