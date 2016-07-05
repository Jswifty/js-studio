define(function () {

	return function (onTaskStart, finishCallback) {
		/** Perform action when a new task has started running. */
		if (onTaskStart !== undefined && typeof onTaskStart === "function") {
			this.onTaskStart = onTaskStart;
		} else {
			this.onTaskStart = function () {};
		}

		/** Perform callback when all tasks are done. */
		if (finishCallback !== undefined && typeof finishCallback === "function") {
			this.finishCallback = finishCallback;
		} else {
			this.finishCallback = function () {};
		}
	};
});
