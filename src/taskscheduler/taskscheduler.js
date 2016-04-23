define(function () {

	return function () {
	
		var taskScheduler = this;

		/* The current task that the task scheuduler is running. */
		this.currentTask = null;

		/* The last task of the task linked list. */
		this.lastTask = null;
		
		/* The status of the task scheduler. */
		this.isRunning = false;
		this.progress = -1;
		this.tasksTotal = 0;

		/* The list of listeners this task scheduler is appended to. Each task event will trigger the corresponding method of each listeners. */
		this.listeners = [];

		this.addTask = function (object, method, description, params, callbackIndex) {

			/* Create a new instance of the task. */
			var newTask = {
				object: object,
				method: method,
				description: description,
				params: params,
				callbackIndex: callbackIndex
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
		};

		this.run = function () {

			/* Update the current status of the progress and the current task. */
			taskScheduler.updateStatus();

			var task = taskScheduler.currentTask;

			if (task) {

				if (task.callbackIndex >= 0 && typeof task.params[task.callbackIndex] === "function") {

					var callbackFunction = task.params[task.callbackIndex];

					task.params[task.callbackIndex] = (function () {

						return function () {
							
							callbackFunction.apply(this, arguments);
							
							taskScheduler.currentTask = task.next;
							taskScheduler.run();
						};
					})();

					task.method.apply(task.object, task.params);
				}

				else {

					task.method.apply(task.object, task.params);

					taskScheduler.currentTask = task.next;
					taskScheduler.run();
				}
			}
		};

		this.updateStatus = function () {
			
			/* TODO increment progress */
			taskScheduler.progress++;

			if (taskScheduler.currentTask) {
				
				taskScheduler.isRunning = true;

				/* listener task event */
				/* 
				 - progress / tasksTotal
				 - current task description
				*/
				for (var i = 0; i < taskScheduler.listeners.length; i++) {
					taskScheduler.listeners[i].onTaskStart(taskScheduler.currentTask, taskScheduler.progress, taskScheduler.tasksTotal);
				}
			} else {
				
				taskScheduler.isRunning = false;
				taskScheduler.progress = -1;

				/* listener complete event */
				for (var i = 0; i < taskScheduler.listeners.length; i++) {
					taskScheduler.listeners[i].finishCallback();
				}
			}
		};

		/** Add a task scheduler listener to the task scheduler. */
		this.addTaskShedulerListener = function (taskSchedulerListener) {

			/* Make sure the input object qualifies as an instance of TaskSchedulerListener. */
			if (!taskSchedulerListener.onTaskStart || typeof taskSchedulerListener.onTaskStart !== "function") {
				taskSchedulerListener.onTaskStart = function() {};
			}

			if (!taskSchedulerListener.finishCallback || typeof taskSchedulerListener.finishCallback !== "function") {
				taskSchedulerListener.finishCallback = function() {};
			}

			taskScheduler.listeners.push(taskSchedulerListener);
		};
		
		/** Remove a task scheduler listener from the task scheduler. */
		this.removeTaskShedulerListener = function (taskSchedulerListener) {

			/* Attempt to find the index of the given listener and then remove it. */
			for (var i = taskScheduler.listeners.length - 1; i >= 0; i--) {
				if (taskScheduler.listeners[i] === taskSchedulerListener) {
					taskScheduler.listeners.splice(i, 1);
				}
			}
		};
	};
});
