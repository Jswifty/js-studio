define([
	"module",
	"./coderain",
	"js-studio/canvasasciifier/canvasasciifier",
	"js-studio/canvasview/canvasview",
	"js-studio/usermediamanager/usermediamanager",
	"js-studio/domelement/domelement",
	"js-studio/cssloader/cssloader"
], function (Module, CodeRain, Asciifier, CanvasView, UserMediaManager, DOMElement, CSSLoader) {

	var currentDirectory = Module.uri.replace("matrixscene.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "matrixscene.css");

	return function (container) {

		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "matrixScene";

		scene.playButton = new DOMElement("div", { class: "matrixPlayButton" });
		scene.playButton.onMouseClick(function () {
			if (scene.playButton.hasClass("paused")) {
				scene.video.play();
				scene.codeRain.resume();
			} else {
				scene.video.pause();
				scene.codeRain.pause();
			}
			scene.playButton.toggleClass("paused");
		});
		container.appendChild(scene.playButton);

		scene.requestCameraButton = new DOMElement("div", { class: "matrixRequestCameraButton" });
		scene.requestCameraButton.onMouseClick(function () {
			scene.requestUserCamera();
		});
		container.appendChild(scene.requestCameraButton);

		/* Create a video element for streaming. */
		scene.video = new DOMElement("video", { src: currentDirectory + "/videos/demo.ogv", loop: true, muted: true });

		/* Create a canvas view for capturing pixel colors. */
		scene.canvasView = new CanvasView(container);
		scene.canvasView.className = "invisible";
		scene.canvasView.setRender(function (context, width, height) {
			context.clearRect(0, 0, width, height);
			context.drawImage(scene.video, 0, 0, width, height);
			scene.codeRain.draw(context, width, height, scene.asciifier.textWidth);
		});

		/* Create an asciifier for converting colors into ASCII. */
		scene.asciifier = new Asciifier(scene.canvasView, { color: "green", invert: true }, scene.canvasView.animator);

		/* Rain object for rain effect. */
		scene.codeRain = new CodeRain(50, 0.3);

		scene.requestUserCamera = function () {
			UserMediaManager.requestUserMedia(function (stream) {
				scene.video.src = window.URL.createObjectURL(stream);
				scene.codeRain.stop();
				scene.video.play();
				scene.requestCameraButton.addClass("hidden");
			}, function (error) {
				alert("Failed to request user camera.");
			}, { video: true });
		};

		scene.startScene = function () {
			scene.video.play();
			scene.codeRain.start();
			scene.canvasView.start();
		};
	};
});
