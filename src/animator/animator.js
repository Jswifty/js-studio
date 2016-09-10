define(function () {

	/** GLOBAL INITIALISATION */

	/** Set the request animation frame to the native event frame. */
	window.requestAnimFrame = (function () {
		return	window.requestAnimationFrame		||
				window.webkitRequestAnimationFrame	||
				window.mozRequestAnimationFrame			||
				window.oRequestAnimationFrame				||
				window.msRequestAnimationFrame			||
				function (callback, element) { window.setTimeout(callback, 1000 / 60); };
	})();

	/** Set the cancel animation frame to the native event frame. */
	window.cancelAnimFrame = (function () {
		return	window.cancelAnimationFrame						||
				window.webkitCancelAnimationFrame					||
				window.mozCancelAnimationFrame						||
				window.oCancelAnimationFrame							||
				window.msCancelAnimationFrame							||
				window.webkitCancelRequestAnimationFrame	||
				window.mozCancelRequestAnimationFrame			||
				window.oCancelRequestAnimationFrame				||
				window.msCancelRequestAnimationFrame			||
				function (id) { window.clearTimeout(id); };
	})();

	return function () {

		var animator = this;

		/* The rendering references is an map object consists of list of literal keys (renderIDs) mapped
		 * to an object and a corresponding rendering function. */
		animator.renderReferences = {};

		/* The number of render IDs being generated and registered. */
		animator.renderIDCount = 0;

		/* The required frame rate of the animation in terms of frames per seconds, by default is 60 FPS. */
		animator.FPS = 60;

		/* The minimum frame rate available for animation, by default is 10 FPS. */
		animator.minFPS = 10;

		/* The maximum frame rate available for animation, by default is 60 FPS. */
		animator.maxFPS = 60;

		/* The maximum time difference allowed for animation, which is 0.1 second. */
		animator.maxTimeDiff = 1 / animator.minFPS;

		/* The minimum time difference allowed for animation, which is roughly 0.017 second. */
		animator.minTimeDiff = 1 / animator.maxFPS;

		/* The actual frame rate of the animation in terms of frames per seconds. */
		animator.actualFPS = 0;

		/* The starting time of the animation. */
		animator.startTime = 0;

		/* The previous time which the animate functions were called. */
		animator.previousAnimateTime = 0;

		/* The current time which the animate functions are called. */
		animator.newAnimateTime = 0;

		/* The flag for determining whether the animator is paused. */
		animator.isPaused = false;

		/* The flag for determining whether the animator is commanded to pause externally. */
		animator.isPauseRequested = false;

		/* The flag for determining whether the animations are allowed to exceed the FPS range. */
		animator.allowExceedFPSRange = false;

		/* The flag for determining whether the animations are to be time based,
		 * which means each render is based on the time difference from the previous render.
		 * If the animations are set not to be time-based, then the render function will always
		 * have the standard FPS time difference as the parameter value. */
		animator.isTimeBased = true;

		/* The flag for determining whether the animations should be paused when the browser window loses focus. */
		animator.pauseOnHidden = false;

		/* The flag for determining whether the animations should be resume when the browser window gains focus. */
		animator.resumeOnShown = false;

		/* The flag for determining whether the animations is currently requesting in order to avoid multiple requests. */
		animator.requesting = false;

		/* The list of animator events. Each animator event will trigger the corresponding method of each listeners. */
		animator.pauseEvents = [];
		animator.resumeEvents = [];

		animator.onPause = function (pauseEvent) {
			pauseEvent = pauseEvent || function () {};
			animator.pauseEvents.push(pauseEvent);
		};

		animator.onResume = function (resumeEvent) {
			resumeEvent = resumeEvent || function () {};
			animator.resumeEvents.push(resumeEvent);
		};

		/** Add a rendering function with the owner object which executes the function. Returns the rendering ID of this reference.
			Returns a renderID for future reference. */
		animator.addRenderFunction = function (renderingObject, renderingFunction) {
			/* Create a new render ID for this object. */
			var renderID = animator.generateRenderID();

			/* Create a new mapping reference of the rendering object and the rendering function. */
			animator.renderReferences[renderID] = { renderObject : renderingObject , renderFunction : renderingFunction };

			return renderID;
		};

		/** Remove the rendering reference by the given reference ID. */
		animator.removeRenderFunction = function (renderID) {
			/* Check if the render ID does exist. */
			if (renderID !== undefined && animator.renderReferences[renderID] !== undefined) {

				/* If so, then remove the reference of this render ID. */
				delete animator.renderReferences[renderID];
			}
		};

		/** Clear all rendering functions from all the objects. */
		animator.clearRenderFunctions = function () {
			animator.renderReferences = {};
		};

		/** Set a specific frame rate for the animation. */
		animator.setFPS = function (newFPS) {
			animator.FPS = newFPS;

			if (!animator.allowExceedFPSRange) {
				/* Limit the FPS with the maximum FPS. */
				animator.FPS = (animator.FPS > animator.maxFPS) ? animator.maxFPS : (animator.FPS < animator.minFPS) ? animator.minFPS : animator.FPS;
			}
		};

		/** Start the animation loop. */
		animator.start = function () {
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
		animator.animate = function () {
			/* Check if the animations are paused or the frame rate is equal or below 0. */
			if (animator.requesting === false && animator.isPaused === false && animator.FPS > 0) {
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
		animator.render = function () {
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

		/** Pause the animation loop. */
		animator.pause = function (quietMode) {
			if (quietMode !== true) {
				animator.isPauseRequested = true;
			}

			if (animator.isPaused === false) {
				animator.isPaused = true;
				animator.firePauseEvent();
			}
		};

		/** Resume the animation loop. */
		animator.resume = function (quietMode) {
			if (quietMode !== true) {
				animator.isPauseRequested = false;
			}

			if (animator.isPauseRequested === false && animator.isPaused === true) {
				animator.isPaused = false;
				animator.fireResumeEvent();

				/* Record the previous animation time-stamp as the starting animation. */
				animator.previousAnimateTime = Date.now();
				animator.newAnimateTime = Date.now();

				/* Re-initiate the animation loop. */
				animator.animate();
			}
		};

		/** Perform action for pause event */
		animator.firePauseEvent = function () {
			for (var i = 0; i < animator.pauseEvents.length; i++) {
				animator.pauseEvents[i]();
			}
		};

		/** Perform action for resume event */
		animator.fireResumeEvent = function () {
			for (var i = 0; i < animator.resumeEvents.length; i++) {
				animator.resumeEvents[i]();
			}
		};

		/** Generate a new rendering ID for an unregistered rendering object. */
		animator.generateRenderID = function () {
			var newID = "render_" + animator.renderIDCount;
			animator.renderIDCount++;

			return newID;
		};

		/** Perform action for window hidden event. */
		animator.onWindowHidden = function () {
			animator.isFoused = false;

			if (animator.pauseOnHidden) {
				animator.pause(true);
			}
		};

		/** Perform action for window show event. */
		animator.onWindowShow = function () {
			animator.isFoused = true;

			if (animator.resumeOnShown) {
				animator.resume(true);
			}
		};

		/** Perform action for window change event, either hidden or show */
		animator.onWindowChange = function (isWindowHidden) {
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
