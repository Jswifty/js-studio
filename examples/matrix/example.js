require(["rain", "canvasasciifier", "canvasview"], function(Rain, Asciifier, CanvasView) {

	var style = document.createElement("style");
	style.type = "text/css";
	style.id = "mainStyle";
	style.innerHTML = [
		"html, body {",
			"width: 100%;",
			"height: 100%;",
		"}",
		"body {",
			"margin: 0px;",
		"}"
	].join(" ");

	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);

	var body = document.getElementsByTagName("body")[0];

	var video = document.createElement("video");
	video.style.display = "none";
	video.innerHTML = "Your browser does not support HTML5 video.";

	body.appendChild(video);
	
	var canvasView = new CanvasView(body);
	canvasView.canvas.style.visibility = "hidden";

	var asciifier = new Asciifier(canvasView.canvas, { background: "black", color: "green", invert: true }, canvasView.animator);
	
	var rain = new Rain(100, 0.7);

	function fallbackFunction () {

		var source = document.createElement("source");
		source.src = "demo.mp4";
		source.type = "video/mp4";
		
		video.appendChild(source);

		rain.interval = 0;
		video.play();
	}

	navigator.getUserMedia = navigator.getUserMedia || 
							navigator.webkitGetUserMedia || 
							navigator.mozGetUserMedia || 
							navigator.msGetUserMedia;

	if (navigator.getUserMedia) {

		navigator.getUserMedia({ video: true }, function (stream) {
			
			video.src = window.URL.createObjectURL(stream);
			
			rain.interval = 0;
			video.play();
		}, fallbackFunction);
	}
	else {
		fallbackFunction();
	}

	canvasView.addRenderFunction(function () {
		
		var context = canvasView.getCanvas2DContext();
		var width = canvasView.getCanvasWidth();
		var height = canvasView.getCanvasHeight();

		context.clearRect(0, 0, width, height);

		context.drawImage(video, 0, 0, width, height);

		rain.draw(context, width, height, asciifier.textWidth);
	});

	video.play();
	canvasView.start();
	rain.start();
});