define([
	"module",
	"./lifegrid",
	"./controlmenu"
], function (Module, LifeGrid, ControlMenu) {

	var uri = Module.uri;
	var currentDirectory = uri.substring(0, uri.lastIndexOf("/") + 1);

	/**** SCENE STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = currentDirectory + "gameoflifescene.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	return function (container, rows, columns) {
	
		var scene = this;

		rows = rows || 400;
		columns = columns || 400;

		/* Apply the scene's styling onto the container. */
		container.className = "gameofLifeScene";

		/* Create a life grid with the given dimensions, which draws the grid and updates it. */
		this.lifeGrid = new LifeGrid(rows, columns, container);

		/* Create a control menu, which displays the controls of the grid. */
		this.controlMenu = new ControlMenu(container, this.lifeGrid);
			
		this.startScene = function () {
			scene.lifeGrid.start();
		};

		this.addMouseListener = function (container) {
			scene.controlMenu.addMouseListener(container);
		};

		this.setShowControlMenu = function (show) {
			scene.controlMenu.setShowControlMenu(show);
		};
	};
});
