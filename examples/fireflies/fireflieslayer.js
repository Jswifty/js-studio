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
		
		this.target = new Target({ x : -10000, y : -10000 }, 0, 0);

		this.onMouseOver = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.onMouseOut = function (event) {
			this.target = new Target({ x : -10000, y : -10000 }, 0, 0);
		};

		this.onMouseMove = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.onMouseDown = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.onMouseUp = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.onMouseClick = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.onMouseStop = function (event) {
			this.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
		};

		this.focusOnFire = function (fire) {
			this.focusingFire = fire;
		};

		this.startFireFliesLayer = function () {

			var firefliesLayer = this;
				
			/* Start the generating process of Fireflies, creating a firefly per second. */
			for (var i = 0; i < firefliesLayer.numOfFireFlies; i++) {
				setTimeout(function() { firefliesLayer.fireflies.push(new Firefly()); }, firefliesLayer.generationDelay * i);
			}
		};

		this.render = function (timeDiff) {
			
			/* First, update the status of the fireflies layer.
			 * (i.e.: canvas size, mouse position, fireflies status). */
			this.update(timeDiff);
			
			var context = this.canvasView.getCanvas2DContext();
			
			/* Clear the canvas screen. */
			context.clearRect(0, 0, this.canvasView.canvas.width, this.canvasView.canvas.height);
			
			/* Set the color overlapping to become brighter. */
			context.globalCompositeOperation = "lighter";
			
			/* Paint the fireflies. */
			for(var i = 0; i <this.fireflies.length; i++) {
				context.beginPath();
				
				var firefly = this.fireflies[i];
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
		};

		this.update = function (timeDiff) {

			/* Update a new status of the fireflies. */
			var fireflyState;

			if (this.performingHeart) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.ARRIVE);
			} else if (this.focusingFire != null && this.focusingFire.isSparkling) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.FLEE);
			} else if (this.focusingFire != null && this.focusingFire.fireOn) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.ATTRACT);
			} else if (this.target.speed > this.minFollowSpeed) {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.FOLLOW);
			} else {
				fireflyState = FireflyState.getState(FireflyState.BEHAVIOUR.WANDER);
			}
			var sceneBoundingBox = { width: this.canvasView.canvas.width, height: this.canvasView.canvas.height };

			/* Update the fireflies' properties according to the new status. */
			for(var i = 0; i < this.fireflies.length; i++) {
				if (this.performingHeart) {
					this.fireflies[i].update(fireflyState, new Target(this.getHeartPosition(this.layerIndex, i, this.target.position), 0, 0), timeDiff, sceneBoundingBox);
				} else {
					this.fireflies[i].update(fireflyState, this.target, timeDiff, sceneBoundingBox);
				}
			}
		};

		this.allFirefliesAttracted = function () {

			for(var i = 0; i < this.fireflies.length; i++) {
				if (this.fireflies[i].behaviour !== FireflyState.BEHAVIOUR.ATTRACT) {
					return false;
				}
			}

			return this.fireflies.length === this.numOfFireFlies;
		};

		this.performHeart = function () {

			this.performingHeart = true;
			
			var layer = this;
			setTimeout(function () { layer.performingHeart = false; }, layer.performingTime);
		};

		this.getHeartPosition = function (layerIndex, fireflyIndex, centerPosition) {
			return null;
		};
	};
});
