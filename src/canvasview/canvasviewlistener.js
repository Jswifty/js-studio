/**  
 *	canvasviewlistener.js is an interface object class which handles events triggered from canvas view.
 *	Each instance is required to be added into an canvas view object.
 */
define(function (require) {

	return function (onCanvasViewPause, onCanvasViewResume) {

		/** Perform action for pause event */
		if (onCanvasViewPause && typeof onCanvasViewPause === "function") {
			this.onCanvasViewPause = onCanvasViewPause;
		} else {
			this.onCanvasViewPause = function() {};
		}

		/** Perform action for resume event */
		if (onCanvasViewResume && typeof onCanvasViewResume === "function") {
			this.onCanvasViewResume = onCanvasViewResume;
		} else {
			this.onCanvasViewResume = function() {};
		}
	};
});
