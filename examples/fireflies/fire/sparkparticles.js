define(function (require) {

	var SparkUtils = require("./sparkutils");

	return function () {

		var sparkParticle = this;

		/* Color and the reducing speed in terms of pixels per second. */
		this.color = SparkUtils.startColor();
		this.colorVar = SparkUtils.colorVar();
		this.rgbString = SparkUtils.toRGBString(this.color);
		
		/* Radius. */
		this.radius = SparkUtils.startRadius();
		
		/* Position, initially using a fault position. */
		this.position = { x: -10000, y: -10000 };
		
		/* Velocity in terms of pixels per second. */
		this.velocity = SparkUtils.velocity();
		
		/* Lifespan and remaining life time in terms of seconds. */
		this.lifespan = SparkUtils.lifespan();
		this.remainingLife = this.lifespan;
		
		/* Opacity. */
		this.opacity = 1;
		this.opacityString = '1';
		
		this.update = function (newPosition, timeDiff) {
			
			/* Update lifespan and radius. */
			sparkParticle.remainingLife -= timeDiff;
			sparkParticle.radius -= SparkUtils.radiusVar * timeDiff;
			
			/* Update the spark particle. If the remainingLife is over, reset properties of the spark particle. */
			if (sparkParticle.remainingLife <= 0 || sparkParticle.radius <= 0) {
				sparkParticle.color = SparkUtils.startColor();
				
				sparkParticle.radius = SparkUtils.startRadius();
				
				sparkParticle.position = { x: newPosition.x, y: newPosition.y };
				
				sparkParticle.velocity = SparkUtils.velocity();
				
				sparkParticle.lifespan = SparkUtils.lifespan();
				sparkParticle.remainingLife = sparkParticle.lifespan;
			}
			else {
				sparkParticle.colorVar = SparkUtils.colorVar();
				sparkParticle.color.r -= sparkParticle.colorVar.r * timeDiff;
				sparkParticle.color.g -= sparkParticle.colorVar.g * timeDiff;
				sparkParticle.color.b -= sparkParticle.colorVar.b * timeDiff;
			
				sparkParticle.position.x += sparkParticle.velocity.x * timeDiff;
				sparkParticle.position.y += sparkParticle.velocity.y * timeDiff;
			}
			
			/* Update Color String. */
			sparkParticle.rgbString = SparkUtils.toRGBString(sparkParticle.color);
		}
	};
});
