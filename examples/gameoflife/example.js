require.config({
	paths: { "js-studio": "../../src" },
});

require(["./gameoflifescene"], function(Scene) {

	var body = document.getElementsByTagName("body")[0];

	var gameoflife = new Scene(body);
	gameoflife.startScene();
});
