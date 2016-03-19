/**  
 *	controlmenu.js is an object class which.
 */ 
define(function (require) {

	var classmanager = require("../../src/classmanager/classmanager");

	return function (divContainer, pause, resume, setSpeed, setDrawMode) {
	
		var controlMenu = this;

		var style = document.createElement("style");
		style.type = "text/css";
		style.id = "controlmenuStyle";
		style.innerHTML = [
			"body {",
				"font-family: Arcon;",
			"}",
			"#menuButton {",
				"position: absolute;",
				"top: 0px;",
				"left: 0px;",
				"width: 40px;",
				"height: 40px;",
				"margin-top: 10px;",
				"margin-left: 10px;",
				"border: none;",
				"background: url('images/settings.png') no-repeat center;",
				"background-size: contain;",
				"cursor: pointer;",
				"opacity: 0.8;",
				"z-index: 2;",
				"transition: 0.5s;",
				"-webkit-transition: 0.5s;",
			"}",
			"#menuButton:hover {",
				"opacity: 1;",
			"}",
			"#menuButton.opened {",
				"-ms-transform: rotate(-180deg);",
				"-webkit-transform: rotate(-180deg);",
				"transform: rotate(-180deg);",
			"}",
			"#menuContainer {",
				"position: absolute;",
				"top: 0px;",
				"left: -120px;",
				"width: 120px;",
				"height: 100%;",
				"background: rgba(0, 0, 0, 0.8);",
				"transition: 0.5s;",
				"-webkit-transition: 0.5s;",
				"z-index: 1;",
			"}",
			"#menuContainer.expanded {",
				"left: 0px;",
			"}",
			"#menu {",
				"position: absolute;",
				"padding-top: 80px;",
				"width: 100%;",
				"height: auto;",
				"text-align: left;",
			"}",
			"#playButton {",
				"width: 100%;",
				"height: 40px;",
				"border: none;",
				"background: url('images/pause.png') no-repeat center;",
				"background-size: contain;",
				"cursor: pointer;",
			"}",
			"#playButton.paused {",
				"background: url('images/play.png') no-repeat center;",
				"background-size: contain;",
			"}",
			"#playSpeed {",
				"width: 100%;",
				"height: 20px;",
				"margin-top: 5px;",
				"text-align: center;",
				"color: white;",
				"letter-spacing: 2px;",
				"font-size: 16px;",
				"font-weight: bold;",
				"line-height: 20px;",
			"}",
			"#playSpeed.paused {",
				"color: transparent;",
			"}",
			"#speedSlider {",
				"width: 90%;",
				"margin: 5px 5%;",
			"}",
			"#drawModeContainer {",
				"display: inline-block;",
				"width: 100%;",
			"}",
			"#drawButton {",
				"float: left;",
				"background: url('images/draw.png') no-repeat center;",
			"}",
			"#eraseButton {",
				"float: right;",
				"background: url('images/erase.png') no-repeat center;",
			"}",
			"#drawButton, #eraseButton {",
				"height: 40px;",
				"width: 40%;",
				"margin: 5px;",
				"background-size: contain;",
				"border: none;",
				"cursor: pointer;",
				"opacity: 0.3;",
			"}",
			"#drawButton.selected, #eraseButton.selected {",
				"opacity: 1;",
			"}",
			"#patternContainer {",
				"display: inline-block;",
				"width: 100%;",
				"margin-top: 10px;",
			"}",
			"#patternTitleLabel {",
				"font-size: 18px;",
				"margin: 0px 10px;",
				"padding-right: 20px;",
				"color: white;",
				"border-bottom: 1px solid white;",
			"}",
			"input[type=range]::-moz-range-track {",
				"width: 100%;",
				"height: 2px;",
				"background: rgba(255, 255, 255, 0.5);",
				"border: 1px solid white;",
				"border-radius: 2px;",
				"cursor: pointer;",
			"}",
			"input[type=range]::-moz-range-thumb {",
				"width: 14px;",
				"height: 14px;",
				"background: white;",
				"border-radius: 8px;",
				"cursor: pointer;",
			"}"
		].join(" ");

		document.getElementsByTagName("head")[0].appendChild(style);

		var menuContainer = document.createElement("div");
		menuContainer.id = "menuContainer";

		var menu = document.createElement("div");
		menu.id = "menu";

		var playButton = document.createElement("button");
		playButton.id = "playButton";
		playButton.onclick = function (event) {
			
			classmanager.toggleClass(playButton, "paused");
			classmanager.toggleClass(playSpeed, "paused");

			var paused = classmanager.hasClass(playButton, "paused");

			if (paused === true && pause) {
				pause();
			} else if (paused === false && resume) {
				resume();
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
			setSpeed(speedSlider.value);
		};

		setSpeed(30);

		menu.appendChild(speedSlider);

		var drawModeContainer = document.createElement("div");
		drawModeContainer.id = "drawModeContainer";

		var drawButton = document.createElement("button");
		drawButton.id = "drawButton";
		drawButton.className = "selected";
		drawButton.onclick = function (event) {
			
			classmanager.addClass(drawButton, "selected");
			classmanager.removeClass(eraseButton, "selected");
		
			setDrawMode(true);
		};

		var eraseButton = document.createElement("button");
		eraseButton.id = "eraseButton";
		eraseButton.onclick = function (event) {
			
			classmanager.addClass(eraseButton, "selected");
			classmanager.removeClass(drawButton, "selected");

			setDrawMode(false);
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
			classmanager.toggleClass(menuButton, "opened");
			classmanager.toggleClass(menuContainer, "expanded");
		};

		divContainer.appendChild(menuContainer);
		divContainer.appendChild(menuButton);
	};
});
