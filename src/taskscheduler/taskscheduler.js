define(function () {

	return function (listener) {

		var taskScheduler = this;

		/* The current task that the task scheuduler is running. */
		this.currentTask = null;

		/* The last task of the task linked list. */
		this.lastTask = null;

		/* The status of the task scheduler. */
		this.isRunning = false;
		this.progress = -1;
		this.tasksTotal = 0;

		/* Whether a cancel request has be sent to stop it from running. */
		this.requestCancel = false;

		/* The list of listeners this task scheduler is appended to. Each task event will trigger the corresponding method of each listeners. */
		this.listeners = [];

		this.addTask = function (task) {
			/* Create a new instance of the task. */
			var newTask = {
				caller: task.caller || window,
				method:  task.method || function () {},
				description: task.description || "",
				params: task.params || [],
				callbackIndex: (task.callbackIndex >= 0) ? task.callbackIndex : -1,
				delay: task.delay || 0
			};

			/* Put the task into the task linked list. */
			if (taskScheduler.lastTask === null) {
				taskScheduler.currentTask = newTask;
				taskScheduler.lastTask = newTask;
			} else {
				taskScheduler.lastTask.next = newTask;
				taskScheduler.lastTask = newTask;
			}

			/* Sum up the numebr of tasks. */
			taskScheduler.tasksTotal++;

			return this;
		}

		this.run = function () {
			taskScheduler.isRunning = true;
			taskScheduler.progress++;

			taskScheduler.updateStatus();

			if (taskScheduler.currentTask !== null && taskScheduler.currentTask !== undefined) {
				var task = taskScheduler.currentTask;

				setTimeout(function () {
					if (taskScheduler.requestCancel === true) {
						taskScheduler.cancel();
					} else {
						if (task.callbackIndex >= 0 && typeof task.params[task.callbackIndex] === "function") {
							var callbackFunction = task.params[task.callbackIndex];

							task.params[task.callbackIndex] = (function () {
								return function () {
									callbackFunction.apply(this, arguments);
									taskScheduler.runNextTask();
								};
							})();

							task.method.apply(task.caller, task.params);
						} else {
							task.method.apply(task.caller, task.params);
							taskScheduler.runNextTask();
						}
					}
				}, task.delay);
			}
		};

		this.runNextTask = function () {
			if (taskScheduler.currentTask !== null && taskScheduler.currentTask !== undefined) {
				taskScheduler.currentTask = taskScheduler.currentTask.next;
			}

			taskScheduler.run();
		};

		/* Update the current status of the progress and the current task. */
		this.updateStatus = function () {
			if (taskScheduler.currentTask !== null && taskScheduler.currentTask !== undefined) {
				/* listener task event */
				for (var i = 0; i < taskScheduler.listeners.length; i++) {
					taskScheduler.listeners[i].onTaskStart(taskScheduler.currentTask, taskScheduler.progress, taskScheduler.tasksTotal);
				}
			} else {
				taskScheduler.isRunning = false;
				taskScheduler.progress = -1;
				taskScheduler.currentTask = null;
				taskScheduler.lastTask = null;
				taskScheduler.tasksTotal = 0;

				/* listener complete event */
				for (var i = 0; i < taskScheduler.listeners.length; i++) {
					taskScheduler.listeners[i].finishCallback();
				}
			}
		};

		this.stop = function () {
			taskScheduler.requestCancel = true;
		};

		this.cancel = function () {
			taskScheduler.currentTask = null;
			taskScheduler.updateStatus();
			taskScheduler.requestCancel = false;
		};

		/** Add a task scheduler listener to the task scheduler. */
		this.addTaskSchedulerListener = function (taskSchedulerListener) {
			if (taskSchedulerListener !== undefined &&
				(typeof taskSchedulerListener.onTaskStart === "function" ||
				 typeof taskSchedulerListener.finishCallback === "function")) {

				/* Make sure the input object qualifies as an instance of TaskSchedulerListener. */
				if (typeof taskSchedulerListener.onTaskStart !== "function") {
					taskSchedulerListener.onTaskStart = function() {};
				}

				if (typeof taskSchedulerListener.finishCallback !== "function") {
					taskSchedulerListener.finishCallback = function() {};
				}

				taskScheduler.listeners.push(taskSchedulerListener);
			}
		};

		/** Remove a task scheduler listener from the task scheduler. */
		this.removeTaskSchedulerListener = function (taskSchedulerListener) {
			/* Attempt to find the index of the given listener and then remove it. */
			for (var i = taskScheduler.listeners.length - 1; i >= 0; i--) {
				if (taskScheduler.listeners[i] === taskSchedulerListener) {
					taskScheduler.listeners.splice(i, 1);
				}
			}
		};

		this.addTaskSchedulerListener(listener);
	};
});
