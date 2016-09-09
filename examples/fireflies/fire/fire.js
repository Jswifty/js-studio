define([
	"js-studio/canvasview/canvasview",
	"./fireparticles",
	"./sparkparticles"
], function (CanvasView, FireParticle, SparkParticle) {

	return function (index, numOfParticles, container, animator) {

		var fire = this;

		/* Container. */
		fire.container = container;

		/* Layer index. */
		fire.layerIndex = index;

		/* Amount of fire particles. */
		fire.numOfFireParticles = numOfParticles;

		/* Amount of spark particles. */
		fire.numOfSparkParticles = numOfParticles / 4;

		/* Fire particles. */
		fire.fireParticles = [];
		for (var i = 0; i < fire.numOfFireParticles; i++) {
			fire.fireParticles[i] = new FireParticle();
		}

		/* Spark particles. */
		fire.sparkParticles = [];

		for (var i = 0; i < fire.numOfSparkParticles; i++) {
			fire.sparkParticles[i] = new SparkParticle();
		}

		/* a void position. */
		fire.faultPosition = { x : -10000, y : -10000 };

		/* Fire Position. */
		fire.firePosition = { x : -10000, y : -10000 };

		/* Whether the fire is lighted up. */
		fire.fireOn = false;

		/* Whether the fire is sparkling. */
		fire.isSparkling = false;
		fire.sparklePosition = { x : -10000, y : -10000 };

		/* The time spend to sparkle in terms of milli seconds. */
		fire.sparklingTime = 120;

		/* Create the canvas. */
		fire.canvasView = new CanvasView(container, animator);
		fire.canvasView.canvas.style.zIndex = index.toString();
		fire.canvasView.setRender(function (context, width, height) {
			/* Clear the canvas screen. */
			context.clearRect(0, 0, width, height);

			/* Set the color overlapping to become brighter. */
			context.globalCompositeOperation = "lighter";

			/* Paint the fire. */
			for (var i = 0; i < fire.fireParticles.length; i++) {
				context.beginPath();

				var fireParticle = fire.fireParticles[i];
				var gradient = context.createRadialGradient(fireParticle.position.x, fireParticle.position.y, 0, fireParticle.position.x, fireParticle.position.y, fireParticle.radius);
				gradient.addColorStop(0, "rgba(" + fireParticle.rgbString + ", " + fireParticle.opacityString + ")");
				gradient.addColorStop(0.5, "rgba(" + fireParticle.rgbString + ", " + 0.5 * fireParticle.opacityString + ")");
				gradient.addColorStop(1, "rgba(" + fireParticle.rgbString + ", 0)");
				context.fillStyle = gradient;
				context.arc(fireParticle.position.x, fireParticle.position.y, fireParticle.radius, 2 * Math.PI, false);

				context.closePath();
				context.fill();
			}

			/* Paint the sparks. */
			for (var i = 0; i < fire.sparkParticles.length; i++) {
				context.beginPath();

				var sparkParticle = fire.sparkParticles[i];
				var gradient = context.createRadialGradient(sparkParticle.position.x, sparkParticle.position.y, 0, sparkParticle.position.x, sparkParticle.position.y, sparkParticle.radius);
				gradient.addColorStop(0, "rgba(255, 255, 255, " + sparkParticle.opacityString + ")");
				gradient.addColorStop(0.6, "rgba(" + sparkParticle.rgbString + ", " + 0.6 * sparkParticle.opacityString + ")");
				gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
				context.fillStyle = gradient;
				context.arc(sparkParticle.position.x, sparkParticle.position.y, sparkParticle.radius, 2 * Math.PI, false);

				context.closePath();
				context.fill();
			}
		});

		fire.onMouseOver = function (event) {
			if (fire.fireOn && event.mouse.position) {
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y }
			}
		};

		fire.onMouseOut = function (event) {
			fire.firePosition = { x : fire.faultPosition.x, y : fire.faultPosition.y }
		};

		fire.onMouseMove = function (event) {
			if (fire.fireOn && event.mouse.position) {
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y };
			}
		};

		fire.onMouseDown = function (event) {
			if (event.mouse.position) {
				fire.sparkle(event.mouse.position);
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y };
				fire.fireOn = true;
			}
		};

		fire.onMouseUp = function (event) {
			fire.firePosition = { x : fire.faultPosition.x, y : fire.faultPosition.y }
			fire.fireOn = false;
		};

		fire.onMouseClick = function (event) {

		};

		fire.onMouseStop = function (event) {

		};

		fire.sparkle = function (position) {
			/* Sparkle only when it is not sparkling. */
			if (!fire.isSparkling) {
				/* Switch on the sparkling state. */
				fire.isSparkling = true;
				fire.sparklePosition = position;
				/* switch it off after the sparkling time is spent. */
				setTimeout(function () { fire.isSparkling = false; fire.sparklePosition = { x : fire.faultPosition.x, y : fire.faultPosition.y }; }, fire.sparklingTime);
			}

			for (var i = 0; i < fire.sparkParticles.length; i++) {
				fire.sparkParticles[i].position = { x : position.x, y : position.y };
			}
		};

		fire.update = function (timeDiff) {
			/* Update the fire according to the mouse position. */
			for (var i = 0; i < fire.fireParticles.length; i++) {
				fire.fireParticles[i].update(fire.firePosition, timeDiff);
			}

			/* Update the sparks according to the mouse position. */
			for (var i = 0; i < fire.sparkParticles.length; i++) {
				fire.sparkParticles[i].update(fire.sparklePosition, timeDiff);
			}
		};

		animator.addRenderFunction(fire, fire.update);
	};
});
