define([
	"module",
 	"js-studio/mouse/mouse",
	"js-studio/cssloader/cssloader",
	"js-studio/keyboard/keycodes",
	"./character",
	"./testscene"
], function (Module, Mouse, CSSLoader, Key, Character, TestScene) {

	var currentDirectory = Module.uri.replace("engine2dtest.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "engine2dtest.css");

	return function (container) {

    var scene = this;

    /* Apply the scene's styling onto the container. */
    container.className = "engine2DTest";

    scene.character = new Character(10, 10, 50, 50);
    scene.character2 = new Character(440, 10, 50, 50);

    /* Create a CanvasView to draw the life grid. */
    scene.scene2D = new TestScene(container, 500, 500);
    scene.scene2D.setKeyInputs({
      [Key.UP]: function () { scene.character.jump(); },
      [Key.DOWN]: function () { },
      [Key.LEFT]: function () { scene.character.moveLeft(); },
      [Key.RIGHT]: function () { scene.character.moveRight(); },
      [Key.Z]: function () { scene.scene2D.zoomIn(); },
      [Key.X]: function () { scene.scene2D.zoomOut(); }
    });
    scene.scene2D.setAcceleration(0, 2500);
    scene.scene2D.add(scene.character);
    scene.scene2D.add(scene.character2);
    scene.scene2D.setFollowObjects([scene.character]);

    scene.startScene = function () {
      scene.scene2D.start();
		};
	};
});
