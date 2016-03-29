define(function () {
	
	window.navigator = window.navigator || {};

	return {
		
		geoLocation: window.navigator.geolocation,

		watchID: null,

		requestPosition: function (callback, error, settings) {

			settings = settings || {};

			var requestTimer;

			if (this.geoLocation) {

				if (settings.timeout) {
					requestTimer = setTimeout(function () {
						error({
							TIMEOUT: -2,
							code: -2,
							name: "geolocation request timed out"
						});
					}, settings.timeout);
				}

				this.geoLocation.getCurrentPosition(function (position) {

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

			if (this.geoLocation) {

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
					this.geoLocation.clearWatch(this.watchID);
				}

				this.watchID = this.geoLocation.watchPosition(function (position) {

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
				this.geoLocation.clearWatch(this.watchID);
			}
		}
	};
});
