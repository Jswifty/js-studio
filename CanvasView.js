/**  
 *	CanvasView.js is an object class which creates an instance of a HTML5 canvas
 *	under the given DIV container.
 *	It also initiates a mouse and an animator, which it can pass MouseListeners and renderFunctions into them.
 *
 *	Required: Mouse.js, Animator.js
 */ 

var CanvasView = function (divContainer) {

	/* Store the DIV container. */
	this.divContainer = divContainer;
	
	/* Create the canvas. */
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.innerHTML = "Your browser does not support HTML5 canvas.";
	
	/* Setup the Mouse. */
	this.mouse = new Mouse(this.divContainer);
	
	/* Setup the Animator. */
	this.animator = new Animator();
	
	/** Canvas width getter. */
	this.getCanvasWidth = function () {
		return this.canvas.width;
	};

	/** Canvas height getter. */
	this.getCanvasHeight = function () {
		return this.canvas.height;
	};
	
	/** Canvas context getter. */
	this.getCanvas2DContext = function () {
		return this.canvas.getContext("2d");
	};
	
	/** Perform action for window resize event. */
	this.onResize = function () {

		/* Set canvas dimensions. */
		this.canvas.width = this.divContainer.offsetWidth; 
		this.canvas.height = this.divContainer.offsetHeight;
	};
	
	/** Add a drawing method to the animator. */
	this.addRenderFunction = function (renderFunction) {
		return this.animator.addRenderFunction(this, renderFunction);
	};
	
	/** Remove a drawing method from the animator. */
	this.removeRenderFunction = function (renderID) {
		this.animator.removeRenderFunction(renderID);
	};
	
	/** Add a mouse listener to the mouse. */
	this.addMouseListener = function (mouseListener) {
		this.mouse.addMouseListener(mouseListener);
	};
	
	/** Remove a mouse listener from the mouse. */
	this.removeMouseListener = function (mouseListener) {
		this.mouse.removeMouseListener(mouseListener);
	};
	
	/** Call the animator to pause the animation. */
	this.pause = function () {
		this.animator.pause();
	};
	
	/** Call the animator to resume the animation. */
	this.resume = function () {
		this.animator.resume();
	};
	
	/** Perform action for animator pause event.
	 *	This will be called when calling pause() as well. */
	this.onViewPause = function () {
		console.log("Canvas view paused at: " + new Date().toString());
	};

	/** Perform action for animator pause event.
	 *	This will be called when calling resume() as well. */
	this.onViewResume = function () {
		console.log("Canvas view resume at: " + new Date().toString());
	};
	
	/**** INITIALISATION ****/
	var view = this;
	
	/* Append the canvas to the DIV container. */
	this.divContainer.appendChild(this.canvas);
	
	/* Fetch resize method of the DIV container and window. */
	this.divContainer.onresize = function () { view.onResize(); };
	window.onresize = function () { view.onResize(); };
	
	/* Create a Animator listener to adaptor events. */
	this.animatorListener = new AnimatorListener();
	this.animatorListener.onAnimatorPause = function () { view.onViewPause(); }
	this.animatorListener.onAnimatorResume = function () { view.onViewResume(); }
	
	/* Append the listener to the animator. */
	this.animator.addAnimatorListener(this.animatorListener);

	/* Start the animation. */
	this.animator.start();
	
	/* Update the canvas dimensions to fit the given container. */
	this.onResize();
};