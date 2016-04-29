define([
	"module",
 	"js-studio/mouse/mouse",
 	"js-studio/mouse/mouselistener",
	"js-studio/classmanager/classmanager"
], function (Module, Mouse, MouseListener, ClassManager) {

	var currentDirectory = Module.uri.replace("controlmenu.js", "");

	/**** CONTROL MENU STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = currentDirectory + "controlmenu.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	var MODE = {
		DRAW: 1,
		ERASE: 2
	}

	return function (container, lifeGrid) {
	
		var controlMenu = this;

		this.drawMode = MODE.DRAW;

		var menuContainer = document.createElement("div");
		menuContainer.id = "menuContainer";

		var menu = document.createElement("div");
		menu.id = "menu";

		var playButton = document.createElement("button");
		playButton.id = "playButton";
		playButton.onclick = function (event) {
			
			ClassManager.toggleClass(playButton, "paused");
			ClassManager.toggleClass(playSpeed, "paused");

			var paused = ClassManager.hasClass(playButton, "paused");

			if (paused === true) {
				lifeGrid.pause();
			} else if (paused === false) {
				lifeGrid.resume();
			}
		};

		menu.appendChild(playButton);

		var playSpeed = document.createElement("div");
		playSpeed.id = "playSpeed";

		menu.appendChild(playSpeed);

		var speedSlider = document.createElement("input");
		speedSlider.id = "speedSlider";
		speedSlider.type = "range";
		speedSlider.min = "1";
		speedSlider.max = "60";
		speedSlider.value = "30";
		speedSlider.onchange = function () {
			playSpeed.innerHTML = "x " + (speedSlider.value / 30).toFixed(2);
			lifeGrid.setSpeed(speedSlider.value);
		};

		menu.appendChild(speedSlider);

		var drawModeContainer = document.createElement("div");
		drawModeContainer.id = "drawModeContainer";

		var drawButton = document.createElement("button");
		drawButton.id = "drawButton";
		drawButton.className = "selected";
		drawButton.onclick = function (event) {
			
			ClassManager.addClass(drawButton, "selected");
			ClassManager.removeClass(eraseButton, "selected");
		
			controlMenu.drawMode = MODE.DRAW;
		};

		var eraseButton = document.createElement("button");
		eraseButton.id = "eraseButton";
		eraseButton.onclick = function (event) {
			
			ClassManager.addClass(eraseButton, "selected");
			ClassManager.removeClass(drawButton, "selected");

			controlMenu.drawMode = MODE.ERASE;
		};

		drawModeContainer.appendChild(drawButton);
		drawModeContainer.appendChild(eraseButton);

		menu.appendChild(drawModeContainer);

		var patternContainer = document.createElement("div");
		patternContainer.id = "patternContainer";

		var patternTitleLabel = document.createElement("span");
		patternTitleLabel.id = "patternTitleLabel";
		patternTitleLabel.innerHTML = "Patterns";

		patternContainer.appendChild(patternTitleLabel);

		menu.appendChild(patternContainer);

		menuContainer.appendChild(menu);

		var menuButton = document.createElement("button");
		menuButton.id = "menuButton";
		menuButton.onclick = function (event) {
			ClassManager.toggleClass(menuButton, "opened");
			ClassManager.toggleClass(menuContainer, "expanded");
		};

		container.appendChild(menuContainer);
		container.appendChild(menuButton);

		lifeGrid.setSpeed(30);

		this.setShowControlMenu = function (show) {
			ClassManager.toggleClass(menuButton, "show", show);
			ClassManager.toggleClass(menuContainer, "show", show);
		};

		this.addMouseListener = function (container) {

			var mouseHandler = function (event) {

				var mouse = event.mouse;
				var position = mouse.position;

				if (position && position.x && position.y) {

					var pointX = Math.floor(position.x / lifeGrid.canvasView.getWidth() * lifeGrid.columns);
					var pointY = Math.floor(position.y / lifeGrid.canvasView.getHeight() * lifeGrid.rows);

					if (mouse.isMouseDown === true) {

						for (var y = Math.max(0, pointY - 1); y <= pointY + 1 && y < lifeGrid.rows; y++) {
							for (var x = Math.max(0, pointX - 1); x <= pointX + 1 && x < lifeGrid.columns; x++) {
								lifeGrid.setCell(y, x, controlMenu.drawMode === MODE.DRAW);
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
					lifeGrid.clearShadowCells();
				}

				lifeGrid.draw();
			}

			if (controlMenu.mouse && controlMenu.mouseListener) {
				controlMenu.mouse.removeMouseListener(controlMenu.mouseListener);
			}

			var mouse = controlMenu.mouse = new Mouse(container);
			var mouseListener = controlMenu.mouseListener = new MouseListener();

			mouseListener.onMouseOver = mouseHandler;
			mouseListener.onMouseOut = mouseHandler;
			mouseListener.onMouseMove = mouseHandler;
			mouseListener.onMouseDown = mouseHandler;
			mouseListener.onMouseUp = mouseHandler;
			
			mouse.addMouseListener(mouseListener);
		};

		this.addMouseListener(lifeGrid.canvasView.canvas);
	};
});
