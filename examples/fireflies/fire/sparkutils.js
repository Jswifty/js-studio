define(function (require) {

	return {

		/* Start color of the spark : Bright yellow color. */
		startColor : function () {
			return {
				r: 255,
				g: 200 + 50 * Math.random(),
				b: 150
			};
		},
		
		/* Fire color reducing velocity in terms of value per second. */
		colorVar : function () {
			return {
				r: 800 - 400 * Math.random(),
				g: 800 - 400 * Math.random(),
				b: 1200 - 600 * Math.random()
			};
		},
		
		/* transfer function from color to an RGB string for ease of rendering. */
		toRGBString : function (color) {
			return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0);
		},
		
		/* Starting Radius. */
		startRadius : function () { return 15 + 10 * Math.random(); },
		
		/* Radius reducing speed in terms of pixels per second. */
		radiusVar : 50,
		
		/* Fire velocity in terms of pixels per second. */
		velocity : function () {
			return {
				x: -500 + 1000 * Math.random(), 
				y: -500 + 1000 * Math.random()
			};
		},
		
		/* Lifespan and remaining life time in terms of seconds. */
		lifespan : function () { return 0.2 + 0.05 * Math.random(); }
	};
});
