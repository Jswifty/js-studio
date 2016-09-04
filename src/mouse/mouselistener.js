define(function () {

	return function () {
		var mouseListener = this;

		this.overEvent = function (event) {};
		this.outEvent = function (event) {};
		this.downEvent = function (event) {};
		this.upEvent = function (event) {};
		this.moveEvent = function (event) {};
		this.stopEvent = function (event) {};
		this.clickEvent = function (event) {};

		/** Perform action for over event. */
		this.onMouseOver = function (overEvent) {
			mouseListener.overEvent = overEvent || mouseListener.overEvent;
		};

		/** Perform action for out event. */
		this.onMouseOut = function (outEvent) {
			mouseListener.outEvent = outEvent || mouseListener.outEvent;
		};

		/** Perform action for down event. */
		this.onMouseDown = function (downEvent) {
			mouseListener.downEvent = downEvent || mouseListener.downEvent;
		};

		/** Perform action for up event. */
		this.onMouseUp = function (upEvent) {
			mouseListener.upEvent = upEvent || mouseListener.upEvent;
		};

		/** Perform action for move event. */
		this.onMouseMove = function (moveEvent) {
			mouseListener.moveEvent = moveEvent || mouseListener.moveEvent;
		};

		/** Perform action for stop event. */
		this.onMouseStop = function (stopEvent) {
			mouseListener.stopEvent = stopEvent || mouseListener.stopEvent;
		};

		/** Perform action for click event. */
		this.onMouseClick = function (clickEvent) {
			mouseListener.clickEvent = clickEvent || mouseListener.clickEvent;
		};
	};
});
