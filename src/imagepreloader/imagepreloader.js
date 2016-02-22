define(function (require) {

	return function (images, callback) {

		if (typeof images === "string") {
			images = [images];
		} 

		if (images instanceof Array && typeof callback === "function") {

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
		}
	};
});
