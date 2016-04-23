define(function () {
	
	return function (onAnimatorPause, onAnimatorResume) {
		
		/** Perform action for pause event. */
		if (onAnimatorPause && typeof onAnimatorPause === "function") {
			this.onAnimatorPause = onAnimatorPause;
		} else {
			this.onAnimatorPause = function () {};
		}
		
		/** Perform action for resume event. */
		if (onAnimatorResume && typeof onAnimatorResume === "function") {
			this.onAnimatorResume = onAnimatorResume;
		} else {
			this.onAnimatorResume = function () {};
		}
	};
});
