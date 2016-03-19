define(function () {
	
	return {
		
		watchID: null,

		requestPosition: function (callback, error, settings) {

			settings = settings || {};

			var requestTimer;
			var geoLocation = window.navigator.geolocation;

			if (geoLocation) {

				if (settings.timeout) {
					requestTimer = setTimeout(function () {
						error({
							TIMEOUT: -2,
							code: -2,
							name: "geolocation request timed out"
						});
					}, settings.timeout);
				}

				geoLocation.getCurrentPosition(function (position) {

					if (requestTimer) {
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
		},

		watchPosition: function () {

			settings = settings || {};

			var requestTimer;
			var geoLocation = window.navigator.geolocation;

			if (geoLocation) {

				if (settings.timeout) {
					requestTimer = setTimeout(function () {
						error({
							TIMEOUT: -2,
							code: -2,
							name: "geolocation request timed out"
						});
					}, settings.timeout);
				}

				if (this.watchID) {
					geoLocation.clearWatch(this.watchID);
				}

				this.watchID = geoLocation.watchPosition(function (position) {

					if (requestTimer) {
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
		},

		stopWatchingPosition: function () {
			if (this.watchID) {
				window.navigator.geolocation.clearWatch(this.watchID);
			}
		}
	};
});

window.navigator = window.navigator || {};
