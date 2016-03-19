define(function () {
	
	return function (callback, error, settings) {
		
		if (window.navigator.getUserMedia) {	
			
			settings = settings || { video: true, audio: true };

			var requestTimer;

			if (settings.timeout) {
				requestTimer = setTimeout(function () {
					error({
						TIMEOUT: -2,
						code: -2,
						name: "getUserMedia request timed out"
					});
				}, settings.timeout);
			}

			window.navigator.getUserMedia(settings, function (stream) {

				if (requestTimer) {
					clearTimeout(requestTimer);
				}

				callback(stream);
			}, error);
		}
		else {
			error({
				NOTSUPPORTED: -1,
				code: -1,
				name: "getUserMedia not supported"
			});
		}
	};
});

window.navigator = window.navigator || {};
window.navigator.getUserMedia = window.navigator.getUserMedia 		||
								window.navigator.webkitGetUserMedia	||
								window.navigator.mozGetUserMedia;
