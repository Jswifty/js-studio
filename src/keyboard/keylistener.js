define(function () {

	return function () {

		var keyListener = this;

		/**** The following are all handler methods for overriding. ****/

		/** Perform action for key press event */
		this.onKeyDown = function (event) {
			// console.log("key down: ");
		};

		/** Perform action for key up event */
		this.onKeyUp = function (event) {
			// console.log("key up: ");
		};
	};
});
