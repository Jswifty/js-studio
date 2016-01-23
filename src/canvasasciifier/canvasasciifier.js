/**  
 *	canvasasciifier.js is an object class which generates the ascii effect of
 *	a given canvas display, optionally with configurations. 
 *	It also allows canvas with animations, which the animator can then be 
 *	passed in as a parameter.
 */ 
define(function (require) {

	return function (canvas, config, animator) {
	
		var asciifier = this;
		
		/* Store the canvas element. */
		this.canvas = canvas;

		config = config || {};

		this.invert = false;

		if (config.invert !== undefined) {
			this.invert = config.invert;
		}

		this.asciiData = config.asciiData || [" ", ".", ",", ";", "|", "*", "%", "@", "X", "#", "W", "M"];
		this.asciiIntervals = 255 / this.asciiData.length;

		/* Create the pre text area. */
		this.textpre = document.createElement("pre");
		this.textpre.style.font = config.font || "bold 10px/7px Courier New";
		this.textpre.style.position = "absolute";
		this.textpre.style.height = "auto";
		this.textpre.style.width = "auto";
		this.textpre.style.margin = "0px";
		this.textpre.style.background = config.background || "white";
		this.textpre.style.color = config.color || "black";

		/* Setup a 10 x 10 text area for calculating the true font size. */
		this.textpre.innerHTML = "..........\n..........\n..........\n..........\n..........\n..........\n..........\n..........\n..........\n..........";

		canvas.parentElement.appendChild(this.textpre);
		canvas.parentElement.style.overflow = "hidden";

		this.textWidth = this.textpre.offsetWidth / 10;
		this.textHeight = this.textpre.offsetHeight / 10;
		
		/* Perform action for window resize event. */
		this.onResize = function () {
			asciifier.update();
		};
		
		/* Perform an update on all the ascii text area by capturing the canvas' image data. */
		this.update = function () {

			var context = asciifier.canvas.getContext("2d");
			var imageData = context.getImageData(0, 0, asciifier.canvas.width, asciifier.canvas.height);
			var pixels = imageData.data;

			var canvasWidthScale = asciifier.canvas.offsetWidth / asciifier.canvas.width;
			var canvasHeightScale = asciifier.canvas.offsetHeight / asciifier.canvas.height;

			var widthScale = asciifier.textWidth / canvasWidthScale;
			var heightScale = asciifier.textHeight / canvasHeightScale;

			var asciiCode = "";

			for (var y = 0; y <= asciifier.canvas.height - heightScale; y += heightScale) {
				for (var x = 0; x <= asciifier.canvas.width - widthScale; x += widthScale) {

					var i = Math.round(y) * asciifier.canvas.width * 4 + Math.round(x) * 4;

					var averageValue = pixels[i] + pixels[i+1] + pixels[i+2];

					if (asciifier.invert !== true) {
						averageValue = 765 - averageValue;
					}
					
					averageValue = averageValue / 3 * pixels[i+3] / 255;

					var currentValue = asciifier.asciiIntervals;
					var currentIndex = 0;

					while (averageValue > currentValue && currentIndex < asciifier.asciiData.length - 1) {
						currentValue += asciifier.asciiIntervals;
						currentIndex++;
					}

					asciiCode += asciifier.asciiData[currentIndex];
				}

				asciiCode += "\n";
			}

			asciifier.textpre.innerHTML = asciiCode;
		};

		/* Fetch resize method of the canvas and window. */
		canvas.addEventListener("resize", asciifier.onResize);
		window.addEventListener("resize", asciifier.onResize);
		
		/* Update the pre text area dimensions to fit the given container. */
		this.onResize();

		/* If the canvas is animating by an animator, plug in the update function to the rendering function. */
		if (animator && animator.addRenderFunction) {
			animator.addRenderFunction(this, this.update);
		}
	};
});
