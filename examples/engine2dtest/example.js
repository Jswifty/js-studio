require.config({
	paths: { "js-studio": "../../src" },
});

require(["./engine2dtest"], function (Scene) {
	var body = document.getElementsByTagName("body")[0];
	var scene = new Scene(body);
	scene.startScene();
});
