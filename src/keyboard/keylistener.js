define(function () {

	return function () {
		var keyListener = this;

		this.downEvent = function (event) {};
		this.upEvent = function (event) {};

		/** Perform action for key press event. */
		this.onKeyDown = function (downEvent) {
			keyListener.downEvent = downEvent || keyListener.downEvent;
		};

		/** Perform action for key up event. */
		this.onKeyUp = function (upEvent) {
			keyListener.upEvent = upEvent || keyListener.upEvent;
		};
	};
});
