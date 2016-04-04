define([
	"module",
	"./coderain",
	"js-studio/canvasasciifier/canvasasciifier",
	"js-studio/canvasview/canvasview",
	"js-studio/usermediamanager/usermediamanager"
], function (module, CodeRain, Asciifier, CanvasView, UserMediaManager) {

	var currentDirectory = module.uri.replace("matrixscene.js", "");

	/**** SCENE STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = currentDirectory + "matrixscene.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	return function (container) {
		
		var scene = this;

		this.requestUserCamera = function () {

			UserMediaManager.requestUserMedia(function (stream) {
				
				scene.video.src = window.URL.createObjectURL(stream);
				
				scene.codeRain.stop();
				scene.video.play();

			}, function () {

			}, { video: true });
		};

		this.startScene = function () {
			scene.video.play();
			scene.codeRain.start();
			scene.canvasView.start();
		};

		/* Apply the scene's styling onto the container. */
		container.className = "matrixScene";
		
		/* Create a video element for streaming. */
		this.video = document.createElement("video");
		
		/* Create a canvas view for capturing pixel colors. */
		this.canvasView = new CanvasView(body);
		this.canvasView.canvas.className = "invisible";

		/* Create an asciifier for converting colors into ASCII. */
		this.asciifier = new Asciifier(this.canvasView.canvas, { color: "green", invert: true }, this.canvasView.animator);

		/* Rain object for rain effect. */
		this.codeRain = new CodeRain(100, 0.7);

		/* Hook up drawing methods to the canvas view. */
		this.canvasView.addRenderFunction(function () {
		
			var context = scene.canvasView.getCanvas2DContext();
			var width = scene.canvasView.getWidth();
			var height = scene.canvasView.getHeight();

			context.clearRect(0, 0, width, height);
			context.drawImage(scene.video, 0, 0, width, height);
			scene.codeRain.draw(context, width, height, scene.asciifier.textWidth);
		});
	};
});
