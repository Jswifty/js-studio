/**  
 *	gameoflife.js is an object class which.
 */ 
define(function (require) {

	var LifeGrid = require("./lifegrid");
	var Animator = require("./animator");
	var Mouse = require("./mouse");
	var MouseListener = require("./mouselistener");

	return function (divContainer, rows, columns) {
	
		var gameoflife = this;

		/* Create an Animator. */
		this.animator = new Animator();

		/* Life grid, which creates a canvas. */
		this.lifeGrid = new LifeGrid(rows, columns, divContainer, this.animator);

		this.addMouseListener = function (divContainer) {
			
			if (gameoflife.mouse && gameoflife.mouseListener) {
				gameoflife.mouse.removeMouseListener(gameoflife.mouseListener);
			}

			gameoflife.mouse = new Mouse(divContainer);

			gameoflife.mouseListener = new MouseListener();
			gameoflife.mouseListener.mouseOver(gameoflife.mouseHandler);
			gameoflife.mouseListener.mouseOut(gameoflife.mouseHandler);
			gameoflife.mouseListener.mouseMove(gameoflife.mouseHandler);
			gameoflife.mouseListener.mouseDown(gameoflife.mouseHandler);
			gameoflife.mouseListener.mouseUp(gameoflife.mouseHandler);
			
			gameoflife.mouse.addMouseListener(gameoflife.mouseListener);
		};

		this.mouseHandler = function (event) {

			//if (event.mouse.isMouseDown === true) {

				var lifeGrid = gameoflife.lifeGrid
				var position = event.mouse.position;

				if (position !== null && position !== undefined) {

					var pointX = Math.floor(position.x / lifeGrid.canvasView.getWidth() * lifeGrid.columns);
					var pointY = Math.floor(position.y / lifeGrid.canvasView.getHeight() * lifeGrid.rows);

					for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
						for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
							lifeGrid.setCell(y, x, true);
						}
					}
				}
			//}
		};

		this.start = function () {
			gameoflife.animator.start();
		};

		this.pause = function () {
			gameoflife.animator.pause();
		};

		this.resume = function () {
			gameoflife.animator.resume();
		};

		/* Scene Styling. */
		var sceneStyle = document.createElement("style");
		sceneStyle.type = "text/css";
		sceneStyle.innerHTML = ".gameOfLifeStyle { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; }";

		/* Insert the scene styling into the the header of the web page. */
		document.getElementsByTagName("head")[0].appendChild(sceneStyle);

		/* Apply the scene's styling onto the container. */
		divContainer.className = "gameOfLifeStyle";

		this.animator.addRenderFunction(this.lifeGrid, this.lifeGrid.render);

		/* Finally, reset the game. */
		this.lifeGrid.reset();
	};
});
