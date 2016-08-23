define([
	"module",
	"js-studio/mouse/mouse",
	"js-studio/mouse/mouselistener",
	"js-studio/domelement/domelement",
	"js-studio/cssloader/cssloader",
	"js-studio/colorutils/colorutils"
], function (Module, Mouse, MouseListener, DOMElement, CSSLoader, ColorUtils) {

	var currentDirectory = Module.uri.replace("colorpicker.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "colorpicker.css");

	return function (color) {

		var colorPicker = new DOMElement("div", { class: "colorPicker" });
		colorPicker.colorChanged = function () {};
		colorPicker.showPanel = function (show) {
			colorPickerPanel.toggleClass("show", show);
		};

		var colorPalette = new DOMElement("div", { class: "colorPalette" });
		colorPalette.onMouseDown(function () {
			colorPicker.showPanel();
		});
		colorPicker.appendChild(colorPalette);

		var colorPickerPanel = new DOMElement("div", { class: "colorPickerPanel" });
		colorPicker.appendChild(colorPickerPanel);

		var colorBoard = new DOMElement("div", { class: "colorBoard" });
		colorBoard.style.background = "rgb(255, 0, 0)";
		colorPickerPanel.appendChild(colorBoard);

		var colorBoardGradient = new DOMElement("div", { class: "colorBoardGradient" });
		colorBoard.appendChild(colorBoardGradient);

		var colorBoardPointer = new DOMElement("div", { class: "colorBoardPointer" });
		colorBoardPointer.style.top = "100%";
		colorBoardPointer.style.left = "100%";
		colorBoardGradient.appendChild(colorBoardPointer);

		var colorBoardOverlay = new DOMElement("div", { class: "colorBoardOverlay" });
		var colorBoardMouseHander = function (event) {
			var x = event.mouse.position.x;
			var y = event.mouse.position.y;
			var width = colorBoardOverlay.offsetWidth;
			var height = colorBoardOverlay.offsetHeight;
			var topPercentage = Math.max(0, Math.min(height, y)) / height * 100;
			var leftPercentage = Math.max(0, Math.min(width, x)) / height * 100;

			colorBoardPointer.style.top = topPercentage + "%";
			colorBoardPointer.style.left = leftPercentage + "%";

			changeColor();
		};
		colorBoardOverlay.onMouseDrag(colorBoardMouseHander);
		colorBoardOverlay.onMouseDown(colorBoardMouseHander);
		colorBoard.appendChild(colorBoardOverlay);

		var hueBanner = new DOMElement("div", { class: "hueBanner" });
		colorPickerPanel.appendChild(hueBanner);
		var updateHue = function (event) {
			var bannerHeight = hueBanner.offsetHeight;
			var position = event.mouse.position.y;
			var percentage =  Math.max(0, Math.min(100, position / bannerHeight * 100));

			var hueColor = ColorUtils.hsvToRGB(percentage / 100 * 360, 1, 1);

			hueBannerThumb.style.top = percentage + "%";
			colorBoard.style.background = "rgb(" + hueColor.r + ", " + hueColor.g + ", " + hueColor.b + ")";

			changeColor();
		};
		hueBanner.onMouseDown(updateHue);
		hueBanner.onMouseDrag(updateHue);

		var hueBannerThumb = new DOMElement("div", { class: "hueBannerThumb" });
		hueBannerThumb.style.top = "0%";
		hueBanner.appendChild(hueBannerThumb);

		if (ColorUtils.isValidColor(color)) {
			var hsv = ColorUtils.rgbToHSV(color.r, color.g, color.b);
			hueBannerThumb.style.top = (hsv.h / 360 * 100) + "%";
			colorBoardPointer.style.top = ((1 - hsv.v) * 100) + "%";
			colorBoardPointer.style.left = (hsv.s * 100) + "%";
		}

		function changeColor () {
			var hue = parseFloat(hueBannerThumb.style.top) / 100 * 360;
			var saturation = parseFloat(colorBoardPointer.style.left) / 100;
			var value = 1 - (parseFloat(colorBoardPointer.style.top) / 100);
			var color = ColorUtils.hsvToRGB(hue, saturation, value);

			colorPalette.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + 1 + ")";
			colorPicker.colorChanged(color);
		};

		return colorPicker;
	};
});
