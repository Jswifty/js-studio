define(function () {

	/**** SPARK PARTICLES CONFIG ****/
		
	/* Radius reducing speed in terms of pixels per second. */
	var radiusVar = 10;

	/* Downward speed in terms of pixels per second. */
	var gravityVar = 30;
	
	/* Start color of the spark : Bright yellow color. */
	function startColor () {
		return {
			r: 255,
			g: 200 + 50 * Math.random(),
			b: 150
		};
	}
	
	/* Fire color reducing velocity in terms of value per second. */
	function colorVar () {
		return {
			r: 800 - 400 * Math.random(),
			g: 800 - 400 * Math.random(),
			b: 1200 - 600 * Math.random()
		};
	}
	
	/* transfer function from color to an RGB string for ease of rendering. */
	function toRGBString (color) {
		return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0);
	}
	
	/* Starting Radius. */
	function startRadius () {
		return 5 + 5 * Math.random();
	}
	
	/* Fire velocity in terms of pixels per second. */
	function velocity () {
		return {
			x: -500 + 1000 * Math.random(), 
			y: -750 + 1000 * Math.random()
		};
	}
	
	/* Lifespan and remaining life time in terms of seconds. */
	function lifespan () {
		return 1 + 2 * Math.random();
	}

	/**** SPARK PARTICLES OBJECT ****/

	return function () {

		var sparkParticle = this;

		/* Color and the reducing speed in terms of pixels per second. */
		this.color = startColor();
		this.colorVar = colorVar();
		this.rgbString = toRGBString(this.color);
		
		/* Radius. */
		this.radius = startRadius();
		
		/* Position, initially using a fault position. */
		this.position = { x: -10000, y: -10000 };
		
		/* Velocity in terms of pixels per second. */
		this.velocity = velocity();
		
		/* Lifespan and remaining life time in terms of seconds. */
		this.lifespan = lifespan();
		this.remainingLife = this.lifespan;
		
		/* Opacity. */
		this.opacity = 1;
		this.opacityString = "1";
		
		this.update = function (newPosition, timeDiff) {
			
			/* Update lifespan and radius. */
			sparkParticle.remainingLife -= timeDiff;
			sparkParticle.radius -= radiusVar * timeDiff;
			
			/* Update the spark particle. If the remainingLife is over, reset properties of the spark particle. */
			if (sparkParticle.remainingLife <= 0 || sparkParticle.radius <= 0) {
				sparkParticle.color = startColor();
				
				sparkParticle.radius = startRadius();
				
				sparkParticle.position = { x: newPosition.x, y: newPosition.y };
				
				sparkParticle.velocity = velocity();
				
				sparkParticle.lifespan = lifespan();
				sparkParticle.remainingLife = sparkParticle.lifespan;
			}
			else {
				sparkParticle.colorVar = colorVar();
				sparkParticle.color.r -= sparkParticle.colorVar.r * timeDiff;
				sparkParticle.color.g -= sparkParticle.colorVar.g * timeDiff;
				sparkParticle.color.b -= sparkParticle.colorVar.b * timeDiff;
			
				sparkParticle.position.x += sparkParticle.velocity.x * timeDiff;
				sparkParticle.position.y += sparkParticle.velocity.y * timeDiff;
			}

			/* Update vertical velocity. */
			sparkParticle.velocity.y += gravityVar;
			
			/* Update Color String. */
			sparkParticle.rgbString = toRGBString(sparkParticle.color);
		}
	};
});
