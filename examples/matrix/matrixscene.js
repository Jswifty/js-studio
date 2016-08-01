define([
	"module",
	"./coderain",
	"js-studio/canvasasciifier/canvasasciifier",
	"js-studio/canvasview/canvasview",
	"js-studio/usermediamanager/usermediamanager",
	"js-studio/domelement/domelement"
], function (Module, CodeRain, Asciifier, CanvasView, UserMediaManager, DOMElement) {

	var uri = Module.uri;
	var currentDirectory = uri.substring(0, uri.lastIndexOf("/") + 1);

	/**** SCENE STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = currentDirectory + "matrixscene.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	return function (container) {

		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "matrixScene";

		this.playButton = new DOMElement("div", { class: "matrixPlayButton" });
		this.playButton.addEventListener("mousedown", function () {
			if (scene.playButton.hasClass("paused")) {
				scene.video.play();
			} else {
				scene.video.pause();
			}
			scene.playButton.toggleClass("paused");
		}, false);
		container.appendChild(this.playButton);

		this.requestCameraButton = new DOMElement("div", { class: "matrixRequestCameraButton" });
		this.requestCameraButton.addEventListener("mousedown", function () {
			scene.requestUserCamera();
		}, false);
		container.appendChild(this.requestCameraButton);

		/* Create a video element for streaming. */
		this.video = new DOMElement("video", { src: currentDirectory + "/videos/demo.ogv", loop: true, muted: true });

		/* Create a canvas view for capturing pixel colors. */
		this.canvasView = new CanvasView(container);
		this.canvasView.canvas.className = "invisible";

		/* Create an asciifier for converting colors into ASCII. */
		this.asciifier = new Asciifier(this.canvasView.canvas, { color: "green", invert: true }, this.canvasView.animator);

		/* Rain object for rain effect. */
		this.codeRain = new CodeRain(50, 0.3);

		/* Hook up drawing methods to the canvas view. */
		this.canvasView.addRenderFunction(function () {

			var context = scene.canvasView.getCanvas2DContext();
			var width = scene.canvasView.getWidth();
			var height = scene.canvasView.getHeight();

			context.clearRect(0, 0, width, height);
			context.drawImage(scene.video, 0, 0, width, height);
			scene.codeRain.draw(context, width, height, scene.asciifier.textWidth);
		});

		this.requestUserCamera = function () {
			UserMediaManager.requestUserMedia(function (stream) {
				scene.video.src = window.URL.createObjectURL(stream);
				scene.codeRain.stop();
				scene.video.play();
			}, function (error) {
				alert("Failed to request user camera.");
			}, { video: true });
		};

		this.startScene = function () {
			scene.video.play();
			scene.codeRain.start();
			scene.canvasView.start();
		};
	};
});
