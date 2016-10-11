define([
	"../animator/animator",
	"../domelement/domelement"
], function (Animator, DOMElement) {

	return function (container, animator) {
    /* Create the canvas. */
		var canvasView = new DOMElement("canvas", { html: "Your browser does not support HTML5 canvas.", style: "position: absolute;" });
    canvasView.setLeftButtonDragOnly(false);

		/* Store the DIV container. */
		canvasView.container = container;

		/* Create an Animator instance. */
		canvasView.animator = animator || new Animator();

		/* The list of canvas view events. Each canvas view event will trigger the corresponding method of each listeners. */
		canvasView.resizeEvents = [];
		canvasView.pauseEvents = [];
		canvasView.resumeEvents = [];

		canvasView.onResize = function (resizeEvent) {
			resizeEvent = resizeEvent || function () {};
			canvasView.resizeEvents.push(resizeEvent);
			setTimeout(function () { canvasView.fireResizeEvent(); });
		};

		canvasView.onPause = function (pauseEvent) {
			pauseEvent = pauseEvent || function () {};
			canvasView.pauseEvents.push(pauseEvent);
		};

		canvasView.onResume = function (resumeEvent) {
			resumeEvent = resumeEvent || function () {};
			canvasView.resumeEvent.push(resumeEvent);
		};

		/** Start the canvas view animation from the animator. */
		canvasView.start = function () {
			canvasView.animator.start();
		};

		/** Call the animator to pause the animation. */
		canvasView.pause = function () {
			canvasView.animator.pause();
		};

		/** Call the animator to resume the animation. */
		canvasView.resume = function () {
			canvasView.animator.resume();
		};

		/** Perform action for window resize event
		 *	This will be called when canvas is being resized. */
		canvasView.fireResizeEvent = function () {

			/* Set canvas dimensions. */
			canvasView.width = canvasView.container.offsetWidth;
			canvasView.height = canvasView.container.offsetHeight;

			for (var i = 0; i < canvasView.resizeEvents.length; i++) {
				canvasView.resizeEvents[i](canvasView.width, canvasView.height);
			}
		};

		/** Perform action for animator pause event.
		 *	This will be called when calling pause() as well. */
		canvasView.firePauseEvent = function () {
			for (var i = 0; i < canvasView.pauseEvents.length; i++) {
				canvasView.pauseEvents[i]();
			}
		};

		/** Perform action for animator pause event.
		 *	This will be called when calling resume() as well. */
		canvasView.fireResumeEvent = function () {
			for (var i = 0; i < canvasView.resumeEvents.length; i++) {
				canvasView.resumeEvents[i]();
			}
		};

		/** Set a rendering method on the canvas, the method will have the canvas' context, width and height. */
		canvasView.setRender = function (renderEvent) {
			renderEvent = renderEvent || function () {};

			if (canvasView.renderID !== undefined) {
				canvasView.animator.removeRenderFunction(canvasView.renderID);
			}

			canvasView.renderID = canvasView.animator.addRenderFunction(canvasView, function () {
				renderEvent(canvasView.getContext("2d"), canvasView.width, canvasView.height);
			});
		};

		/* Append the canvas to the DIV container. */
		if (canvasView.container !== undefined) {
			canvasView.container.appendChild(canvasView);

			/* Fetch resize method of the DIV container and window. */
			canvasView.container.addEventListener("resize", canvasView.fireResizeEvent, false);
		}

		window.addEventListener("resize", canvasView.fireResizeEvent, false);
		canvasView.animator.onPause(canvasView.firePauseEvent);
		canvasView.animator.onResume(canvasView.fireResumeEvent);

		/* Update the canvas dimensions to fit the given container. */
		canvasView.fireResizeEvent();

    return canvasView;
	};
});
