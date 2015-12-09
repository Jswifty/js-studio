define(function (require) {

	return  {

		/* Start color of the fire : Bright yellow color. */
		startColor : function () {
			return {
				r: 255,
				g: 255 * Math.random(),
				b: 75
			};
		},
		
		/* Fire color reducing velocity in terms of value per second. */
		colorVar : function () {
			return {
				r: 480 - 120 * Math.random(),
				g: 960 - 240 * Math.random(),
				b: 480 - 120 * Math.random()
			};
		},
		
		/* transfer function from color to an RGB string for ease of rendering. */
		toRGBString : function (color) {
			return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0);
		},
		
		/* Starting Radius. */
		startRadius : function () { return 20 + 10 * Math.random(); },
		
		/* Radius reducing speed in terms of pixels per second. */
		radiusVar : 20,
		
		/* Fire velocity in terms of pixels per second. */
		velocity : function () {
			return {
				x: -90 + 180 * Math.random(),
				y: -600 + 300 * Math.random()
			};
		},
		
		/* Lifespan and remaining life time in terms of seconds. */
		lifespan : function () { return 0.2 + 0.1 * Math.random(); }
	};
});
