define([
	"module",
	"./fire/fire",
 	"./fireflieslayer",
 	"js-studio/animator/animator",
 	"js-studio/mouse/mouse",
	"js-studio/cssloader/cssloader"
], function (Module, Fire, FirefliesLayer, Animator, Mouse, CSSLoader) {

	var currentDirectory = Module.uri.replace("firefliesscene.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "firefliesscene.css");

	return function (container) {
		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "firefliesScene";

		/* Create an Animator. */
		scene.animator = new Animator();

		/* Create a Mouse. */
		scene.mouse = new Mouse(container);
		scene.mouse.onMouseOver(function (event) {
			scene.fire.onMouseOver(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseOver(event);
			}
		});
		scene.mouse.onMouseOut(function (event) {
			scene.fire.onMouseOut(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseOut(event);
			}
		});
		scene.mouse.onMouseMove(function (event) {
			scene.fire.onMouseMove(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseMove(event);
			}

			if (event.mouse.isMouseDown === true) {
				scene.checkFirefliesLayers();
			}
		});
		scene.mouse.onMouseDown(function (event) {
			if (event.mouse.isLeftButton === true || event.mouse.isTouching === true) {
				scene.fire.onMouseDown(event);

				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseDown(event);
				}

				scene.checkFirefliesLayers();
			}
		});
		scene.mouse.onMouseUp(function (event) {
			scene.fire.onMouseUp(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseUp(event);
			}

			scene.checkFirefliesLayers(scene.performingTime);
		});
		scene.mouse.onMouseClick(function (event) {
			scene.fire.onMouseClick(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseClick(event);
			}
		});
		scene.mouse.onMouseStop(function (event) {
			scene.fire.onMouseStop(event);

			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseStop(event);
			}
		});

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

		scene.listenMouseEventsOn = function (element) {
			scene.mouse.detachFromElement();
			scene.mouse.attachToElement(element);
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
