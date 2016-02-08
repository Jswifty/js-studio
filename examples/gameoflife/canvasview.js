/**  
 *	canvasview.js is an object class which creates an instance of a HTML5 canvas
 *	under the given DIV container.
 *	It also initiates an animator, in which it can pass rendering functions through into it.
 *
 *	Requires: animator.js, animatorlistener.js
 */ 
define(function (require) {

	var Animator = require("./animator");
	var AnimatorListener = require("./animatorlistener");

	return function (divContainer, animator) {
	
		var canvasView = this;
		
		/* Store the DIV container. */
		this.divContainer = divContainer;
		
		/* Create the canvas. */
		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.innerHTML = "Your browser does not support HTML5 canvas.";
		
		/* Create an Animator instance. */
		this.animator = animator || new Animator();
		
		/* The list of canvas view listeners this view is appended to. Each canvas view event will trigger the corresponding method of each listeners. */
		this.listeners = [];
		
		/** Canvas width getter. */
		this.getWidth = function () {
			return canvasView.canvas.width;
		};

		/** Canvas height getter. */
		this.getHeight = function () {
			return canvasView.canvas.height;
		};
		
		/** Canvas context getter. */
		this.getCanvas2DContext = function () {
			return canvasView.canvas.getContext("2d");
		};
		
		/** Perform action for window resize event. */
		this.onResize = function () {
			
			/* Set canvas dimensions. */
			canvasView.canvas.width = canvasView.divContainer.offsetWidth; 
			canvasView.canvas.height = canvasView.divContainer.offsetHeight;
		};
		
		/** Perform draw on the canvas based on the given draw function. */
		this.draw = function (drawFunction) {
			drawFunction(canvasView.getCanvas2DContext(), canvasView.getWidth(), canvasView.getHeight());
		};
		
		/** Add a drawing method to the animator. */
		this.addRenderFunction = function (renderFunction) {
			return canvasView.animator.addRenderFunction(canvasView, renderFunction);
		};
		
		/** Remove a drawing method from the animator. */
		this.removeRenderFunction = function (renderID) {
			canvasView.animator.removeRenderFunction(renderID);
		};

		/** Start the canvas view animation from the animator. */
		this.start = function () {
			canvasView.animator.start();
		};
		
		/** Call the animator to pause the animation. */
		this.pause = function () {
			canvasView.animator.pause();
		};
		
		/** Call the animator to resume the animation. */
		this.resume = function () {
			canvasView.animator.resume();
		};

		/** Add a canvas view listener to the canvas view . */
		this.addCanvasViewListener = function (canvasViewListener) {

			/* Make sure the input object qualifies as an instance of CanvasViewListener. */
			if (!canvasViewListener.onCanvasViewPause || typeof canvasViewListener.onCanvasViewPause !== "function") {
				canvasViewListener.onCanvasViewPause = function() {};
			}

			if (!canvasViewListener.onCanvasViewResume || typeof canvasViewListener.onCanvasViewResume !== "function") {
				canvasViewListener.onCanvasViewResume = function() {};
			}

			canvasView.listeners.push(canvasViewListener);
		};
		
		/** Remove a canvas view listener to the canvas view. */
		this.removeCanvasViewListener = function (canvasViewListener) {

			/* Attempt to find the index of the given listener and then remove it. */
			for (var i = canvasView.listeners.length - 1; i >= 0; i--) {
				if (canvasView.listeners[i] === canvasViewListener) {
					canvasView.listeners.splice(i, 1);
				}
			}
		};
		
		/** Perform action for animator pause event.
		 *	This will be called when calling pause() as well. */
		this.onPause = function () {
			for (var i = 0; i < canvasView.listeners.length; i++) {
				canvasView.listeners[i].onCanvasViewPause();
			}
		};

		/** Perform action for animator pause event.
		 *	This will be called when calling resume() as well. */
		this.onResume = function () {
			for (var i = 0; i < canvasView.listeners.length; i++) {
				canvasView.listeners[i].onCanvasViewResume();
			}
		};
		
		/* Append the canvas to the DIV container. */
		this.divContainer.appendChild(this.canvas);
		
		/* Fetch resize method of the DIV container and window. */
		this.divContainer.addEventListener("resize", canvasView.onResize);
		window.addEventListener("resize", canvasView.onResize);
		
		/* Create a Animator listener to adaptor events. */
		this.animatorListener = new AnimatorListener(this.onPause, this.onResume);
		
		/* Append the listener to the animator. */
		this.animator.addAnimatorListener(this.animatorListener);
		
		/* Update the canvas dimensions to fit the given container. */
		this.onResize();
	};
});
