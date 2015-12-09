define(function (require) {

	var FireUtils = require("./fireutils");

	return function () {
		
		var fireParticle = this;
		
		/* Color and the reducing speed in terms of pixels per second. */
		this.color = FireUtils.startColor();
		this.colorVar = FireUtils.colorVar();
		this.rgbString = FireUtils.toRGBString(this.color);
		
		/* Radius. */
		this.radius = FireUtils.startRadius();
		
		/* Position, initially using a fault position. */
		this.position = { x: -10000, y: -10000 };
		
		/* Velocity in terms of pixels per second. */
		this.velocity = FireUtils.velocity();
		
		/* Lifespan and remaining life time in terms of seconds. */
		this.lifespan = FireUtils.lifespan();
		this.remainingLife = this.lifespan * Math.random();
		
		/* Opacity. */
		this.opacity = 1;
		this.opacityString = '1';

		this.update = function (newPosition, timeDiff) {
			
			/* Update lifespan and radius. */
			fireParticle.remainingLife -= timeDiff;
			fireParticle.radius -= FireUtils.radiusVar * timeDiff;
			
			/* Update Opacity. */
			fireParticle.opacity = fireParticle.remainingLife / fireParticle.lifespan;
			fireParticle.opacityString = fireParticle.opacity.toFixed(2);
			
			/* Update the fire particle. If the remainingLife is over, reset properties of the fire particle. */
			if (fireParticle.remainingLife <= 0 || fireParticle.radius <= 0) {
				fireParticle.color = FireUtils.startColor();
				
				fireParticle.radius = FireUtils.startRadius();
				
				fireParticle.position = { x: newPosition.x, y: newPosition.y };
				
				fireParticle.lifespan = FireUtils.lifespan();
				fireParticle.remainingLife = fireParticle.lifespan;
			}
			else {
				fireParticle.colorVar = FireUtils.colorVar();
				fireParticle.color.r -= fireParticle.colorVar.r * timeDiff;
				fireParticle.color.g -= fireParticle.colorVar.g * timeDiff;
				fireParticle.color.b -= fireParticle.colorVar.b * timeDiff;
				
				fireParticle.position.x += fireParticle.velocity.x * timeDiff;
				fireParticle.position.y += fireParticle.velocity.y * timeDiff;
			}
			
			/* Update Color String. */
			fireParticle.rgbString = FireUtils.toRGBString(fireParticle.color);
		};
	};
});
