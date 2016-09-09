define([
	"js-studio/canvasview/canvasview",
	"./firefly",
	"./fireflystate"
], function (CanvasView, Firefly, FireflyState) {

	var Target = function (position, direction, speed) {
		this.position = position;
		this.direction = direction;
		this.speed = speed;
	};

	return function (layerIndex, numOfLayers, numOfFireflies, container, animator) {

		var firefliesLayer = this;

		/* Container. */
		firefliesLayer.container = container;

		/* Layer index. */
		firefliesLayer.layerIndex = layerIndex;
		firefliesLayer.numOfLayers = numOfLayers;

		/* Amount of fireflies. */
		firefliesLayer.numOfFireflies = numOfFireflies;

		/* Fireflies. */
		firefliesLayer.fireflies = [];

		/* Generation Delay. */
		firefliesLayer.generationDelay = 500;

		/* Create the canvas. */
		firefliesLayer.canvasView = new CanvasView(container, animator);
		firefliesLayer.canvasView.canvas.style.zIndex = 0;
		firefliesLayer.canvasView.setRender(function (context, width, height) {
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

		/* The fire to focus on. */
		firefliesLayer.focusingFire = null;

		/* The minimum speed required to blow fireflies by movement, measured in pixel per second. */
		firefliesLayer.minFollowSpeed = 1000;

		/* The heart performance for the fireflies. */
		firefliesLayer.performingHeart = false;
		firefliesLayer.heartPosition = { x : -10000, y : -10000 };

		firefliesLayer.target = new Target({ x : -10000, y : -10000 }, 0, 0);

		firefliesLayer.onMouseOver = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseOut = function (event) {
			firefliesLayer.target = new Target({ x : -10000, y : -10000 }, 0, 0);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseMove = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseDown = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseUp = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseClick = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.onMouseStop = function (event) {
			firefliesLayer.target = new Target((event.mouse.position === null ? { x : -10000, y : -10000 } : event.mouse.position), event.mouse.direction, event.mouse.movingSpeed);
			firefliesLayer.updateHeartPosition(event.mouse);
		};

		firefliesLayer.focusOnFire = function (fire) {
			firefliesLayer.focusingFire = fire;
		};

		firefliesLayer.updateHeartPosition = function (mouse) {
			if (mouse.isMouseDown === true && mouse.position !== null) {
				firefliesLayer.heartPosition = { x : mouse.position.x, y : mouse.position.y };
			}
		};

		firefliesLayer.startFireFliesLayer = function () {
			/* Start the generating process of Fireflies, creating a firefly per second. */
			for (var i = 0; i < firefliesLayer.numOfFireflies; i++) {
				setTimeout(function() { firefliesLayer.fireflies.push(new Firefly()); }, firefliesLayer.generationDelay * i);
			}
		};

		firefliesLayer.update = function (timeDiff) {
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

		firefliesLayer.allFirefliesAttracted = function () {
			for(var i = 0; i < firefliesLayer.fireflies.length; i++) {
				if (firefliesLayer.fireflies[i].behaviour !== FireflyState.BEHAVIOUR.ATTRACT &&
						firefliesLayer.fireflies[i].behaviour !== FireflyState.BEHAVIOUR.ARRIVE) {
					return false;
				}
			}

			return firefliesLayer.fireflies.length === firefliesLayer.numOfFireflies;
		};

		firefliesLayer.performHeart = function (performHeart) {
			firefliesLayer.performingHeart = performHeart;
		};

		firefliesLayer.getHeartPosition = function (layerIndex, fireflyIndex, centerPosition) {
			var totalIndex = firefliesLayer.numOfFireflies * firefliesLayer.numOfLayers;
			var firefliesIndex = fireflyIndex + (layerIndex * firefliesLayer.numOfFireflies);
			var f = (firefliesIndex - totalIndex / 2) / totalIndex * 2 * Math.PI;

			return {
				x : centerPosition.x + 7 * 16 * Math.pow(Math.sin(f), 3),
				y : centerPosition.y - 7 * (13 * Math.cos(f) - 5 * Math.cos(2*f) - 2 * Math.cos(3*f) - Math.cos(4*f))
			};
		};

		animator.addRenderFunction(firefliesLayer, firefliesLayer.update);
	};
});
