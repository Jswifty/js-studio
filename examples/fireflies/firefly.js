define([
	"./fireflystate"
], function (FireflyState) {

	/**** FIREFLY CONFIG ****/

	/* The color changing speed in terms of value per second. */
	var colorVar = 300;

	/* The change in brightness in terms of value per second. */
	var brightnessVar = 3;

	/* The the steering factor for better effects. */
	var steerFactor = 25;

	/* transfer function from color to an RGB string for ease of rendering. */
	function toRGBString (color) {
		return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0);
	};

	function radius () {
		return 10 + 20 * Math.random();
	};

	/** Calculate the distance from the origin position to the destination position. */
	function getDistance (originPos, destPos) {
		var distanceVec = { x: destPos.x - originPos.x, y: destPos.y - originPos.y };
		return Math.sqrt(distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y);
	};

	/** Calculate the angle using trigonometry. Returns angle ranged from -180 to 180 degrees in radian. */
	function getAngle (x, y, z) {
		return x > 0 ? Math.asin(y / z) : (y > 0 ? Math.PI - Math.asin(y / z) : -Math.asin(y / z) - Math.PI);
	};

	/** Calculate the middle angle in between two angles. */
	function getMidAngle (angle1, angle2) {
		var midAngle = (angle1 + angle2) / 2;
		return (Math.abs(angle1 - angle2) > Math.PI) ? ((midAngle > 0) ? midAngle - Math.PI : midAngle + Math.PI) : midAngle;
	};

	/** Calculate the directional angle to the destination position in terms of the angle oriented from the East. */
	function getDirection (originPos, destPos) {
		var distanceVec = { x: destPos.x - originPos.x, y: destPos.y - originPos.y };
		var distanceMag = Math.sqrt(distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y);

		return getAngle(distanceVec.x, distanceVec.y, distanceMag);
	};

	/**** FIREFLY OBJECT ****/
	return function () {

		/* Behaviour. Initially Wander. */
		this.behaviour = FireflyState.BEHAVIOUR.WANDER;

		/* Color. */
		this.color = { r: 0, g: 0, b: 0 };
		this.rgbString = toRGBString(this.color);

		/* Behaviour Color, initially Wandering color. */
		this.behaviourColor = FireflyState.WANDER.color();

		/* Brightness (Opacity). */
		this.brightness = 0;
		this.brightnessMin = 0;
		this.brightnessMax = 1;
		this.brightnessGrd = 1;
		this.brightnessString = "0";

		/* Radius. */
		this.radius = radius();

		/* Speed Magnitude. */
		this.speed = 0;

		/* Behaviour Speed, initially Wandering speed. And the acceleration for it. */
		this.behaviourSpeed = FireflyState.WANDER.speed();
		this.acceleration = FireflyState.WANDER.acceleration;

		/* Velocity. */
		this.velocity = { x: 0, y: 0 };

		/* Position, initially using a fault position. */
		this.position = { x: -10000, y: -10000 };

		/* Direction. */
		this.dir = 0;
		this.dirVar = 0;

		this.update = function (state, target, timeDiff, boundary) {
			var targetPos = target.position;
			var targetDir = target.direction;
			var targetSpeed = target.speed;

			var behaviourEffect = state.behaviour;
			var effectRange = state.effectRange;
			var blurRange = state.blurRange;

			/* Calculate the distance between itself and the mouse position. */
			var distance = getDistance(this.position, targetPos);

			/* If the firefly is within the effect range, then change its behaviour. Otherwise it will stay wander. */
			if (distance < effectRange) {
				this.changeBehaviour(behaviourEffect);
			} else {
				this.changeBehaviour(FireflyState.BEHAVIOUR.WANDER);
			}

			/* Update the Direction variance, Speed and Brightness range according to its behaviour state.
			 * Behaviour may act upon a target position, distance, direction and speed. */
			this.behave(targetPos, blurRange, distance, targetDir, targetSpeed);

			/* Update Color. */
			this.color.r += (this.color.r > this.behaviourColor.r) ? -colorVar * timeDiff : (this.color.r < this.behaviourColor.r) ? colorVar * timeDiff : 0;
			this.color.g += (this.color.g > this.behaviourColor.g) ? -colorVar * timeDiff : (this.color.g < this.behaviourColor.g) ? colorVar * timeDiff : 0;
			this.color.b += (this.color.b > this.behaviourColor.b) ? -colorVar * timeDiff : (this.color.b < this.behaviourColor.b) ? colorVar * timeDiff : 0;

			this.rgbString = toRGBString(this.color);

			/* Update Brightness. */
			this.brightnessGrd = (this.brightness >= this.brightnessMax) ? -1 : (this.brightness <= this.brightnessMin) ? 1 : this.brightnessGrd;
			this.brightness += this.brightnessGrd * brightnessVar * timeDiff;
			this.brightnessString = this.brightness.toFixed(2);

			/* Update Speed. */
			this.speed += (this.speed > this.behaviourSpeed) ? -this.acceleration * timeDiff : (this.speed < this.behaviourSpeed) ? this.acceleration * timeDiff : 0;

			/* Update direction (only in range of -180 degree to 180 degree). */
			this.dir += this.dirVar * timeDiff;
			this.dir = (this.dir > Math.PI) ? this.dir - 2 * Math.PI : (this.dir < -Math.PI) ? this.dir + 2 * Math.PI : this.dir;

			/* Update velocity and position. */
			this.velocity.x = this.speed * Math.cos(this.dir);
			this.velocity.y = this.speed * Math.sin(this.dir);
			this.position.x += this.velocity.x * timeDiff;
			this.position.y += this.velocity.y * timeDiff;

			/* Renew firefly's speed, position and direction when it flies off the boundary. */
			if (this.position.x < -this.radius || this.position.y < -this.radius ||
				this.position.x > boundary.width + this.radius || this.position.y > boundary.height + this.radius) {

				this.speed = FireflyState.WANDER.speed();
				this.behaviourSpeed = this.speed;
				this.position.x = boundary.width * Math.random();
				this.position.y = boundary.height + this.radius;
				this.dir = 2 * Math.PI * Math.random() - Math.PI;
			}
		};

		this.changeBehaviour = function (newBehaviour) {

			/* Change the behaviour only if it is a different behaviour. */
			if (this.behaviour != newBehaviour) {

				/* Update the behaviour state. */
				this.behaviour = newBehaviour;

				/* Initiate the behaviour state. */
				switch (this.behaviour) {
					case FireflyState.BEHAVIOUR.WANDER: 	this.behaviourColor = FireflyState.WANDER.color();	break;
					case FireflyState.BEHAVIOUR.ATTRACT: 	this.behaviourColor = FireflyState.ATTRACT.color();	break;
					case FireflyState.BEHAVIOUR.FOLLOW: 	this.behaviourColor = FireflyState.FOLLOW.color();	break;
					case FireflyState.BEHAVIOUR.FLEE: 		this.behaviourColor = FireflyState.FLEE.color();	break;
					case FireflyState.BEHAVIOUR.ARRIVE:		this.behaviourColor = FireflyState.ARRIVE.color();	break;
				}
			}
		};

		this.behave = function (targetPos, blurRange, targetDis, targetDir, targetSpeed) {

			/* Create a blurred target position from the mouse position and the blurring range. */
			var randDegree = 2 * Math.PI * Math.random();
			var blurredPos = { x: targetPos.x + Math.cos(randDegree) * blurRange, y: targetPos.y + Math.sin(randDegree) * blurRange };

			/* Process the behaviour action, which changes its Direction variance, Speed and Brightness range. */
			switch (this.behaviour) {
				case FireflyState.BEHAVIOUR.WANDER: 	this.wander();												break;
				case FireflyState.BEHAVIOUR.ATTRACT: 	this.attract(blurredPos);									break;
				case FireflyState.BEHAVIOUR.FOLLOW: 	this.follow(blurredPos, targetDis, targetDir, targetSpeed);	break;
				case FireflyState.BEHAVIOUR.FLEE: 		this.flee(blurredPos, targetDis);							break;
				case FireflyState.BEHAVIOUR.ARRIVE:		this.arrive(blurredPos, targetDis);								break;
			}
		};

		/** Move randomly. */
		this.wander = function () {

			/* Steer randomly. */
			this.dirVar = FireflyState.WANDER.randomDir();

			/* React slowing in speed. */
			this.acceleration = FireflyState.WANDER.acceleration;

			/* Slow speed with dim brightness. */
			this.behaviourSpeed = FireflyState.WANDER.speed();
			this.brightnessMin = FireflyState.WANDER.brightnessMin();
			this.brightnessMax = FireflyState.WANDER.brightnessMax();
		};

		/** Move towards the target in a slow speed. */
		this.attract = function (targetPos) {

			/* Get the directional angle to the target. */
			var directionToTarget = getDirection(this.position, targetPos);

			/* Steer towards the direction with medium force. */
			this.steer(directionToTarget, 0.3);

			/* React normally in speed. */
			this.acceleration = FireflyState.ATTRACT.acceleration;

			/* Medium speed with medium brightness. */
			this.behaviourSpeed = FireflyState.ATTRACT.speed();
			this.brightnessMin = FireflyState.ATTRACT.brightnessMin();
			this.brightnessMax = FireflyState.ATTRACT.brightnessMax();
		};

		/** Follow the same direction as the target and move in a medium fast speed. */
		this.follow = function (targetPos, targetDis, targetDir, targetSpeed) {

			/* A special steer force for following to make a cluster effect. */
			var steerForce = 600 / this.speed;
			steerForce = steerForce > 0.8 ? 0.8 : steerForce;

			/* Steer towards that direction with high force. */
			this.steer(targetDir, steerForce);

			/* React quickly in speed. */
			this.acceleration = FireflyState.FOLLOW.acceleration;

			/* Medium speed with dependence on targetSpeed, with medium brightness. */
			this.behaviourSpeed = targetSpeed * FireflyState.FOLLOW.speedMagnifier / (targetDis + FireflyState.FOLLOW.distanceFactor);
			this.brightnessMin = FireflyState.FOLLOW.brightnessMin();
			this.brightnessMax = FireflyState.FOLLOW.brightnessMax();
		};

		/** Move away from the target position in fast speed. */
		this.flee = function (targetPos, targetDis) {

			/* Get the reversed direction to the target. */
			var directionFromTarget = getDirection(targetPos, this.position);

			/* Steer away from the direction with maximum force. */
			this.steer(directionFromTarget, 1);

			/* React extremely quickly in speed. */
			this.acceleration = FireflyState.FLEE.acceleration;

			/* Extreme speed with great brightness. */
			this.behaviourSpeed = FireflyState.FLEE.speed() / targetDis * FireflyState.FLEE.speedFactor;
			this.brightnessMin = FireflyState.FLEE.brightnessMin();
			this.brightnessMax = FireflyState.FLEE.brightnessMax();
		};

		/** Move toward the target in fast speed, then eventually slow down as it approaches close. */
		this.arrive = function (targetPos, targetDis) {

			/* Get the directional angle to the target. */
			var directionToTarget = getDirection(this.position, targetPos);

			/* Steer towards the direction with maximum force. */
			this.steer(directionToTarget, 0.5);

			/* React quickly in speed. */
			this.acceleration = FireflyState.ARRIVE.acceleration;

			this.behaviourSpeed = targetDis * FireflyState.ARRIVE.speedFactor;
			this.brightnessMin = FireflyState.ARRIVE.brightnessMin();
			this.brightnessMax = FireflyState.ARRIVE.brightnessMax();
		};

		/** Steer to the direction by updating the direction variance. */
		this.steer = function (direction, steerForce) {
			if(this.dir > direction) {
				this.dirVar = (this.dir - direction > Math.PI) ? (direction - this.dir + 2 * Math.PI) * steerForce * steerFactor : (direction - this.dir) * steerForce * steerFactor;
			} else {
				this.dirVar = (direction - this.dir > Math.PI) ? (direction - this.dir - 2 * Math.PI) * steerForce * steerFactor : (direction - this.dir) * steerForce * steerFactor;
			}
		};
	};
});
