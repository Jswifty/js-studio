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

		var firefly = this;

		/* Behaviour. Initially Wander. */
		firefly.behaviour = FireflyState.BEHAVIOUR.WANDER;

		/* Color. */
		firefly.color = { r: 0, g: 0, b: 0 };
		firefly.rgbString = toRGBString(firefly.color);

		/* Behaviour Color, initially Wandering color. */
		firefly.behaviourColor = FireflyState.WANDER.color();

		/* Brightness (Opacity). */
		firefly.brightness = 0;
		firefly.brightnessMin = 0;
		firefly.brightnessMax = 1;
		firefly.brightnessGrd = 1;
		firefly.brightnessString = "0";

		/* Radius. */
		firefly.radius = radius();

		/* Speed Magnitude. */
		firefly.speed = 0;

		/* Behaviour Speed, initially Wandering speed. And the acceleration for it. */
		firefly.behaviourSpeed = FireflyState.WANDER.speed();
		firefly.acceleration = FireflyState.WANDER.acceleration;

		/* Velocity. */
		firefly.velocity = { x: 0, y: 0 };

		/* Position, initially using a fault position. */
		firefly.position = { x: -10000, y: -10000 };

		/* Direction. */
		firefly.dir = 0;
		firefly.dirVar = 0;

		firefly.update = function (state, target, timeDiff, boundary) {
			var targetPos = target.position;
			var targetDir = target.direction;
			var targetSpeed = target.speed;

			var behaviourEffect = state.behaviour;
			var effectRange = state.effectRange;
			var blurRange = state.blurRange;

			/* Calculate the distance between itself and the mouse position. */
			var distance = getDistance(firefly.position, targetPos);

			/* If the firefly is within the effect range, then change its behaviour. Otherwise it will stay wander. */
			if (distance < effectRange) {
				firefly.changeBehaviour(behaviourEffect);
			} else {
				firefly.changeBehaviour(FireflyState.BEHAVIOUR.WANDER);
			}

			/* Update the Direction variance, Speed and Brightness range according to its behaviour state.
			 * Behaviour may act upon a target position, distance, direction and speed. */
			firefly.behave(targetPos, blurRange, distance, targetDir, targetSpeed);

			/* Update Color. */
			firefly.color.r += (firefly.color.r > firefly.behaviourColor.r) ? -colorVar * timeDiff : (firefly.color.r < firefly.behaviourColor.r) ? colorVar * timeDiff : 0;
			firefly.color.g += (firefly.color.g > firefly.behaviourColor.g) ? -colorVar * timeDiff : (firefly.color.g < firefly.behaviourColor.g) ? colorVar * timeDiff : 0;
			firefly.color.b += (firefly.color.b > firefly.behaviourColor.b) ? -colorVar * timeDiff : (firefly.color.b < firefly.behaviourColor.b) ? colorVar * timeDiff : 0;

			firefly.rgbString = toRGBString(firefly.color);

			/* Update Brightness. */
			firefly.brightnessGrd = (firefly.brightness >= firefly.brightnessMax) ? -1 : (firefly.brightness <= firefly.brightnessMin) ? 1 : firefly.brightnessGrd;
			firefly.brightness += firefly.brightnessGrd * brightnessVar * timeDiff;
			firefly.brightnessString = firefly.brightness.toFixed(2);

			/* Update Speed. */
			firefly.speed += (firefly.speed > firefly.behaviourSpeed) ? -firefly.acceleration * timeDiff : (firefly.speed < firefly.behaviourSpeed) ? firefly.acceleration * timeDiff : 0;

			/* Update direction (only in range of -180 degree to 180 degree). */
			firefly.dir += firefly.dirVar * timeDiff;
			firefly.dir = (firefly.dir > Math.PI) ? firefly.dir - 2 * Math.PI : (firefly.dir < -Math.PI) ? firefly.dir + 2 * Math.PI : firefly.dir;

			/* Update velocity and position. */
			firefly.velocity.x = firefly.speed * Math.cos(firefly.dir);
			firefly.velocity.y = firefly.speed * Math.sin(firefly.dir);
			firefly.position.x += firefly.velocity.x * timeDiff;
			firefly.position.y += firefly.velocity.y * timeDiff;

			/* Renew firefly's speed, position and direction when it flies off the boundary. */
			if (firefly.position.x < -firefly.radius || firefly.position.y < -firefly.radius ||
				firefly.position.x > boundary.width + firefly.radius || firefly.position.y > boundary.height + firefly.radius) {

				firefly.speed = FireflyState.WANDER.speed();
				firefly.behaviourSpeed = firefly.speed;
				firefly.position.x = boundary.width * Math.random();
				firefly.position.y = boundary.height + firefly.radius;
				firefly.dir = 2 * Math.PI * Math.random() - Math.PI;
			}
		};

		firefly.changeBehaviour = function (newBehaviour) {

			/* Change the behaviour only if it is a different behaviour. */
			if (firefly.behaviour != newBehaviour) {

				/* Update the behaviour state. */
				firefly.behaviour = newBehaviour;

				/* Initiate the behaviour state. */
				switch (firefly.behaviour) {
					case FireflyState.BEHAVIOUR.WANDER: 	firefly.behaviourColor = FireflyState.WANDER.color();	break;
					case FireflyState.BEHAVIOUR.ATTRACT: 	firefly.behaviourColor = FireflyState.ATTRACT.color();	break;
					case FireflyState.BEHAVIOUR.FOLLOW: 	firefly.behaviourColor = FireflyState.FOLLOW.color();	break;
					case FireflyState.BEHAVIOUR.FLEE: 		firefly.behaviourColor = FireflyState.FLEE.color();	break;
					case FireflyState.BEHAVIOUR.ARRIVE:		firefly.behaviourColor = FireflyState.ARRIVE.color();	break;
				}
			}
		};

		firefly.behave = function (targetPos, blurRange, targetDis, targetDir, targetSpeed) {

			/* Create a blurred target position from the mouse position and the blurring range. */
			var randDegree = 2 * Math.PI * Math.random();
			var blurredPos = { x: targetPos.x + Math.cos(randDegree) * blurRange, y: targetPos.y + Math.sin(randDegree) * blurRange };

			/* Process the behaviour action, which changes its Direction variance, Speed and Brightness range. */
			switch (firefly.behaviour) {
				case FireflyState.BEHAVIOUR.WANDER: 	firefly.wander();												break;
				case FireflyState.BEHAVIOUR.ATTRACT: 	firefly.attract(blurredPos);									break;
				case FireflyState.BEHAVIOUR.FOLLOW: 	firefly.follow(blurredPos, targetDis, targetDir, targetSpeed);	break;
				case FireflyState.BEHAVIOUR.FLEE: 		firefly.flee(blurredPos, targetDis);							break;
				case FireflyState.BEHAVIOUR.ARRIVE:		firefly.arrive(blurredPos, targetDis);								break;
			}
		};

		/** Move randomly. */
		firefly.wander = function () {

			/* Steer randomly. */
			firefly.dirVar = FireflyState.WANDER.randomDir();

			/* React slowing in speed. */
			firefly.acceleration = FireflyState.WANDER.acceleration;

			/* Slow speed with dim brightness. */
			firefly.behaviourSpeed = FireflyState.WANDER.speed();
			firefly.brightnessMin = FireflyState.WANDER.brightnessMin();
			firefly.brightnessMax = FireflyState.WANDER.brightnessMax();
		};

		/** Move towards the target in a slow speed. */
		firefly.attract = function (targetPos) {

			/* Get the directional angle to the target. */
			var directionToTarget = getDirection(firefly.position, targetPos);

			/* Steer towards the direction with medium force. */
			firefly.steer(directionToTarget, 0.3);

			/* React normally in speed. */
			firefly.acceleration = FireflyState.ATTRACT.acceleration;

			/* Medium speed with medium brightness. */
			firefly.behaviourSpeed = FireflyState.ATTRACT.speed();
			firefly.brightnessMin = FireflyState.ATTRACT.brightnessMin();
			firefly.brightnessMax = FireflyState.ATTRACT.brightnessMax();
		};

		/** Follow the same direction as the target and move in a medium fast speed. */
		firefly.follow = function (targetPos, targetDis, targetDir, targetSpeed) {

			/* A special steer force for following to make a cluster effect. */
			var steerForce = 600 / firefly.speed;
			steerForce = steerForce > 0.8 ? 0.8 : steerForce;

			/* Steer towards that direction with high force. */
			firefly.steer(targetDir, steerForce);

			/* React quickly in speed. */
			firefly.acceleration = FireflyState.FOLLOW.acceleration;

			/* Medium speed with dependence on targetSpeed, with medium brightness. */
			firefly.behaviourSpeed = targetSpeed * FireflyState.FOLLOW.speedMagnifier / (targetDis + FireflyState.FOLLOW.distanceFactor);
			firefly.brightnessMin = FireflyState.FOLLOW.brightnessMin();
			firefly.brightnessMax = FireflyState.FOLLOW.brightnessMax();
		};

		/** Move away from the target position in fast speed. */
		firefly.flee = function (targetPos, targetDis) {

			/* Get the reversed direction to the target. */
			var directionFromTarget = getDirection(targetPos, firefly.position);

			/* Steer away from the direction with maximum force. */
			firefly.steer(directionFromTarget, 1);

			/* React extremely quickly in speed. */
			firefly.acceleration = FireflyState.FLEE.acceleration;

			/* Extreme speed with great brightness. */
			firefly.behaviourSpeed = FireflyState.FLEE.speed() / targetDis * FireflyState.FLEE.speedFactor;
			firefly.brightnessMin = FireflyState.FLEE.brightnessMin();
			firefly.brightnessMax = FireflyState.FLEE.brightnessMax();
		};

		/** Move toward the target in fast speed, then eventually slow down as it approaches close. */
		firefly.arrive = function (targetPos, targetDis) {

			/* Get the directional angle to the target. */
			var directionToTarget = getDirection(firefly.position, targetPos);

			/* Steer towards the direction with maximum force. */
			firefly.steer(directionToTarget, 0.5);

			/* React quickly in speed. */
			firefly.acceleration = FireflyState.ARRIVE.acceleration;

			firefly.behaviourSpeed = targetDis * FireflyState.ARRIVE.speedFactor;
			firefly.brightnessMin = FireflyState.ARRIVE.brightnessMin();
			firefly.brightnessMax = FireflyState.ARRIVE.brightnessMax();
		};

		/** Steer to the direction by updating the direction variance. */
		firefly.steer = function (direction, steerForce) {
			if(firefly.dir > direction) {
				firefly.dirVar = (firefly.dir - direction > Math.PI) ? (direction - firefly.dir + 2 * Math.PI) * steerForce * steerFactor : (direction - firefly.dir) * steerForce * steerFactor;
			} else {
				firefly.dirVar = (direction - firefly.dir > Math.PI) ? (direction - firefly.dir - 2 * Math.PI) * steerForce * steerFactor : (direction - this.dir) * steerForce * steerFactor;
			}
		};
	};
});
