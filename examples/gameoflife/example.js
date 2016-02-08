require(["gameoflife", "canvasview", "mouse", "mouselistener"], function(Gameoflife, CanvasView, Mouse, MouseListener) {

	var style = document.createElement("style");
	style.type = "text/css";
	style.id = "mainStyle";
	style.innerHTML = [
		"html, body {",
			"width: 100%;",
			"height: 100%;",
		"}",
		"body {",
			"background: black;",
			"margin: 0px;",
		"}"
	].join(" ");


	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);

	var body = document.getElementsByTagName("body")[0];
	
	var gameoflife = new Gameoflife(500, 500);
	var canvasView = new CanvasView(body);

	for (var y = 10; y < 480; y += 2) {
		for (var x = 10; x < 480; x += 1) {
			gameoflife.setCell(y, x, true);
		}
	}

	canvasView.addRenderFunction(function () {

		canvasView.draw(function (context, width, height) {

			var cellWidth = width / gameoflife.columns;
			var cellHeight = height / gameoflife.rows;
			
			context.clearRect(0, 0, width, height);

			context.fillStyle = "#FF8800";

			for (var y = 0; y < gameoflife.rows; y++) {
				for (var x = 0; x < gameoflife.columns; x++) {
					if (gameoflife.getCell(y, x)) {
						context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
					}
				}
			}
		});

		gameoflife.update();
	});

	canvasView.start();

	var mouse = new Mouse(body);
	var mouseListener = new MouseListener();

	function mouseEvent (event) {

		if (event.mouse.isMouseDown === true) {

			var position = event.mouse.position;

			var pointX = Math.floor(position.x / canvasView.getWidth() * gameoflife.columns);
			var pointY = Math.floor(position.y / canvasView.getHeight() * gameoflife.rows);

			for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < gameoflife.rows; y++) {
				for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < gameoflife.columns; x++) {
					gameoflife.setCell(y, x, true);
				}
			}
		}
	}

	mouseListener.mouseDown(mouseEvent);
	mouseListener.mouseUp(mouseEvent);
	mouseListener.mouseMove(mouseEvent);

	mouse.addMouseListener(mouseListener);
});
