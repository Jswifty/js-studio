define(function () {

	return function (interval, density) {

		var codeRain = this;

		codeRain.rainDrops = [];
		codeRain.interval = interval || 50;
		codeRain.density = density || 0.3;
		codeRain.pauseTime = -1;

		codeRain.start = function () {
			setTimeout(function () {
				codeRain.createRainDrop();

				if (codeRain.interval > 0) {
					codeRain.start();
				}
			}, codeRain.interval);
		};

		codeRain.pause = function () {
			codeRain.pauseTime = new Date().getTime();
		};

		codeRain.resume = function () {
			codeRain.pauseTime = -1;
		};

		codeRain.stop = function () {
			codeRain.interval = 0;
		};

		codeRain.createRainDrop = function () {
			codeRain.rainDrops.push({
				startTime: new Date().getTime(),
				location: Math.random(),
				duration: 2000 + 4000 * Math.random()
			});
		};

		codeRain.draw = function (context, width, height, dropWidth) {
			var nowTime = codeRain.pauseTime === -1 ? new Date().getTime() : codeRain.pauseTime;

			for (var i = codeRain.rainDrops.length - 1; i >= 0; i--) {
				var rainDrop = codeRain.rainDrops[i];
				var duration = rainDrop.duration;
				var dropTime = nowTime - rainDrop.startTime;

				if (dropTime >= duration) {
					codeRain.rainDrops.splice(i, 1);
				} else {
					var location = Math.round(rainDrop.location * width / dropWidth) * dropWidth;
					var dropLength = height / duration * 4000;
					var dropEnd = dropTime / duration * (height + dropLength);
					var dropStart = dropEnd - dropLength;

					var gradient = context.createLinearGradient(0, dropStart, 0, dropEnd);

					gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
					gradient.addColorStop(0.5, "rgba(255, 255, 255, " + codeRain.density + ")");

					context.fillStyle = gradient;
					context.fillRect(location, dropStart, dropWidth, dropLength);
				}
			}
		};
	};
});
