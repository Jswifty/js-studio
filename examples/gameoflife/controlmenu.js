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
		this.colorChanged = function () {};

		var menuButton = new DOMElement("div", { id: "menuButton" });
		menuButton.onMouseDown(function () {
		  menuButton.toggleClass("opened");
		  menuContainer.toggleClass("expanded");
		});
		container.appendChild(menuButton);

		var menuContainer = new DOMElement("div", { id: "menuContainer" });
		container.appendChild(menuContainer);

		var menu = new DOMElement("div", { id: "menu" });
		menuContainer.appendChild(menu);

		var playButton = new DOMElement("div", { id: "playButton" });
		playButton.onMouseDown(function () {
		  playButton.toggleClass("paused");
		  playSpeed.toggleClass("paused");

			controlMenu.speedChanged(playButton.hasClass("paused") !== true ? speedSlider.value : 0);
		});
		menu.appendChild(playButton);

		var playSpeed = new DOMElement("div", { id: "playSpeed" });
		menu.appendChild(playSpeed);

		var speedSlider = new DOMElement("input", { id: "speedSlider", type: "range", min: "1", max: "60", value: "30" });
		var updateSpeed = function () {
		  playSpeed.innerHTML = "x " + (speedSlider.value / 30).toFixed(2);
		  controlMenu.speedChanged(playButton.hasClass("paused") !== true ? speedSlider.value : 0);
		};
		speedSlider.onMouseDrag(updateSpeed);
		speedSlider.onchange = updateSpeed;
		menu.appendChild(speedSlider);

		var drawModeContainer = new DOMElement("div", { id: "drawModeContainer" });
		menu.appendChild(drawModeContainer);

		var drawButton = new DOMElement("div", { id: "drawButton", class: "selected" });
		drawButton.onMouseDown(function () {
		  drawButton.addClass("selected");
		  eraseButton.removeClass("selected");

			controlMenu.drawModeChanged(true);
		});
		drawModeContainer.appendChild(drawButton);

		var eraseButton = new DOMElement("div", { id: "eraseButton" });
		eraseButton.onMouseDown(function () {
		  eraseButton.addClass("selected");
		  drawButton.removeClass("selected");

			controlMenu.drawModeChanged(false);
		});
		drawModeContainer.appendChild(eraseButton);

		var lifeSpanContainer = new DOMElement("div", { id: "lifeSpanContainer" });
		menu.appendChild(lifeSpanContainer);

		var lifeSpanButton = new DOMElement("div", { id: "lifeSpanButton" });
		lifeSpanButton.onMouseDown(function () {
		  lifeSpanButton.toggleClass("selected");
			lifeSpan.toggleClass("disabled");
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

		var colorPicker = new ColorPicker();
		colorPicker.id = "lifeSpanColor";
		colorPicker.colorChanged = function (color) {
			controlMenu.colorChanged(color);
		};
		menu.appendChild(colorPicker);

		this.onSpeedChanged = function (speedChanged) {
			controlMenu.speedChanged = speedChanged;
		};

		this.onDrawModeChanged = function (drawModeChanged) {
			controlMenu.drawModeChanged = drawModeChanged;
		};

		this.onLifeSpanChanged = function (lifeSpanChanged) {
			controlMenu.lifeSpanChanged = lifeSpanChanged;
		};

		this.onColorChanged = function (colorChanged) {
			controlMenu.colorChanged = colorChanged;
		};

		this.updateStatus = function (status) {
			playButton.toggleClass("paused", status.updating !== true);
			playSpeed.toggleClass("paused", status.updating !== true);
			speedSlider.value = status.speed || 30;
			playSpeed.innerHTML = "x " + (speedSlider.value / 30).toFixed(2);
			drawButton.toggleClass("selected", status.drawMode !== false);
			eraseButton.toggleClass("selected", status.drawMode === false);
			lifeSpanButton.toggleClass("selected", status.lifeSpan > 0);
			lifeSpan.toggleClass("disabled", !(status.lifeSpan > 0));
			lifeSpanSlider.value = status.lifeSpan || 500;
			lifeSpan.innerHTML = lifeSpanSlider.value;
			colorPicker.setColor(status.color);
		};
	};
});
