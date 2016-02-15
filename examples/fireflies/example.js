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
	"}"
].join(" ");

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);

var body = document.getElementsByTagName("body")[0];

require(["firefliesscene"], function(Scene) {
	var scene = new Scene(body);
	scene.addMouseListener(body);
	scene.startScene();
});
