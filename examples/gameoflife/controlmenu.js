define([
	"module",
	"js-studio/domelement/domelement",
	"js-studio/cssloader/cssloader",
	"js-studio/colorpicker/colorpicker"
], function (Module, DOMElement, CSSLoader, ColorPicker) {

	var currentDirectory = Module.uri.replace("controlmenu.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "controlmenu.css");

	return function (container) {

		var controlMenu = this;

		this.speedChanged = function () {};
		this.drawModeChanged = function () {};
		this.lifeSpanChanged = function () {};
		this.birthColorChanged = function () {};
		this.deathColorChanged = function () {};
		this.cellShapeChanged = function () {};

		var menuButton = new DOMElement("div", { id: "menuButton" });
		menuButton.onMouseClick(function () {
			controlMenu.setMenuOpened();
		});
		container.appendChild(menuButton);

		var menuContainer = new DOMElement("div", { id: "menuContainer" });
		container.appendChild(menuContainer);

		var menu = new DOMElement("div", { id: "menu" });
		menuContainer.appendChild(menu);

		var playModeContainer = new DOMElement("div", { id: "playModeContainer" });
		menu.appendChild(playModeContainer);

		var playButton = new DOMElement("div", { id: "playButton" });
		playButton.onMouseClick(function () {
		  playButton.toggleClass("paused");
		  playSpeed.toggleClass("disabled");
			speedSlider.toggleClass("disabled");

			controlMenu.speedChanged(playButton.hasClass("paused") !== true ? speedSlider.value : 0);
		});
		playModeContainer.appendChild(playButton);

		var playSpeed = new DOMElement("div", { id: "playSpeed" });
		playModeContainer.appendChild(playSpeed);

		var speedSlider = new DOMElement("input", { id: "speedSlider", type: "range", min: "1", max: "60", value: "30" });
		var updateSpeed = function () {
		  playSpeed.innerHTML = "x " + (speedSlider.value / 30).toFixed(2);
		  controlMenu.speedChanged(playButton.hasClass("paused") !== true ? speedSlider.value : 0);
		};
		speedSlider.onMouseDrag(updateSpeed);
		speedSlider.onchange = updateSpeed;
		playModeContainer.appendChild(speedSlider);

		var drawModeContainer = new DOMElement("div", { id: "drawModeContainer" });
		menu.appendChild(drawModeContainer);

		var drawButton = new DOMElement("div", { id: "drawButton", class: "selected" });
		drawButton.onMouseClick(function () {
		  drawButton.addClass("selected");
		  eraseButton.removeClass("selected");

			controlMenu.drawModeChanged(true);
		});
		drawModeContainer.appendChild(drawButton);

		var eraseButton = new DOMElement("div", { id: "eraseButton" });
		eraseButton.onMouseClick(function () {
		  eraseButton.addClass("selected");
		  drawButton.removeClass("selected");

			controlMenu.drawModeChanged(false);
		});
		drawModeContainer.appendChild(eraseButton);

		var lifeSpanContainer = new DOMElement("div", { id: "lifeSpanContainer" });
		menu.appendChild(lifeSpanContainer);

		var lifeSpanButton = new DOMElement("div", { id: "lifeSpanButton" });
		lifeSpanButton.onMouseClick(function () {
		  lifeSpanButton.toggleClass("selected");
			lifeSpan.toggleClass("disabled");
			lifeSpanSlider.toggleClass("disabled");
			deathColor.toggleClass("disabled");
			controlMenu.lifeSpanChanged(lifeSpanButton.hasClass("selected") === true ? lifeSpanSlider.value : 0);
		});
		lifeSpanContainer.appendChild(lifeSpanButton);

		var lifeSpan = new DOMElement("div", { id: "lifeSpan", class: "disabled" });
		lifeSpanContainer.appendChild(lifeSpan);

		var lifeSpanSlider = new DOMElement("input", { id: "lifeSpanSlider", type: "range", step: "1", min: "1", max: "1000", value: "500" });
		var updateLifeSpan = function () {
		  lifeSpan.innerHTML = lifeSpanSlider.value;
		  controlMenu.lifeSpanChanged(lifeSpanButton.hasClass("selected") === true ? lifeSpanSlider.value : 0);
		};
		lifeSpanSlider.onMouseDrag(updateLifeSpan);
		lifeSpanSlider.onchange = updateLifeSpan;
		lifeSpanContainer.appendChild(lifeSpanSlider);

		var colorContainer = new DOMElement("div", { id: "colorContainer" });
		menu.appendChild(colorContainer);

		var birthColor = new ColorPicker({
			id: "birthColor",
			colorChanged: function (color) {
				controlMenu.birthColorChanged(color);
			},
			panelOpened: function () {
				deathColor.showPanel(false);
			}
		});
		colorContainer.appendChild(birthColor);

		var deathColor = new ColorPicker({
			id: "deathColor",
			colorChanged: function (color) {
				controlMenu.deathColorChanged(color);
			},
			panelOpened: function () {
				birthColor.showPanel(false);
			}
		});
		colorContainer.appendChild(deathColor);

		var cellShapeContainer = new DOMElement("div", { id: "cellShapeContainer" });
		menu.appendChild(cellShapeContainer);

		var cellShapeWrapper = new DOMElement("div", { id: "cellShapeWrapper" });
		cellShapeWrapper.onMouseClick(function () {
			cellShape.toggleClass("ambientGlow");
			ambientRadius.toggleClass("disabled");
			ambientRadiusSlider.toggleClass("disabled");

			var useAmbientGlow = cellShape.hasClass("ambientGlow") === true;
			var shadowRadius = 5 * ambientRadiusSlider.value;

			cellShape.style.boxShadow = useAmbientGlow ? "0px 0px " + shadowRadius + "px " + shadowRadius + "px white" : "";
			controlMenu.cellShapeChanged(useAmbientGlow ? ambientRadiusSlider.value : 0);
		});
		cellShapeContainer.appendChild(cellShapeWrapper);

		var cellShape = new DOMElement("div", { id: "cellShape" });
		cellShapeWrapper.appendChild(cellShape);

		var ambientRadius = new DOMElement("div", { id: "ambientRadius", class: "disabled" });
		cellShapeContainer.appendChild(ambientRadius);
		var ambientRadiusSlider = new DOMElement("input", { id: "ambientRadiusSlider", class: "disabled", type: "range", step: "1", min: "1", max: "10", value: "1" });
		var updateAmbientRadius = function () {
			var useAmbientGlow = cellShape.hasClass("ambientGlow") === true;
			var shadowRadius = 5 * ambientRadiusSlider.value;

			ambientRadius.innerHTML = ambientRadiusSlider.value;

			cellShape.style.boxShadow = useAmbientGlow ? "0px 0px " + shadowRadius + "px " + shadowRadius + "px white" : "";
			controlMenu.cellShapeChanged(useAmbientGlow ? ambientRadiusSlider.value : 0);
		};
		ambientRadiusSlider.onMouseDrag(updateAmbientRadius);
		ambientRadiusSlider.onchange = updateAmbientRadius;
		cellShapeContainer.appendChild(ambientRadiusSlider);

		this.setMenuOpened = function (opened) {
			menuButton.toggleClass("opened", opened);
			menuContainer.toggleClass("expanded", opened);

			birthColor.showPanel(false);
			deathColor.showPanel(false);
		};

		this.onSpeedChanged = function (speedChanged) {
			controlMenu.speedChanged = speedChanged;
		};

		this.onDrawModeChanged = function (drawModeChanged) {
			controlMenu.drawModeChanged = drawModeChanged;
		};

		this.onLifeSpanChanged = function (lifeSpanChanged) {
			controlMenu.lifeSpanChanged = lifeSpanChanged;
		};

		this.onBirthColorChanged = function (birthColorChanged) {
			controlMenu.birthColorChanged = birthColorChanged;
		};

		this.onDeathColorChanged = function (deathColorChanged) {
			controlMenu.deathColorChanged = deathColorChanged;
		};

		this.onCellShapeChanged = function (cellShapeChanged) {
			controlMenu.cellShapeChanged = cellShapeChanged;
		};

		this.updateStatus = function (status) {
			playButton.toggleClass("paused", status.updating !== true);
			playSpeed.toggleClass("disabled", status.updating !== true);
			speedSlider.toggleClass("disabled", status.updating !== true);
			speedSlider.value = status.speed || 30;
			playSpeed.innerHTML = "x " + (speedSlider.value / 30).toFixed(2);
			drawButton.toggleClass("selected", status.drawMode !== false);
			eraseButton.toggleClass("selected", status.drawMode === false);
			lifeSpanButton.toggleClass("selected", status.lifeSpan > 0);
			lifeSpan.toggleClass("disabled", !(status.lifeSpan > 0));
			lifeSpanSlider.toggleClass("disabled", !(status.lifeSpan > 0));
			lifeSpanSlider.value = status.lifeSpan || 500;
			lifeSpan.innerHTML = lifeSpanSlider.value;
			birthColor.setColor(status.birthColor);
			deathColor.setColor(status.deathColor);
			cellShape.toggleClass("ambientGlow", status.ambientRadius > 0);
			ambientRadius.toggleClass("disabled", !(status.ambientRadius > 0));
			ambientRadiusSlider.toggleClass("disabled", !(status.ambientRadius > 0));
			ambientRadiusSlider.value = status.ambientRadius || 0;
			ambientRadius.innerHTML = ambientRadiusSlider.value;
		};
	};
});
