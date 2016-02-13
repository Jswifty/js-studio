define(function (require) {

	return {
	
		getState : function (fireflyBehaviour) {
			switch (fireflyBehaviour) {
				case this.BEHAVIOUR.WANDER : return { behaviour: fireflyBehaviour, effectRange: 0, blurRange: 0 }; break;
				case this.BEHAVIOUR.ATTRACT : return { behaviour: fireflyBehaviour, effectRange: 300, blurRange: 350 }; break;
				case this.BEHAVIOUR.FOLLOW : return { behaviour: fireflyBehaviour, effectRange: 200, blurRange: 100 }; break;
				case this.BEHAVIOUR.FLEE : return { behaviour: fireflyBehaviour, effectRange: 300, blurRange: 0 }; break;
				case this.BEHAVIOUR.ARRIVE : return { behaviour: fireflyBehaviour, effectRange: 10000, blurRange: 50 }; break;
			}
		},

		Target : function (position, direction, speed) {
			this.position = position;
			this.direction = direction;
			this.speed = speed;
		},

		BEHAVIOUR : {
			WANDER : 0,
			ATTRACT : 1,
			FOLLOW : 2,
			FLEE : 3,
			ARRIVE : 4
		},

		/** Move randomly. */
		WANDER : {

			/* Purple color with variance. */
			color : function () {
				return {
					r: 255 * Math.random() >> 0,
					g: 0,
					b: 255
				};
			},
			
			/* Slow speed, in terms of pixels per second. */
			speed : function () { return 30 + 30 * Math.random(); },
			
			/* React slowly in speed, in terms of pixels per second. */
			acceleration : 300,
			
			/* Steer Randomly. */
			randomDir : function () { return -7.5 + 15 * Math.random(); },
			
			/* Dim brightness range. */
			brightnessMin : function () { return  -2 + 0.5 * Math.random(); },
			brightnessMax : function () { return  0.5 + 0.5 * Math.random(); }
		},

		/** Move towards the target in a slow speed. */
		ATTRACT : {

			/* Yellow color with variance. */
			color : function () {
				return {
					r: 255,
					g: 255 * Math.random() >> 0,
					b: 0
				};
			},
			
			/* Medium speed, in terms of pixels per second. */
			speed : function () { return 50 + 50 * Math.random(); },
			
			/* React normally in speed, in terms of pixels per second. */
			acceleration : 700,
			
			/* Medium brightness range. */
			brightnessMin : function () { return  -0.4 + 0.4 * Math.random(); },
			brightnessMax : function () { return  1 + 0.2 * Math.random(); }
		},

		/** Follow the same direction as the target and move in a medium fast speed. */
		FOLLOW : {

			/* Green color with variance. */
			color : function () {
				return {
					r: 0,
					g: 255 * Math.random() >> 0,
					b: 255
				};
			},
			
			/* Speed with dependence on the target speed. Therefore no standard speed applied. */
			speed : null,
			
			/* The speed magnifier for better effect. */
			speedMagnifier : 40,
			
			/* The distance factor for better effect. */
			distanceFactor : 20,
			
			/* React extremely quickly in speed, in terms of pixels per second. */
			acceleration : 2500,
			
			/* Medium brightness range. */
			brightnessMin : function () { return  -0.2 + 0.4 * Math.random(); },
			brightnessMax : function () { return  1 + 0.2 * Math.random(); }
		},

		/** Move away from the target position in fast speed. */
		FLEE : {

			/* Blue color with variance. */
			color : function () {
				return {
					r: 0,
					g: 255 * Math.random() >> 0,
					b: 255
				};
			},
			
			/* Extreme speed, in terms of pixels per second. */
			speed : function () { return 800 + 200 * Math.random(); },
			
			/* Speed factor for better effects. */
			speedFactor : 100,
			
			/* React extremely quickly in speed, in terms of pixels per second. */
			acceleration : 4000,
			
			/* Great brightness range. */
			brightnessMin : function () { return  0 + 0.4 * Math.random(); },
			brightnessMax : function () { return  1 + 0.2 * Math.random(); }
		},

		/** Move toward the target in fast speed, then eventually slow down as it approaches close. */
		ARRIVE : {

			/* Color with all variance. */
			color : function () {
				return {
					r: 255 * Math.random() >> 0,
					g: 255 * Math.random() >> 0,
					b: 255 * Math.random() >> 0
				};
			},
			
			/* Speed with dependence on the target position. Therefore no standard speed applied. */
			speed : null,
			
			/* Speed factor for better effects. */
			speedFactor : 2,
			
			/* React quickly in speed, in terms of pixels per second. */
			acceleration : 800,
			
			/* Great brightness range. */
			brightnessMin : function () { return  0 + 0.4 * Math.random(); },
			brightnessMax : function () { return  1 + 0.2 * Math.random(); }
		}
	};
});
