var style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = "example.css";

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);

var body = document.getElementsByTagName("body")[0];

require(["matrixscene"], function (Scene) {
	var scene = new Scene(body);
	scene.startScene();
	scene.requestUserCamera();
});
