define(function (require) {

	var Fire = require("./fire/fire");
	var FirefliesLayer = require("./fireflieslayer");
	var Animator = require("./animator");
	var Mouse = require("./mouse");
	var MouseListener = require("./mouselistener");

	return function (divContainer) {
		
		var scene = this;
		
		this.addMouseListener = function (divContainer) {
			
			if (scene.mouse && scene.mouseListener) {
				scene.mouse.removeMouseListener(scene.mouseListener);
			}

			scene.mouse = new Mouse(divContainer);

			scene.mouseListener = new MouseListener();
			scene.mouseListener.mouseOver(scene.onMouseOver);
			scene.mouseListener.mouseOut(scene.onMouseOut);
			scene.mouseListener.mouseMove(scene.onMouseMove);
			scene.mouseListener.mouseDown(scene.onMouseDown);
			scene.mouseListener.mouseUp(scene.onMouseUp);
			scene.mouseListener.mouseClick(scene.onMouseClick);
			scene.mouseListener.mouseStop(scene.onMouseStop);
			
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

		/* Scene Styling. */
		var sceneStyle = document.createElement("style");
		sceneStyle.type = "text/css";
		sceneStyle.innerHTML = ".firefliesSceneStyle { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; }";

		/* Insert the scene styling into the the header of the web page. */
		document.getElementsByTagName("head")[0].appendChild(sceneStyle);

		/* Apply the scene's styling onto the container. */
		divContainer.className = "firefliesSceneStyle";
		
		/* Create an Animator. */
		this.animator = new Animator();

		/* Fire layer, which creates a canvas. */
		this.fire = new Fire(0, 50, divContainer, this.animator);
		
		/* Fireflies layers, which creates a canvas for each layer. */	
		var numOfFireflies = 100;
		var numOfFirefliesLayers = 2;
		
		this.firefliesLayers = [];

		for (var i = 0; i < numOfFirefliesLayers; i++) {
			
			var numOfLayerFireflies = numOfFireflies / numOfFirefliesLayers;
			
			this.firefliesLayers[i] = new FirefliesLayer(i, numOfLayerFireflies, divContainer);
			
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
		
		var fireID = this.animator.addRenderFunction(this.fire, this.fire.render);
		
		for (var i = 0; i < this.firefliesLayers.length; i++) {
			this.animator.addRenderFunction(this.firefliesLayers[i], this.firefliesLayers[i].render);
		}
	};
});
