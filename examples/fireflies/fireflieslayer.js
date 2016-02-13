define(function (require) {

	var CanvasView = require("./canvasview");
	var Firefly = require("./firefly");
	var FireflyState = require("./fireflystate");

	var Target = function (position, direction, speed) {
		this.position = position;
		this.direction = direction;
		this.speed = speed;
	};

	return function (index, numOfFireFlies, divContainer, animator) {

		var firefliesLayer = this;

		/* DIV container. */
		this.divContainer = divContainer;
		
		/* Layer index. */
		this.layerIndex = index;
		
		/* Amount of fireflies. */
		this.numOfFireFlies = numOfFireFlies;
		
		/* Fireflies. */
		this.fireflies = [];
		
		/* Generation Delay. */
		this.generationDelay = 1000;
		
		/* Create the canvas. */
		this.canvasView = new CanvasView(divContainer, animator);
		this.canvasView.canvas.id = "firefliesCanvas" + index.toString();
		this.canvasView.canvas.style.zIndex = 0;
		
		this.divContainer.appendChild(this.canvasView.canvas);
		
		/* The fire to focus on. */
		this.focusingFire = null;
		
		/* The minimum speed required to blow fireflies by movement, measured in pixel per second. */
		this.minFollowSpeed = 1000;
		
		/* The heart performance for the fireflies. */
		this.performingHeart = false;
		this.performingTime = 5000;
		this.heartPosition = { x : -10000, y : -10000 };
		
		this.target = new Target({ x : -10000, y : -10000 }, 0, 0);

		this.onMouseOver = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseOut = function (event) {
			this.target = new Target({ x : -10000, y : -10000 }, 0, 0);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseMove = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseDown = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseUp = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseClick = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.onMouseStop = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		this.focusOnFire = function (fire) {
			firefliesLayer.focusingFire = fire;
		};

		this.updateHeartPosition = function (mouse) {
			if (mouse.isMouseDown === true && mouse.position !== null) {
				firefliesLayer.heartPosition = { x : mouse.position.x, y : mouse.position.y };
			}
		};

		this.startFireFliesLayer = function () {

			/* Start the generating process of Fireflies, creating a firefly per second. */
			for (var i = 0; i < firefliesLayer.numOfFireFlies; i++) {
				setTimeout(function() { firefliesLayer.fireflies.push(new Firefly()); }, firefliesLayer.generationDelay * i);
			}
		};

		this.render = function (timeDiff) {
			
			/* First, update the status of the fireflies layer.
			 * (i.e.: canvas size, mouse position, fireflies status). */
			firefliesLayer.update(timeDiff);

			firefliesLayer.canvasView.draw(function (context, width, height) {
				
				/* Clear the canvas screen. */
				context.clearRect(0, 0, width, height);
				
				/* Set the color overlapping to become brighter. */
				context.globalCompositeOperation = "lighter";
				
				/* Paint the fireflies. */
				for(var i = 0; i < firefliesLayer.fireflies.length; i++) {
					context.beginPath();
					
					var firefly = firefliesLayer.fireflies[i];
					var gradient = context.createRadialGradient(firefly.position.x, firefly.position.y, 0, firefly.position.x, firefly.position.y, firefly.radius);
					
					gradient.addColorStop(0, "rgba(255, 255, 255, " + firefly.brightnessString + ")");
					gradient.addColorStop(0.1, "rgba(255, 255, 255, " + 0.8 * firefly.brightnessString + ")");
					gradient.addColorStop(0.4, "rgba(" + firefly.rgbString + ", " + 0.2 * firefly.brightnessString + ")");
					gradient.addColorStop(1, "rgba(" + firefly.rgbString + ", 0)");
					context.fillStyle = gradient;
					context.arc(firefly.position.x, firefly.position.y, firefly.radius, 2 * Math.PI, false);
					
					context.closePath();
					context.fill();
				}
			});
		};

		this.update = function (timeDiff) {

			/* Update a new status of the fireflies. */
			var fireflyState;

			if (firefliesLayer.performingHeart) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.ARRIVE);
			} else if (firefliesLayer.focusingFire != null && firefliesLayer.focusingFire.isSparkling) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.FLEE);
			} else if (firefliesLayer.focusingFire != null && firefliesLayer.focusingFire.fireOn) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.ATTRACT);
			} else if (firefliesLayer.target.speed > firefliesLayer.minFollowSpeed) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.FOLLOW);
			} else {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.WANDER);
			}
			var sceneBoundingBox = { width: firefliesLayer.canvasView.canvas.width, height: firefliesLayer.canvasView.canvas.height };

			/* Update the fireflies' properties according to the new status. */
			for(var i = 0; i < firefliesLayer.fireflies.length; i++) {
				if (firefliesLayer.performingHeart) {
					firefliesLayer.fireflies[i].update(
						fireflyState, 
						new Target(firefliesLayer.getHeartPosition(firefliesLayer.layerIndex, i, firefliesLayer.heartPosition), 0, 0),
						timeDiff,
						sceneBoundingBox
					);
				} else {
					firefliesLayer.fireflies[i].update(
						fireflyState, 
						firefliesLayer.target,
						timeDiff,
						sceneBoundingBox
					);
				}
			}
		};

		this.allFirefliesAttracted = function () {

			for(var i = 0; i < firefliesLayer.fireflies.length; i++) {
				if (firefliesLayer.fireflies[i].behaviour !== FireflyState.BEHAVIOUR.ATTRACT) {
					return false;
				}
			}

			return firefliesLayer.fireflies.length === firefliesLayer.numOfFireFlies;
		};

		this.performHeart = function () {

			firefliesLayer.performingHeart = true;

			setTimeout(function () { firefliesLayer.performingHeart = false; }, firefliesLayer.performingTime);
		};

		this.getHeartPosition = function (layerIndex, fireflyIndex, centerPosition) {
			return null;
		};
	};
});
