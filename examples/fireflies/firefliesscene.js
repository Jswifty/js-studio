define([
	"module",
	"./fire/fire",
 	"./fireflieslayer",
 	"js-studio/animator/animator",
 	"js-studio/mouse/mouse",
 	"js-studio/mouse/mouselistener"
], function (module, Fire, FirefliesLayer, Animator, Mouse, MouseListener) {

	var currentDirectory = module.uri.replace("firefliesscene.js", "");

	/**** SCENE STYLING. ****/
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = currentDirectory + "firefliesscene.css";

	/* Insert the scene styling into the the header of the web page. */
	document.getElementsByTagName("head")[0].appendChild(style);

	return function (container) {
		
		var scene = this;

		/* Apply the scene's styling onto the container. */
		container.className = "firefliesScene";
		
		/* Create an Animator. */
		this.animator = new Animator();

		/* Fire layer, which creates a canvas. */
		this.fire = new Fire(0, 50, container, this.animator);
		
		/* Fireflies layers, which creates a canvas for each layer. */
		var numOfFireflies = 100;
		var numOfFirefliesLayers = 2;
		
		this.firefliesLayers = [];

		for (var i = 0; i < numOfFirefliesLayers; i++) {
			
			var numOfLayerFireflies = numOfFireflies / numOfFirefliesLayers;
			
			this.firefliesLayers[i] = new FirefliesLayer(i, numOfLayerFireflies, container, this.animator);
			
			this.firefliesLayers[i].getHeartPosition = function (layerIndex, fireflyIndex, centerPosition) {
				
				var firefliesIndex = fireflyIndex + (layerIndex * numOfLayerFireflies);
				var f = (firefliesIndex - numOfFireflies / 2) / numOfFireflies * 2 * Math.PI;

				return { 
					x : centerPosition.x + 7 * 16 * Math.pow(Math.sin(f), 3),
					y : centerPosition.y - 7 * (13 * Math.cos(f) - 5 * Math.cos(2*f) - 2 * Math.cos(3*f) - Math.cos(4*f))
				};
			};
			
			this.firefliesLayers[i].focusOnFire(this.fire);
		}
		
		/* Hook up drawing methods to the animator. */
		this.animator.addRenderFunction(this.fire, this.fire.render);
		
		for (var i = 0; i < this.firefliesLayers.length; i++) {
			this.animator.addRenderFunction(this.firefliesLayers[i], this.firefliesLayers[i].render);
		}
		
		this.addMouseListener = function (container) {
			
			if (scene.mouse && scene.mouseListener) {
				scene.mouse.removeMouseListener(scene.mouseListener);
			}

			scene.mouse = new Mouse(container);

			scene.mouseListener = new MouseListener();
			scene.mouseListener.onMouseOver = scene.onMouseOver;
			scene.mouseListener.onMouseOut = scene.onMouseOut;
			scene.mouseListener.onMouseMove = scene.onMouseMove;
			scene.mouseListener.onMouseDown = scene.onMouseDown;
			scene.mouseListener.onMouseUp = scene.onMouseUp;
			scene.mouseListener.onMouseClick = scene.onMouseClick;
			scene.mouseListener.onMouseStop = scene.onMouseStop;
			
			scene.mouse.addMouseListener(scene.mouseListener);
		};

		this.onMouseOver = function (event) {
			scene.fire.onMouseOver(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseOver(event);
			}
			
			scene.checkFirefliesLayers();
		};

		this.onMouseOut = function (event) {
			scene.fire.onMouseOut(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseOut(event);
			}

			scene.checkFirefliesLayers();
		};

		this.onMouseMove = function (event) {
			scene.fire.onMouseMove(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseMove(event);
			}

			scene.checkFirefliesLayers();
		};

		this.onMouseDown = function (event) {
			if (event.which === scene.mouseListener.LEFT_BUTTON || event.mouse.isTouching) {
				scene.fire.onMouseDown(event);
				
				for (var i = 0; i < scene.firefliesLayers.length; i++) {
					scene.firefliesLayers[i].onMouseDown(event);
				}

				scene.checkFirefliesLayers();
			}
		};

		this.onMouseUp = function (event) {
			scene.fire.onMouseUp(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseUp(event);
			}

			scene.checkFirefliesLayers();
		};

		this.onMouseClick = function (event) {
			scene.fire.onMouseClick(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseClick(event);
			}

			scene.checkFirefliesLayers();
		};

		this.onMouseStop = function (event) {
			scene.fire.onMouseStop(event);
			
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].onMouseStop(event);
			}
			
			scene.checkFirefliesLayers();
		};

		this.startScene = function () {
			
			/* Start the fireflies layer, which starts generating fireflies. */
			for (var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].startFireFliesLayer();
			}

			/* Start the animation. */
			scene.animator.start();
		};

		this.checkFirefliesLayers = function () {
			
			for(var i = 0; i < scene.firefliesLayers.length; i++) {
				if (!scene.firefliesLayers[i].allFirefliesAttracted()) {
					return false;
				}
			}

			for(var i = 0; i < scene.firefliesLayers.length; i++) {
				scene.firefliesLayers[i].performHeart();
			}
		};
	};
});
