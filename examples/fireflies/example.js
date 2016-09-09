require.config({
	paths: { "js-studio": "../../src" },
});

require(["./firefliesscene"], function(Scene) {
	var body = document.getElementsByTagName("body")[0];
	var scene = new Scene(body);

	scene.addMouseListener(body);
	scene.startScene();
});
