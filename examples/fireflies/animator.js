/**
 *  animator.js is an object class which registers rendering functions from objects and executes them 
 *  repeatedly in a rate depended on the native window browser's requestAnimationFrame method.
 */ 
define(function (require) {

	return function () {
	
		var animator = this;

		/* The rendering references is an map object consists of list of literal keys (renderIDs) mapped 
		 * to an object and a corresponding rendering function. */
		this.renderReferences = {};
		
		/* The number of render IDs being generated and registered. */
		this.renderIDCount = 0;
		
		/* The required frame rate of the animation in terms of frames per seconds, by default is 60 FPS. */
		this.FPS = 60;
		
		/* The minimum frame rate available for animation, by default is 10 FPS. */
		this.minFPS = 10;
			
		/* The maximum frame rate available for animation, by default is 60 FPS. */
		this.maxFPS = 60;
		
		/* The maximum time difference allowed for animation, which is 0.1 second. */
		this.maxTimeDiff = 1 / this.minFPS;
		
		/* The minimum time difference allowed for animation, which is roughly 0.017 second. */
		this.minTimeDiff = 1 / this.maxFPS;
		
		/* The actual frame rate of the animation in terms of frames per seconds. */
		this.actualFPS = 0;
		
		/* The starting time of the animation. */
		this.startTime = 0;
		
		/* The previous time which the animate functions were called. */
		this.previousAnimateTime = 0;
		
		/* The current time which the animate functions are called. */
		this.newAnimateTime = 0;
		
		/* The flag for determining whether the animations are paused. */
		this.isPaused = false;
		
		/* The flag for determining whether the animations are allowed to exceed the FPS range. */
		this.allowExceedFPSRange = false;
		
		/* The flag for determining whether the animations are to be time based,
		 * which means each render is based on the time difference from the previous render.
		 * If the animations are set not to be time-based, then the render function will always
		 * have the standard FPS time difference as the parameter value. */
		this.isTimeBased = true;

		/* The flag for determining whether the animations should be paused when the browser window is hidden. */
		this.pauseOnHidden = true;

		/* The flag for determining whether the animations should be resume when the browser window is shown. */
		this.resumeOnShown = true;
		
		/* The flag for determining whether the animations is currently requesting in order to avoid multiple requests. */
		this.requesting = false;

		/* The list of listeners this animator is appended to. Each animator event will trigger the corresponding method of each listeners. */
		this.listeners = [];

		/** Add a rendering function with the owner object which executes the function. Returns the rendering ID of this reference. 
			Returns a renderID for future reference. */
		this.addRenderFunction = function (renderingObject, renderingFunction) {
			
			/* Create a new render ID for this object. */
			var renderID = animator.generateRenderID();
			
			/* Create a new mapping reference of the rendering object and the rendering function. */
			animator.renderReferences[renderID] = { renderObject : renderingObject , renderFunction : renderingFunction };
			
			return renderID;
		};
		
		/** Remove the rendering reference by the given reference ID. */
		this.removeRenderFunction = function (renderID) {
			
			/* Check if the render ID does exist. */
			if (renderID !== undefined && animator.renderReferences[renderID] !== undefined) {
			
				/* If so, then remove the reference of this render ID. */
				delete animator.renderReferences[renderID];
			}
		};
		
		/** Clear all rendering functions from all the objects. */
		this.clearRenderFunctions = function () {
			animator.renderReferences = {};
		};
		
		/** Set a specific frame rate for the animation. */
		this.setFPS = function (newFPS) {
			
			animator.FPS = newFPS;
			
			if (!animator.allowExceedFPSRange) {
				/* Limit the FPS with the maximum FPS. */
				animator.FPS = (animator.FPS > animator.maxFPS) ? animator.maxFPS : (animator.FPS < animator.minFPS) ? animator.minFPS : animator.FPS;
			}
		};
		
		/** Start the animation loop. */
		this.start = function () {
			
			var timestamp = Date.now();
			
			/* Record the time-stamp of the starting animation. */
			animator.startTime = timestamp;
			
			/* Record the previous animation time-stamp as the starting animation. */
			animator.previousAnimateTime = timestamp;
			animator.newAnimateTime = timestamp;
			
			/* Start the animation loop. */
			animator.animate();
		};
		
		/** The iteration of the animation loop, each call depends on the animation frame of the browser. */
		this.animate = function () {

			/* Check if the animations are paused or the frame rate is equal or below 0. */
			if (!animator.requesting && !animator.isPaused && animator.FPS > 0) {
				
				/* Set a time delay to compromise the desired FPS.
				 * Since the requestAnimFrame callback method will cause a delay of roughly 4 milli seconds,
				 * delay is reduced by that amount of time. */
				var timeDelay = (1000 / animator.FPS) - 4;
				
				animator.requesting = true;

				setTimeout(function() {
					/* Request for the animation frame.
					/* (i.e.: this will set off another iterate of this function depending on the browser). */
					window.requestAnimFrame(function() { animator.requesting = false; animator.animate(); });
					
					/* Render the registered animation objects. */
					animator.render();
				}, timeDelay);
			}
		};
		
		/** Execute all the rendering functions. */
		this.render = function () {
		
			/* Update the two time-stamps with the new time-stamp of the animation. */
			animator.previousAnimateTime = animator.newAnimateTime;
			animator.newAnimateTime = Date.now();
			
			var timeDiff = 1 / animator.FPS;
			
			if (animator.isTimeBased) {
				
				/* Calculate the time difference between the previous time-stamp in terms of seconds. */
				timeDiff = (animator.newAnimateTime - animator.previousAnimateTime) / 1000;
				
				if (!animator.allowExceedFPSRange) {
					/* Check if the time difference is too big, which could be caused by poor performance or a pause.
					 * If so, then reset the time difference to prevent animation jump. */
					timeDiff = (timeDiff > animator.maxTimeDiff) ? animator.maxTimeDiff : (timeDiff < animator.minTimeDiff) ? animator.minTimeDiff : timeDiff;
				}
			}
			
			/* Execute all the registered rendering functions. */
			for (var renderID in animator.renderReferences) {
				
				var renderObject = animator.renderReferences[renderID].renderObject;
				var renderFunction = animator.renderReferences[renderID].renderFunction;
				
				renderFunction.call(renderObject, timeDiff);
			}
		};
		
		/** Perform action for pause event */
		this.onPause = function () {
			for (var i = 0; i < animator.listeners.length; i++) {
				animator.listeners[i].onAnimatorPause();
			}
		};

		/** Perform action for resume event */
		this.onResume = function () {
			for (var i = 0; i < animator.listeners.length; i++) {
				animator.listeners[i].onAnimatorResume();
			}
		};
		
		/** Pause the animation loop. */
		this.pause = function () {
			
			if (animator.isPaused === false) {
			
				animator.isPaused = true;
				
				animator.onPause();
			}
		};
		
		/** Resume the animation loop. */
		this.resume = function () {
			
			if (animator.isPaused === true) {
				
				animator.isPaused = false;
				
				animator.onResume();
				
				/* Record the previous animation time-stamp as the starting animation. */
				animator.previousAnimateTime = Date.now();
				animator.newAnimateTime = Date.now();
				
				/* Re-initiate the animation loop. */
				animator.animate();
			}
		};

		/** Add a animator listener to the animator. */
		this.addAnimatorListener = function (animatorListener) {

			/* Make sure the input object qualifies as an instance of AnimatorListener. */
			if (!animatorListener.onAnimatorPause || typeof animatorListener.onAnimatorPause !== "function") {
				animatorListener.onAnimatorPause = function() {};
			}

			if (!animatorListener.onAnimatorResume || typeof animatorListener.onAnimatorResume !== "function") {
				animatorListener.onAnimatorResume = function() {};
			}

			animator.listeners.push(animatorListener);
		};
		
		/** Remove a animator listener from the animator. */
		this.removeAnimatorListener = function (animatorListener) {

			/* Attempt to find the index of the given listener and then remove it. */
			for (var i = animator.listeners.length - 1; i >= 0; i--) {
				if (animator.listeners[i] === animatorListener) {
					animator.listeners.splice(i, 1);
				}
			}
		};

		/** Generate a new rendering ID for an unregistered rendering object. */
		this.generateRenderID = function () {
			
			var newID = "render_" + animator.renderIDCount;
			animator.renderIDCount++;
			
			return newID;
		};
		
		/** Perform action for window hidden event. */
		this.onWindowHidden = function () {
			if (animator.pauseOnHidden) {
				animator.pause();
			}
		};

		/** Perform action for window show event. */
		this.onWindowShow = function () {
			if (animator.resumeOnShown) {
				animator.resume();
			}
		};
		
		/** Perform action for window change event, either hidden or show */
		this.onWindowChange = function (isWindowHidden) {
			
			if (isWindowHidden === true) {
				animator.onWindowHidden();
			} else if (isWindowHidden === false) {
				animator.onWindowShow();
			}
		};
		
		/** Adapt visibility change on the window for pausing and resuming. */
		/* Chrome 13+. */
		document.addEventListener("visibilitychange", function(event) { animator.onWindowChange(document.hidden); });

		/* Firefox 10+. */
		document.addEventListener("mozvisibilitychange", function(event) { animator.onWindowChange(document.mozHidden); });

		/* Opera 12.10+. */
		document.addEventListener("webkitvisibilitychange", function(event) { animator.onWindowChange(document.webkitHidden); });

		/* Internet Explorer 10+. */
		document.addEventListener("msvisibilitychange", function(event) { animator.onWindowChange(document.msHidden); });

		/* Internet Explorer 9 and lower. */
		document.onfocusin = function(event) { animator.onWindowShow(); };
		document.onfocusout = function(event) { animator.onWindowHidden(); };

		/* Other. */
		window.onpageshow = window.onfocus = function(event) { animator.onWindowShow(); };
		window.onpagehide = window.onblur = function(event) { animator.onWindowHidden(); };
	};
});

/** GLOBAL INITIALISATION */

/** Set the request animation frame to the native event frame. */
window.requestAnimFrame = (function () {
	return	window.requestAnimationFrame		|| 
			window.webkitRequestAnimationFrame	|| 
			window.mozRequestAnimationFrame		|| 
			window.oRequestAnimationFrame		|| 
			window.msRequestAnimationFrame		|| 
			function(callback, element) { window.setTimeout(callback, 1000 / 60); };
})();

/** Set the cancel animation frame to the native event frame. */
window.cancelAnimFrame = (function () {
	return	window.cancelAnimationFrame					|| 
			window.webkitCancelAnimationFrame			|| 
			window.mozCancelAnimationFrame				|| 
			window.oCancelAnimationFrame				|| 
			window.msCancelAnimationFrame				|| 
			window.webkitCancelRequestAnimationFrame	|| 
			window.mozCancelRequestAnimationFrame		|| 
			window.oCancelRequestAnimationFrame			|| 
			window.msCancelRequestAnimationFrame		|| 
			function(id) { window.clearTimeout(id); };
})();
