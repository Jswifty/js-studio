/**
 *	mouselistener.js is an object class which handles events triggered from Mouse.
 *	Each instance is required to be added into a mouse object.
 */
define(function (require) {
	
	return function() {
	
		var mouseListener = this;

		/* Mouse Buttons */
		this.LEFT_BUTTON = 1;
		this.MIDDLE_BUTTON = 2;
		this.RIGHT_BUTTON = 3;
		
		/**** The following are all methods for overriding handlers. ****/
		
		this.mouseOver = function (onMouseOver) {
			if (onMouseOver && typeof onMouseOver === "function") {
				mouseListener.onMouseOver = onMouseOver;
			}
		};
		
		this.mouseOut = function (onMouseOut) {
			if (onMouseOut && typeof onMouseOut === "function") {
				mouseListener.onMouseOut = onMouseOut;
			}
		};
		
		this.mouseDown = function (onMouseDown) {
			if (onMouseDown && typeof onMouseDown === "function") {
				mouseListener.onMouseDown = onMouseDown;
			}
		};

		this.mouseUp = function (onMouseUp) {
			if (onMouseUp && typeof onMouseUp === "function") {
				mouseListener.onMouseUp = onMouseUp;
			}
		};

		this.mouseMove = function (onMouseMove) {
			if (onMouseMove && typeof onMouseMove === "function") {
				mouseListener.onMouseMove = onMouseMove;
			}
		};
		
		this.mouseStop = function (onMouseStop) {
			if (onMouseStop && typeof onMouseStop === "function") {
				mouseListener.onMouseStop = onMouseStop;
			}
		};

		this.mouseClick = function (onMouseClick) {
			if (onMouseClick && typeof onMouseClick === "function") {
				mouseListener.onMouseClick = onMouseClick;
			}
		};

		/**** Handler methods ****/

		/** Perform action for over event */
		this.onMouseOver = function (event) {
			// console.log("mouse in");
		};
		
		/** Perform action for out event */
		this.onMouseOut = function (event) {
			// console.log("mouse out");
		};
		
		/** Perform action for down event */
		this.onMouseDown = function (event) {
			switch (event.which) {
				case mouseListener.LEFT_BUTTON:
					// console.log("mouse left button down ");
					break;
				case mouseListener.MIDDLE_BUTTON:
					// console.log("mouse middle button down ");
					break;
				case mouseListener.RIGHT_BUTTON:
					// console.log("mouse right button down ");
					break;
				default:
					break;
			}
		};

		/** Perform action for up event */
		this.onMouseUp = function (event) {
			switch (event.which) {
				case mouseListener.LEFT_BUTTON:
					// console.log("mouse left button up ");
					break;
				case mouseListener.MIDDLE_BUTTON:
					// console.log("mouse middle button up ");
					break;
				case mouseListener.RIGHT_BUTTON:
					// console.log("mouse right button up ");
					break;
				default:
					break;
			}
		};

		/** Perform action for move event */
		this.onMouseMove = function (event) {
			// console.log("mouse move" + (event.mouseMovingFast ? " fast" : ""));
		};
		
		/** Perform action for stop event */
		this.onMouseStop = function (event) {
			// console.log("mouse stop");
		};

		/** Perform action for click event */
		this.onMouseClick = function (event) {
			switch (event.which) {
				case mouseListener.LEFT_BUTTON:
					// console.log(" left click on " + this.position.x + ", " + this.position.y);
					break;
				case mouseListener.MIDDLE_BUTTON:
					// console.log(" middle click ");
					break;
				case mouseListener.RIGHT_BUTTON:
					// console.log(" right click ");
					break;
				default:
					break;
			}
		};
	};
});
