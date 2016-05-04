define(function () {
	
	window.navigator = window.navigator || {};

	return function () {
		
		var geoLocator = this;

		this.geoLocation = window.navigator.geolocation;

		this.watchID = null;

		this.requestPosition = function (callback, error, settings) {

			var requestTimer;

			settings = settings || {};

			if (geoLocator.geoLocation !== undefined) {

				if (settings.timeout !== undefined) {
					requestTimer = setTimeout(function () {
						error({
							TIMEOUT: -2,
							code: -2,
							name: "geolocation request timed out"
						});
					}, settings.timeout);
				}

				geoLocator.geoLocation.getCurrentPosition(function (position) {

					if (requestTimer !== undefined) {
						clearTimeout(requestTimer);
					}

					callback(position);

				}, error, settings);
			}
			else {
				error({
					NOTSUPPORTED: -1,
					code: -1,
					name: "geolocation not supported"
				});
			}
		};

		this.watchPosition = function () {

			var requestTimer;
			
			settings = settings || {};

			if (geoLocator.geoLocation !== undefined) {

				if (settings.timeout !== undefined) {

					requestTimer = setTimeout(function () {
						error({
							TIMEOUT: -2,
							code: -2,
							name: "geolocation request timed out"
						});
					}, settings.timeout);
				}

				if (geoLocator.watchID !== undefined) {
					geoLocator.geoLocation.clearWatch(geoLocator.watchID);
				}

				geoLocator.watchID = geoLocator.geoLocation.watchPosition(function (position) {

					if (requestTimer !== undefined) {
						clearTimeout(requestTimer);
					}

					callback(position);

				}, error, settings);
			}
			else {
				error({
					NOTSUPPORTED: -1,
					code: -1,
					name: "geolocation not supported"
				});
			}
		};

		this.stopWatchingPosition = function () {
			if (geoLocator.watchID !== undefined) {
				geoLocator.geoLocation.clearWatch(geoLocator.watchID);
			}
		};
	};
});
