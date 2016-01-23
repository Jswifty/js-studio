define(function (require) {

	var State = require("./fireflystate");
	var Utils = {
	
		/* transfer function from color to an RGB string for ease of rendering. */
		toRGBString : function (color) { return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0); },
		
		/* The color changing speed in terms of value per second. */
		colorVar : 300,
		
		/* The change in brightness in terms of value per second. */
		brightnessVar : 3,
		
		/* The the steering factor for better effects. */
		steerFactor : 25,
		
		radius : function () { return 20 + 10 * Math.random(); },

		/** Calculate the distance from the origin position to the destination position. */
		getDistance : function (originPos, destPos) {
			var distanceVec = { x: destPos.x - originPos.x, y: destPos.y - originPos.y };
			return Math.sqrt(distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y);
		},
		
		/** Calculate the angle using trigonometry. Returns angle ranged from -180 to 180 degrees in radian. */
		getAngle : function (x, y, z) {
			return x > 0 ? Math.asin(y / z) : (y > 0 ? Math.PI - Math.asin(y / z) : -Math.asin(y / z) - Math.PI);
		},
		
		/** Calculate the middle angle in between two angles. */
		getMidAngle : function (angle1, angle2) {
			var midAngle = (angle1 + angle2) / 2;
			return (Math.abs(angle1 - angle2) > Math.PI) ? ((midAngle > 0) ? midAngle - Math.PI : midAngle + Math.PI) : midAngle;
		},
		
		/** Calculate the directional angle to the destination position in terms of the angle oriented from the East. */
		getDirection : function (originPos, destPos) {
			var distanceVec = { x: destPos.x - originPos.x, y: destPos.y - originPos.y };
			var distanceMag = Math.sqrt(distanceVec.x * distanceVec.x + distanceVec.y * distanceVec.y);
			
			return Utils.getAngle(distanceVec.x, distanceVec.y, distanceMag);
		}
	};

	return function () {

		/* Behaviour. Initially Wander. */
		this.behaviour = State.BEHAVIOUR.WANDER;
		
		/* Color. */
		this.color = { r: 0, g: 0, b: 0 };
		this.rgbString = Utils.toRGBString(this.color);
		
		/* Behaviour Color, initially Wandering color. */
		this.behaviourColor = State.WANDER.color();
		
		/* Brightness (Opacity). */
		this.brightness = 0;
		this.brightnessMin = 0;
		this.brightnessMax = 1;
		this.brightnessGrd = 1;
		this.brightnessString = "0";
		
		/* Radius. */
		this.radius = Utils.radius();
		
		/* Speed Magnitude. */
		this.speed = 0;
		
		/* Behaviour Speed, initially Wandering speed. And the acceleration for it. */
		this.behaviourSpeed = State.WANDER.speed();
		this.acceleration = State.WANDER.acceleration;
		
		/* Velocity. */
		this.velocity = { x: 0, y: 0 };

		/* Position, initially using a fault position. */
		this.position = { x: -10000, y: -10000 };
		
		/* Direction. */
		this.dir = 0;
		this.dirVar = 0;

		this.update = function (fireflyState, target, timeDiff, boundary) {
			
			var targetPos = target.position;
			var targetDir = target.direction;
			var targetSpeed = target.speed;
			
			var behaviourEffect = fireflyState.behaviour;
			var effectRange = fireflyState.effectRange;
			var blurRange = fireflyState.blurRange;
			
			/* Calculate the distance between itself and the mouse position. */
			var distance = Utils.getDistance(this.position, targetPos);
			
			/* If the firefly is within the effect range, then change its behaviour. Otherwise it will stay wander. */
			if (distance < effectRange) {
				this.changeBehaviour(behaviourEffect);
			} else {
				this.changeBehaviour(State.BEHAVIOUR.WANDER);
			}

			/* Update the Direction variance, Speed and Brightness range according to its behaviour state.
			 * Behaviour may act upon a target position, distance, direction and speed. */
			this.behave(targetPos, blurRange, distance, targetDir, targetSpeed);
			
			/* Update Color. */
			this.color.r += (this.color.r > this.behaviourColor.r) ? -Utils.colorVar * timeDiff : (this.color.r < this.behaviourColor.r) ? Utils.colorVar * timeDiff : 0;
			this.color.g += (this.color.g > this.behaviourColor.g) ? -Utils.colorVar * timeDiff : (this.color.g < this.behaviourColor.g) ? Utils.colorVar * timeDiff : 0;
			this.color.b += (this.color.b > this.behaviourColor.b) ? -Utils.colorVar * timeDiff : (this.color.b < this.behaviourColor.b) ? Utils.colorVar * timeDiff : 0;
			
			this.rgbString = Utils.toRGBString(this.color);
			
			/* Update Brightness. */
			this.brightnessGrd = (this.brightness >= this.brightnessMax) ? -1 : (this.brightness <= this.brightnessMin) ? 1 : this.brightnessGrd;
			this.brightness += this.brightnessGrd * Utils.brightnessVar * timeDiff;
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
				
				this.speed = State.WANDER.speed();
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
					case State.BEHAVIOUR.WANDER : 	this.behaviourColor = State.WANDER.color();		break;
					case State.BEHAVIOUR.ATTRACT : 	this.behaviourColor = State.ATTRACT.color();	break;
					case State.BEHAVIOUR.FOLLOW : 	this.behaviourColor = State.FOLLOW.color();		break;
					case State.BEHAVIOUR.FLEE : 		this.behaviourColor = State.FLEE.color();	break;
					case State.BEHAVIOUR.ARRIVE :	this.behaviourColor = State.ARRIVE.color();		break;
				}
			}
		};

		this.behave = function (targetPos, blurRange, targetDis, targetDir, targetSpeed) {
			
			/* Create a blurred target position from the mouse position and the blurring range. */
			var randDegree = 2 * Math.PI * Math.random();
			var blurredPos = { x: targetPos.x + Math.cos(randDegree) * blurRange, y: targetPos.y + Math.sin(randDegree) * blurRange };

			/* Process the behaviour action, which changes its Direction variance, Speed and Brightness range. */
			switch (this.behaviour) {
				case State.BEHAVIOUR.WANDER : 	this.wander();													break;
				case State.BEHAVIOUR.ATTRACT : 	this.attract(blurredPos);										break;
				case State.BEHAVIOUR.FOLLOW : 	this.follow(blurredPos, targetDis, targetDir, targetSpeed);		break;
				case State.BEHAVIOUR.FLEE : 	this.flee(blurredPos, targetDis);								break;
				case State.BEHAVIOUR.ARRIVE :	this.arrive(blurredPos, targetDis);								break;
			}
		};

		/** Move randomly. */
		this.wander = function () {

			/* Steer randomly. */
			this.dirVar = State.WANDER.randomDir();
			
			/* React slowing in speed. */
			this.acceleration = State.WANDER.acceleration;
			
			/* Slow speed with dim brightness. */
			this.behaviourSpeed = State.WANDER.speed();
			this.brightnessMin = State.WANDER.brightnessMin();
			this.brightnessMax = State.WANDER.brightnessMax();
		};

		/** Move towards the target in a slow speed. */
		this.attract = function (targetPos) {

			/* Get the directional angle to the target. */
			var directionToTarget = Utils.getDirection(this.position, targetPos);
			
			/* Steer towards the direction with medium force. */
			this.steer(directionToTarget, 0.3);

			/* React normally in speed. */
			this.acceleration = State.ATTRACT.acceleration;
			
			/* Medium speed with medium brightness. */
			this.behaviourSpeed = State.ATTRACT.speed();
			this.brightnessMin = State.ATTRACT.brightnessMin();
			this.brightnessMax = State.ATTRACT.brightnessMax();
		};

		/** Follow the same direction as the target and move in a medium fast speed. */
		this.follow = function (targetPos, targetDis, targetDir, targetSpeed) {
			
			/* A special steer force for following to make a cluster effect. */
			var steerForce = 600 / this.speed;
			steerForce = steerForce > 0.8 ? 0.8 : steerForce;
			
			/* Steer towards that direction with high force. */
			this.steer(targetDir, steerForce);
			
			/* React quickly in speed. */
			this.acceleration = State.FOLLOW.acceleration;
			
			/* Medium speed with dependence on targetSpeed, with medium brightness. */
			this.behaviourSpeed = targetSpeed * State.FOLLOW.speedMagnifier / (targetDis + State.FOLLOW.distanceFactor);
			this.brightnessMin = State.FOLLOW.brightnessMin();
			this.brightnessMax = State.FOLLOW.brightnessMax();
		};

		/** Move away from the target position in fast speed. */
		this.flee = function (targetPos, targetDis) {

			/* Get the reversed direction to the target. */
			var directionFromTarget = Utils.getDirection(targetPos, this.position);
			
			/* Steer away from the direction with maximum force. */
			this.steer(directionFromTarget, 1);
			
			/* React extremely quickly in speed. */
			this.acceleration = State.FLEE.acceleration;
			
			/* Extreme speed with great brightness. */
			this.behaviourSpeed = State.FLEE.speed() / targetDis * State.FLEE.speedFactor;
			this.brightnessMin = State.FLEE.brightnessMin();
			this.brightnessMax = State.FLEE.brightnessMax();
		};

		/** Move toward the target in fast speed, then eventually slow down as it approaches close. */
		this.arrive = function (targetPos, targetDis) {

			/* Get the directional angle to the target. */
			var directionToTarget = Utils.getDirection(this.position, targetPos);
			
			/* Steer towards the direction with maximum force. */
			this.steer(directionToTarget, 0.5);

			/* React quickly in speed. */
			this.acceleration = State.ARRIVE.acceleration;

			this.behaviourSpeed = targetDis * State.ARRIVE.speedFactor;
			this.brightnessMin = State.ARRIVE.brightnessMin();
			this.brightnessMax = State.ARRIVE.brightnessMax();
		};

		/** Steer to the direction by updating the direction variance. */
		this.steer = function (direction, steerForce) {
			if(this.dir > direction) {
				this.dirVar = (this.dir - direction > Math.PI) ? (direction - this.dir + 2 * Math.PI) * steerForce * Utils.steerFactor : (direction - this.dir) * steerForce * Utils.steerFactor;
			} else {
				this.dirVar = (direction - this.dir > Math.PI) ? (direction - this.dir - 2 * Math.PI) * steerForce * Utils.steerFactor : (direction - this.dir) * steerForce * Utils.steerFactor;
			}
		};
	};
});
