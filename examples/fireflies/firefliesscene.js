define([
	"module",
	"./fire/fire",
 	"./fireflieslayer",
 	"js-studio/animator/animator",
 	"js-studio/mouse/mouse",
 	"js-studio/mouse/mouselistener",
	"js-studio/cssloader/cssloader"
], function (Module, Fire, FirefliesLayer, Animator, Mouse, MouseListener, CSSLoader) {

	var currentDirectory = Module.uri.replace("firefliesscene.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "firefliesscene.css");

	return function (container) {
		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "firefliesScene";

		/* Create an Animator. */
		scene.animator = new Animator();

		/* Fire layer, which creates a canvas. */
		scene.fire = new Fire(0, 50, container, scene.animator);

		scene.performHeartTimer = undefined;
		scene.performingTime = 5000;

		/* Fireflies layers, which creates a canvas for each layer. */
		var numOfFireflies = 100;
		var numOfLayers = 2;

		scene.firefliesLayers = [];

		for (var i = 0; i < numOfLayers; i++) {
			var numOfFirefliesInLayer = numOfFireflies / numOfLayers;

			scene.firefliesLayers[i] = new FirefliesLayer(i, numOfLayers, numOfFirefliesInLayer, container, scene.animator);
			scene.firefliesLayers[i].focusOnFire(scene.fire);
		}

		scene.addMouseListener = function (container) {
			if (scene.mouse && scene.mouseListener) {
				scene.mouse.removeMouseListener(scene.mouseListener);
			}

			scene.mouse = new Mouse(container);

			scene.mouseListener = new MouseListener();
			scene.mouseListener.onMouseOver(function (event) {
				scene.fire.onMouseOver(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseOver(event);
				}
			});
			scene.mouseListener.onMouseOut(function (event) {
				scene.fire.onMouseOut(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseOut(event);
				}
			});
			scene.mouseListener.onMouseMove(function (event) {
				scene.fire.onMouseMove(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseMove(event);
				}

				if (event.mouse.isMouseDown === true) {
					scene.checkFirefliesLayers();
				}
			});
			scene.mouseListener.onMouseDown(function (event) {
				if (event.mouse.isLeftButton === true || event.mouse.isTouching === true) {
					scene.fire.onMouseDown(event);

					for (var i = 0; i < scene.firefliesLayers.length; i++) {
						scene.firefliesLayers[i].onMouseDown(event);
					}

					scene.checkFirefliesLayers();
				}
			});
			scene.mouseListener.onMouseUp(function (event) {
				scene.fire.onMouseUp(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseUp(event);
				}

				scene.checkFirefliesLayers(scene.performingTime);
			});
			scene.mouseListener.onMouseClick(function (event) {
				scene.fire.onMouseClick(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseClick(event);
				}
			});
			scene.mouseListener.onMouseStop(function (event) {
				scene.fire.onMouseStop(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseStop(event);
				}
			});

			scene.mouse.addMouseListener(scene.mouseListener);
		};

		scene.startScene = function () {
			/* Start the fireflies layer, which starts generating fireflies. */
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].startFireFliesLayer();
			}

			/* Start the animation. */
			scene.animator.start();
		};

		scene.checkFirefliesLayers = function (performingTime) {
			if (scene.allFirefliesAttracted() === true) {
				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].performHeart(true);
				}

				clearTimeout(scene.performHeartTimer);

				if (performingTime !== undefined) {
					scene.performHeartTimer = setTimeout(function () {

						for (var i = 0; i < scene.firefliesLayers.length; i++) {
							scene.firefliesLayers[i].performHeart(false);
						}
					}, performingTime);
				}
			}
		};

		scene.allFirefliesAttracted = function () {
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				if (!scene.firefliesLayers[i].allFirefliesAttracted()) {
					return false;
				}
			}

			return true;
		};
	};
});
