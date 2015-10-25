/**  
 *	ImagePreloader.js is an object class which can stack up images for preloading, 
 * 	and trigger the callback function once all images are loaded completely.
 */
var ImagePreloader = function (images, callback) {

	var preloader = this;

	this.images = !(images instanceof Array) ? [images] : images;
	this.callback = !(typeof callback === "function") ? function() {} : callback;

	this.preloadedImages = [];

	this.addImages = function (images) {

		images = !(images instanceof Array) ? [images] : images;

		for (var i = 0; i < images.length; i++) {
			if (this.images.indexOf(images[i]) === -1) {
				this.images.push(images[i]);
			}
		}
	};

	this.removeImages = function (images) {

		images = !(images instanceof Array) ? [images] : images;

		for (var i = images.length - 1; i >= 0; i--) {
			if (this.images.indexOf(images[i]) === -1) {
				this.images.splice(i, 1);
			}
		}
	};

	this.setCallback = function (callback) {
		
		if (typeof callback === "function") {
			this.callback = callback;
		}
	};

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
