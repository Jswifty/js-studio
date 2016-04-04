define([
	"js-studio/canvasasciifier/canvasasciifier",
	"js-studio/canvasview/canvasview",
	"js-studio/usermediamanager/usermediamanager"
], function (Asciifier, CanvasView, UserMediaManager) {

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
				
				scene.video.loop = false;
				scene.video.play();

			}, function () {

			}, { video: true });
		};

		this.startScene = function () {
			scene.video.play();
			scene.canvasView.start();
		};

		/* Apply the scene's styling onto the container. */
		container.className = "matrixScene";
		
		/* Create a video element for streaming. */
		this.video = document.createElement("video");
		this.video.className = "hidden";
		this.video.loop = true;

		var mp4Source = document.createElement("source");
		mp4Source.src = "demo.mp4";
		mp4Source.type = "video/mp4";
		this.video.appendChild(mp4Source);

		var oggSource = document.createElement("source");
		oggSource.src = "demo.ogv";
		oggSource.type = "video/ogg";
		this.video.appendChild(oggSource);

		container.appendChild(this.video);
		
		/* Create a canvas view for capturing pixel colors. */
		this.canvasView = new CanvasView(body);
		this.canvasView.canvas.className = "invisible";

		/* Create an asciifier for converting colors into ASCII. */
		this.asciifier = new Asciifier(this.canvasView.canvas, { color: "green", invert: true }, this.canvasView.animator);

		/* Hook up drawing methods to the canvas view. */
		this.canvasView.addRenderFunction(function () {
		
			var context = scene.canvasView.getCanvas2DContext();
			var width = scene.canvasView.getWidth();
			var height = scene.canvasView.getHeight();

			context.clearRect(0, 0, width, height);
			context.drawImage(scene.video, 0, 0, width, height);
		});
	};
});
