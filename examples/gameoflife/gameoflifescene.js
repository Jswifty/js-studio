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
			drawMode: true,
			lifeSpan: 5,
			birthColor: { r: 0, g: 255, b: 0, a: 1 },
			deathColor: { r: 255, g: 0, b: 0, a: 1 }
		};

		/* Create a life grid with the given dimensions, which draws the grid and updates it. */
		scene.lifeGrid = new LifeGrid(container);

		/* Create a control menu, which displays the controls of the grid. */
		scene.controlMenu = new ControlMenu(container);
		scene.controlMenu.onSpeedChanged(function (speed) {
			scene.lifeGrid.setSpeed(speed);
		});
		scene.controlMenu.onDrawModeChanged(function (drawMode) {
			scene.lifeGrid.setDrawMode(drawMode);
		});
		scene.controlMenu.onLifeSpanChanged(function (lifeSpan) {
			scene.lifeGrid.setLifeSpan(lifeSpan);
		});
		scene.controlMenu.onBirthColorChanged(function (color) {
			scene.lifeGrid.setBirthColor(color);
		});
		scene.controlMenu.onDeathColorChanged(function (color) {
			scene.lifeGrid.setDeathColor(color);
		});
		scene.controlMenu.onCellShapeChanged(function (ambientGlow) {
			scene.lifeGrid.setAmbientGlow(ambientGlow);
		});

		scene.startScene = function () {
			scene.lifeGrid.start();
		};

		scene.setStatus = function (status) {
			scene.lifeGrid.updateStatus(status);
			scene.controlMenu.updateStatus(status);
		};

		scene.setStatus(status);
	};
});
