/**  
 *	rain.js is an object class which generates the rain effect on a canvas.
 */ 
define(function (require) {

	return function (interval, density) {
	
		var rain = this;

		var rainDrops = [];

		this.interval = interval || 50;
		this.density = density || 0.5;

		this.start = function () {
			
			setTimeout(function () {
				
				rain.createRainDrop();

				if (rain.interval > 0) {
					rain.start();
				}
			}, rain.interval || 50);
		};

		this.createRainDrop = function () {
			rainDrops.push({
				startTime: new Date().getTime(),
				location: Math.random(),
				duration: 2000 + 4000 * Math.random()
			});
		};

		this.draw = function (context, width, height, dropWidth) {
			
			var nowTime = new Date().getTime();

			for (var i = rainDrops.length - 1; i >= 0; i--) {

				var rainDrop = rainDrops[i];
				var duration = rainDrop.duration;
				var dropTime = nowTime - rainDrop.startTime;

				if (dropTime >= duration) {
					rainDrops.splice(i, 1);
				}
				else {

					var location = Math.round(rainDrop.location * width / dropWidth) * dropWidth;
					var dropLength = height / duration * 4000;
					var dropEnd = dropTime / duration * (height + dropLength);
					var dropStart = dropEnd - dropLength;

					var gradient = context.createLinearGradient(0, dropStart, 0, dropEnd);
				
					gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
					gradient.addColorStop(0.5, "rgba(255, 255, 255, " + (rain.density || 0.5) + ")");
					
					context.fillStyle = gradient;
					context.fillRect(location, dropStart, dropWidth, dropLength);
				}
			}
		};
	};
});