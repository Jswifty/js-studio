var style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = "example.css";

var head = document.getElementsByTagName("head")[0];
head.appendChild(style);

var body = document.getElementsByTagName("body")[0];

require.config({
	paths: { "js-studio": "../../src/" },
});

require(["./gameoflifescene"], function(Scene) {

	var gameoflife = new Scene(body, 400, 400);
	gameoflife.startScene();
});
