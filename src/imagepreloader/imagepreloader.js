define(function () {

	return function (images, callback) {

		if (typeof images === "string") {
			images = [ images ];
		} else if (images instanceof Array) {
			images = images;
		} else {
			images = [];
		}

		if (callback && typeof callback === "function") {
			callback = callback;
		} else {
			callback = function () {};
		}

		var preloadedImages = [];

		for (var i = 0; i < images.length; i++) {
			
			var image = new Image();
			
			image.onload = function () {
				
				preloadedImages.push(this);

				if (preloadedImages.length === images.length) {
					callback(preloadedImages);
				}
			};

			image.src = images[i];
		}
	};
});
