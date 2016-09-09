define(function () {

	return function (listener) {

		var taskScheduler = this;

		/* The current task that the task scheuduler is running. */
		taskScheduler.currentTask = null;

		/* The last task of the task linked list. */
		taskScheduler.lastTask = null;

		/* The status of the task scheduler. */
		taskScheduler.isRunning = false;
		taskScheduler.progress = -1;
		taskScheduler.tasksTotal = 0;

		/* Whether a cancel request has be sent to stop it from running. */
		taskScheduler.requestCancel = false;

		/* The list of listeners this task scheduler is appended to. Each task event will trigger the corresponding method of each listeners. */
		taskScheduler.taskStartEvents = [];
		taskScheduler.finishEvents = [];

		taskScheduler.addTask = function (task) {
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

			return taskScheduler;
		}

		taskScheduler.run = function () {
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
									callbackFunction.apply(taskScheduler, arguments);
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

		taskScheduler.runNextTask = function () {
			if (taskScheduler.currentTask !== null && taskScheduler.currentTask !== undefined) {
				taskScheduler.currentTask = taskScheduler.currentTask.next;
			}

			taskScheduler.run();
		};

		/* Update the current status of the progress and the current task. */
		taskScheduler.updateStatus = function () {
			if (taskScheduler.currentTask !== null && taskScheduler.currentTask !== undefined) {
				/* listener task event */
				for (var i = 0; i < taskScheduler.taskStartEvents.length; i++) {
					taskScheduler.taskStartEvents[i](taskScheduler.currentTask, taskScheduler.progress, taskScheduler.tasksTotal);
				}
			} else {
				taskScheduler.isRunning = false;
				taskScheduler.progress = -1;
				taskScheduler.currentTask = null;
				taskScheduler.lastTask = null;
				taskScheduler.tasksTotal = 0;

				/* listener complete event */
				for (var i = 0; i < taskScheduler.finishEvents.length; i++) {
					taskScheduler.finishEvents[i]();
				}
			}
		};

		taskScheduler.stop = function () {
			taskScheduler.requestCancel = true;
		};

		taskScheduler.cancel = function () {
			taskScheduler.currentTask = null;
			taskScheduler.updateStatus();
			taskScheduler.requestCancel = false;
		};

		taskScheduler.onTaskStart = function (taskStartEvent) {
			taskStartEvent = taskStartEvent || function () {};
			taskScheduler.taskStartEvents.push(taskStartEvent);
		};

		taskScheduler.onFinish = function (finishEvent) {
			finishEvent = finishEvent || function () {};
			taskScheduler.finishEvents.push(finishEvent);
		};
	};
});
