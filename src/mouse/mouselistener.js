define(function (require) {
	
	return function () {
	
		var mouseListener = this;

		/* Mouse Buttons */
		this.LEFT_BUTTON = 1;
		this.MIDDLE_BUTTON = 2;
		this.RIGHT_BUTTON = 3;
		
		/**** The following are all handler methods for overriding. ****/

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
			// console.log("mouse move));
		};
		
		/** Perform action for stop event */
		this.onMouseStop = function (event) {
			// console.log("mouse stop");
		};

		/** Perform action for click event */
		this.onMouseClick = function (event) {
			switch (event.which) {
				case mouseListener.LEFT_BUTTON:
					// console.log(" left click on " + event.mouse.position.x + ", " + event.mouse.position.y);
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
