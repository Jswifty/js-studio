define(function (require) {

	var Rain = require("rain");
	var Asciifier = require("../../src/canvasasciifier/canvasasciifier");
	var CanvasView = require("../../src/canvasview/canvasview");
	var UserMediaManager = require("../../src/usermediamanager/usermediamanager");

	/**** SCENE STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = "matrixscene.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	return function (container) {
		
		var scene = this;

		this.requestUserCamera = function () {

			UserMediaManager.requestUserMedia(function (stream) {
				
				scene.video.src = window.URL.createObjectURL(stream);
				
				scene.rain.interval = 0;
				scene.video.play();

			}, function () {

			}, { video: true });
		};

		this.startScene = function () {
			scene.video.play();
			scene.canvasView.start();
			scene.rain.start();
		};

		/* Apply the scene's styling onto the container. */
		container.className = "matrixScene";
		
		/* Create a video element for streaming. */
		this.video = document.createElement("video");
		
		/* Create a canvas view for capturing pixel colors. */
		this.canvasView = new CanvasView(body);
		this.canvasView.canvas.className = "invisible";

		/* Create an asciifier for converting colors into ASCII. */
		this.asciifier = new Asciifier(this.canvasView.canvas, { background: "black", color: "green", invert: true }, this.canvasView.animator);
		
		/* Rain object for rain effect. */
		this.rain = new Rain(100, 0.7);

		/* Hook up drawing methods to the canvas view. */
		this.canvasView.addRenderFunction(function () {
		
			var context = scene.canvasView.getCanvas2DContext();
			var width = scene.canvasView.getWidth();
			var height = scene.canvasView.getHeight();

			context.clearRect(0, 0, width, height);

			context.drawImage(scene.video, 0, 0, width, height);

			scene.rain.draw(context, width, height, scene.asciifier.textWidth);
		});
	};
});
