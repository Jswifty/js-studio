/**
 *  Animator is an object class which registers rendering functions from objects and executes them 
 *  repeatedly in a rate depended on the native window browser's requestAnimationFrame method.
 */ 
var Animator = function() {
	
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
	
	/* The list of listeners this mouse is appended to. Each mouse event will trigger the corresponding method of each listeners. */
	this.listeners = [];
	
	/** Add a rendering function with the owner object which executes the function. Returns the rendering ID of this reference. 
		Returns a renderID for future reference. */
	this.addRenderFunction = function (renderingObject, renderingFunction) {
	
		/* Create a new render ID for this object. */
		var renderID = this.generateRenderID();
		
		/* Create a new mapping reference of the rendering object and the rendering function. */
		this.renderReferences[renderID] = { renderObject : renderingObject , renderFunction : renderingFunction };
		
		return renderID;
	};
	
	/** Remove the rendering reference by the given reference ID. */
	this.removeRenderFunction = function (renderID) {
	
		/* Check if the render ID does exist. */
		if (renderID !== undefined && this.renderReferences[renderID] !== undefined) {
		
			/* If so, then remove the reference of this render ID. */
			delete this.renderReferences[renderID];
		}
	};
	
	/** Clear all rendering functions from all the objects. */
	this.clearRenderFunctions = function () {
		this.renderReferences = {};
	};
	
	/** Set a specific frame rate for the animation. */
	this.setFPS = function (newFPS) {
		
		this.FPS = newFPS;
		
		if (!this.allowExceedFPSRange) {
			/* Limit the FPS with the maximum FPS. */
			this.FPS = (this.FPS > this.maxFPS) ? this.maxFPS : (this.FPS < this.minFPS) ? this.minFPS : this.FPS;
		}
	};
	
	/** Start the animation loop. */
	this.start = function () {
		
		var timestamp = Date.now();
		
		/* Record the time-stamp of the starting animation. */
		this.startTime = timestamp;
		
		/* Record the previous animation time-stamp as the starting animation. */
		this.previousAnimateTime = timestamp;
		this.newAnimateTime = timestamp;
		
		/* Start the animation loop. */
		this.animate();
	};
	
	/** The iteration of the animation loop, each call depends on the animation frame of the browser. */
	this.animate = function () {
		
		/* Check if the animations are paused or the frame rate is equal or below 0. */
		if (!this.isPaused && this.FPS > 0) {
			
			var animator = this;
			
			/* Set a time delay to compromise the desired FPS.
			 * Since the requestAnimFrame callback method will cause a delay of roughly 4 milli seconds,
			 * delay is reduced by that amount of time. */
			var timeDelay = (1000 / this.FPS) - 4;
			
			setTimeout(function() {
				/* Request for the animation frame.
				/* (i.e.: this will set off another iterate of this function depending on the browser). */
				window.requestAnimFrame(function() { animator.animate(); });
				
				/* Render the registered animation objects. */
				animator.render();
			}, timeDelay);
		}
	};
	
	/** Execute all the rendering functions. */
	this.render = function () {
	
		/* Update the two time-stamps with the new time-stamp of the animation. */
		this.previousAnimateTime = this.newAnimateTime;
		this.newAnimateTime = Date.now();
		
		var timeDiff = 1 / this.FPS;
		
		if (this.isTimeBased) {
			
			/* Calculate the time difference between the previous time-stamp in terms of seconds. */
			timeDiff = (this.newAnimateTime - this.previousAnimateTime) / 1000;
			
			if (!this.allowExceedFPSRange) {
				/* Check if the time difference is too big, which could be caused by poor performance or a pause.
				 * If so, then reset the time difference to prevent animation jump. */
				timeDiff = (timeDiff > this.maxTimeDiff) ? this.maxTimeDiff : (timeDiff < this.minTimeDiff) ? this.minTimeDiff : timeDiff;
			}
		}
		
		/* Execute all the registered rendering functions. */
		for (var renderID in this.renderReferences) {
		
			var renderObject = this.renderReferences[renderID].renderObject;
			var renderFunction = this.renderReferences[renderID].renderFunction;
			
			renderFunction.call(renderObject, timeDiff);
		}
	};
	
	/** Perform action for pause event */
	this.onPause = function () {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onAnimatorPause();
		}
	};

	/** Perform action for resume event */
	this.onResume = function () {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onAnimatorResume();
		}
	};
	
	/** Pause the animation loop. */
	this.pause = function () {
		
		if (this.isPaused === false) {
		
			this.isPaused = true;
			
			this.onPause();
		}
	};
	
	/** Resume the animation loop. */
	this.resume = function () {
		
		if (this.isPaused === true) {
		
			this.isPaused = false;
			
			this.onResume();
			
			/* Record the previous animation time-stamp as the starting animation. */
			this.previousAnimateTime = Date.now();
			this.newAnimateTime = Date.now();
			
			/* Re-initiate the animation loop. */
			this.animate();
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

		this.listeners.push(animatorListener);
	};
	
	/** Remove a animator listener from the animator. */
	this.removeAnimatorListener = function (animatorListener) {

		/* Attempt to find the index of the given listener and then remove it. */
		for (var i = this.listeners.length - 1; i >= 0; i--) {
			if (this.listeners[i] === animatorListener) {
				this.listeners.splice(i, 1);
			}
		}
	};

	/** Generate a new rendering ID for an unregistered rendering object. */
	this.generateRenderID = function () {
		
		var newID = "render_" + this.renderIDCount;
		this.renderIDCount++;
		
		return newID;
	};
	
	/** Perform action for window hidden event. */
	this.onWindowHidden = function () {
		this.pause();
	};

	/** Perform action for window show event. */
	this.onWindowShow = function () {
		this.resume();
	};
	
	/** Perform action for window change event, either hidden or show */
	this.onWindowChange = function (isWindowHidden) {
	
		if (isWindowHidden === true) {
			this.onWindowHidden();
		} else if (isWindowHidden === false) {
			this.onWindowShow();
		}
	};
	
	/**** INITIALISATION ****/
	var animator = this;
	
	/** Adapt visibility change on the window for pausing and resuming. */
	/* Chrome 13+. */
    if ("hidden" in document) {
        document.addEventListener("visibilitychange", function(event) { animator.onWindowChange(document.hidden); });
	}
	/* Firefox 10+. */
    else if ("mozHidden" in document) {
        document.addEventListener("mozvisibilitychange", function(event) { animator.onWindowChange(document.mozHidden); });
    }
    /* Opera 12.10+. */
	else if ("webkitHidden" in document) {
        document.addEventListener("webkitvisibilitychange", function(event) { animator.onWindowChange(document.webkitHidden); });
    }
    /* Internet Explorer 10+. */
	else if ("msHidden" in document) {
        document.addEventListener("msvisibilitychange", function(event) { animator.onWindowChange(document.msHidden); });
    }
    /* Internet Explorer 9 and lower. */
	else if ("onfocusin" in document && "onfocusout" in document) {
        document.onfocusin = function(event) { animator.onWindowShow(); };
		document.onfocusout = function(event) { animator.onWindowHidden(); };
	}
	/* Other. */
    else {
        window.onpageshow = window.onfocus = function(event) { animator.onWindowShow(); };
		window.onpagehide = window.onblur = function(event) { animator.onWindowHidden(); };
	}
};

/**  
 *	AnimatorListener.js is an interface object class which handles events triggered from Animator.
 *	Each instance is required to be added into an animator object.
 */ 
var AnimatorListener = function (onAnimatorPause, onAnimatorResume) {

	/** Perform action for pause event */
	if (onAnimatorPause && typeof onAnimatorPause === "function") {
		this.onAnimatorPause = onAnimatorPause;
	} else {
		this.onAnimatorPause = function() {};
	}

	/** Perform action for resume event */
	if (onAnimatorResume && typeof onAnimatorResume === "function") {
		this.onAnimatorResume = onAnimatorResume;
	} else {
		this.onAnimatorResume = function() {};
	}
};

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
