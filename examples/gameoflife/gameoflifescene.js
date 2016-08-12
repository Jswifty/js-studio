define([
	"module",
	"./lifegrid",
	"./controlmenu",
	"js-studio/cssloader/cssloader"
], function (Module, LifeGrid, ControlMenu, CSSLoader) {

	var currentDirectory = Module.uri.replace("gameoflifescene.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "gameoflifescene.css");

	return function (container) {

		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "gameofLifeScene";

		/* Define the status of the game as configurations. */
		var status = {
			rows: 400,
			columns: 400,
			paused: false,
			updating: true,
			speed: 30,
			drawMode: true
		};

		/* Create a life grid with the given dimensions, which draws the grid and updates it. */
		this.lifeGrid = new LifeGrid(container);

		/* Create a control menu, which displays the controls of the grid. */
		this.controlMenu = new ControlMenu(container);
		this.controlMenu.onSpeedChanged(function (speed) {
			scene.lifeGrid.setSpeed(speed);
		});
		this.controlMenu.onDrawModeChanged(function (drawMode) {
			scene.lifeGrid.setDrawMode(drawMode);
		});

		this.startScene = function () {
			scene.lifeGrid.start();
		};

		this.addMouseListener = function (container) {
			scene.lifeGrid.setMouseListener(container);
		};

		this.setStatus = function (status) {
			scene.lifeGrid.updateStatus(status);
			scene.controlMenu.updateStatus(status);
		};

		this.setStatus(status);
	};
});
