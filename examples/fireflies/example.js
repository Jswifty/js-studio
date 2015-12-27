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
		"background: black;",
	"}",
	"#mainBackground {",
		"position: absolute;",
		"width: 100%;",
		"height: 100%;",
	"}"
].join(" ");

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);

var mainBackground = document.createElement("div");
mainBackground.id = "mainBackground";

var body = document.getElementsByTagName("body")[0];
body.appendChild(mainBackground);

require(["app"], function(scene) {
	var firefliesScene = new scene(mainBackground);
	firefliesScene.addMouseListener(mainBackground);
	firefliesScene.startScene();
});
