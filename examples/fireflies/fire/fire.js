define(function (require) {

	var CanvasView = require("../canvasview");
	var FireParticle = require("./fireparticles");
	var SparkParticle = require("./sparkparticles");

	return function (index, numOfParticles, divContainer, animator) {

		var fire = this;

		/* DIV container. */
		this.divContainer = divContainer;
		
		/* Layer index. */
		this.layerIndex = index;
		
		/* Amount of fire particles. */
		this.numOfFireParticles = numOfParticles;
		
		/* Amount of spark particles. */
		this.numOfSparkParticles = numOfParticles / 4;
		
		/* Fire particles. */
		this.fireParticles = [];
		for (var i = 0; i < this.numOfFireParticles; i++) {
			this.fireParticles[i] = new FireParticle();
		}
		
		/* Spark particles. */
		this.sparkParticles = [];
		for (var i = 0; i < this.numOfSparkParticles; i++) {
			this.sparkParticles[i] = new SparkParticle();
		}

		/* a void position. */
		this.faultPosition = { x : -10000, y : -10000 };
		
		/* Fire Position. */
		this.firePosition = { x : -10000, y : -10000 };
		
		/* Whether the fire is lighted up. */
		this.fireOn = false;

		/* Whether the fire is sparkling. */
		this.isSparkling = false;
		this.sparklePosition = { x : -10000, y : -10000 };
		
		/* The time spend to sparkle in terms of milli seconds. */
		this.sparklingTime = 120;
		
		/* Create the canvas. */
		this.canvasView = new CanvasView(divContainer, animator);
		this.canvasView.canvas.id = 'fireCanvas';
		this.canvasView.canvas.style.zIndex = index.toString();

		this.onMouseOver = function (event) {
			if (fire.fireOn && event.mouse.position) {
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y }
			}
		};

		this.onMouseOut = function (event) {
			fire.firePosition = { x : fire.faultPosition.x, y : fire.faultPosition.y }
		};

		this.onMouseMove = function (event) {
			if (fire.fireOn && event.mouse.position) {
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y };
			}
		};

		this.onMouseDown = function (event) {
			if (event.mouse.position) {
				fire.sparkle(event.mouse.position);
				fire.firePosition = { x : event.mouse.position.x, y : event.mouse.position.y };
				fire.fireOn = true;
			}
		};

		this.onMouseUp = function (event) {
			fire.firePosition = { x : fire.faultPosition.x, y : fire.faultPosition.y }
			fire.fireOn = false;
		};

		this.onMouseClick = function (event) {
			
		};

		this.onMouseStop = function (event) {
			
		};

		this.sparkle = function (position) {

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

		this.update = function (timeDiff) {
			
			/* Update the fire according to the mouse position. */
			for (var i = 0; i < fire.fireParticles.length; i++) {
				fire.fireParticles[i].update(fire.firePosition, timeDiff);
			}

			/* Update the sparks according to the mouse position. */
			for (var i = 0; i < fire.sparkParticles.length; i++) {
				fire.sparkParticles[i].update(fire.sparklePosition, timeDiff);
			}
		};

		this.render = function (timeDiff) {

			/* First, update the status of the fire.
			 * (i.e.: canvas size, mouse position, fire particle status). */
			fire.update(timeDiff);

			var context = fire.canvasView.getCanvas2DContext();
			
			/* Clear the canvas screen. */
			context.clearRect(0, 0, fire.canvasView.getCanvasWidth(), fire.canvasView.getCanvasHeight());
			
			/* Set the color overlapping to become brighter. */
			context.globalCompositeOperation = 'lighter';
			
			/* Paint the fire. */
			for (var i = 0; i < fire.fireParticles.length; i++) {
				context.beginPath();

				var fireParticle = fire.fireParticles[i];
				var gradient = context.createRadialGradient(fireParticle.position.x, fireParticle.position.y, 0, fireParticle.position.x, fireParticle.position.y, fireParticle.radius);
				gradient.addColorStop(0, 'rgba(' + fireParticle.rgbString + ', ' + fireParticle.opacityString + ')');
				gradient.addColorStop(0.5, 'rgba(' + fireParticle.rgbString + ', ' + 0.5 * fireParticle.opacityString + ')');
				gradient.addColorStop(1, 'rgba(' + fireParticle.rgbString + ', 0)');
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
				gradient.addColorStop(0, 'rgba(255, 255, 255, ' + sparkParticle.opacityString + ')');
				gradient.addColorStop(0.6, 'rgba(' + sparkParticle.rgbString + ', ' + 0.6 * sparkParticle.opacityString + ')');
				gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				context.fillStyle = gradient;
				context.arc(sparkParticle.position.x, sparkParticle.position.y, sparkParticle.radius, 2 * Math.PI, false);
				
				context.closePath();
				context.fill();
			}
		};
	};
});
