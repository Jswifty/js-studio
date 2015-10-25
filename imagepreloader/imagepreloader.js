
var ImagePreloader = function (images, callback) {

	var preloader = this;

	this.images = !(images instanceof Array) ? [images] : images;
	this.callback = callback;

	this.preloadedImages = [];

	this.preload = function () {

		function onload () {
			
			preloader.preloadedImages.push(this);

			if (preloader.preloadedImages.length === preloader.preloadedImages.length) {
				preloader.callback(preloader.preloadedImages);
			}
		}

		for (var i = 0; i < this.images.length; i++) {
			
			var image = new Image();
			
			image.onload = onload;
			image.src = images[i];
		}
	};
}
