define(function () {

	/* Mouse Buttons */
	var LEFT_BUTTON = 1;
	var MIDDLE_BUTTON = 2;
	var RIGHT_BUTTON = 3;

	var documentMouseListeners = [];

	document.addEventListener("mousemove", function (event) {
		for (var i = 0; i < documentMouseListeners.length; i++) {
			var mouseListener = documentMouseListeners[i];

			if (event.target !== mouseListener.mouse.listenElement) {
				mouseListener.moveEvent.call(mouseListener.mouse, event);
			}
		}
	});

	document.addEventListener("mouseup", function (event) {
		for (var i = 0; i < documentMouseListeners.length; i++) {
			var mouseListener = documentMouseListeners[i];

			if (event.target !== mouseListener.mouse.listenElement) {
				mouseListener.upEvent.call(mouseListener.mouse, event);
			}
		}
	});

	function getOffsetPosition (domElement) {
		var elementRect = domElement.getBoundingClientRect();
		elementRect.x = elementRect.x || elementRect.left;
		elementRect.y = elementRect.y || elementRect.top;

		return { x: elementRect.x || elementRect.left, y: elementRect.y || elementRect.top };
	};

	return function (container) {
		var mouse = this;

		/* Time delay determined to be a mouse click, by default is 0.15 second. */
		mouse.CLICK_DELAY = 150;

		/* The DOM element that this mouse is listening to. */
		mouse.listenElement = null;

		/* The thread for calling the mouse stop event function. */
		mouse.stoppingThread = null;

		/* Previous update time-stamp of all mouse actions. */
		mouse.lastUpdateTime = 0;

		/* Whether the a mouse key is pressed down. */
		mouse.isMouseDown = false;

		/* Previous update time-stamp of a mouse down action. */
		mouse.lastMouseDownTime = 0;

		/* Whether the mouse is currently contacted by touch surface. */
		mouse.isTouching = false;

		/* Previous mouse position. */
		mouse.previousPosition = null;

		/* Current mouse position. */
		mouse.position = null;

		/* Current mouse direction. */
		mouse.direction = 0;

		/* Current mouse moved distance. */
		mouse.movedDistance = 0;

		/* Current mouse moving speed. */
		mouse.movingSpeed = 0;

		/* Whether the mouse skips the default behaviours upon the listen element. */
		mouse.preventDefault = false;

		/* The list of listeners this mouse is appended to. Each mouse event will trigger the corresponding method of each listeners. */
		mouse.downEvents = [];
		mouse.upEvents = [];
		mouse.moveEvents = [];
		mouse.dragEvents = [];
		mouse.stopEvents = [];
		mouse.outEvents = [];
		mouse.overEvents = [];
		mouse.clickEvents = [];

		mouse.onMouseDown = function (downEvent) {
			downEvent = downEvent || function () {};
			mouse.downEvents.push(downEvent);
		};

		mouse.onMouseUp = function (upEvent) {
			upEvent = upEvent || function () {};
			mouse.upEvents.push(upEvent);
		};

		mouse.onMouseMove = function (moveEvent) {
			moveEvent = moveEvent || function () {};
			mouse.moveEvents.push(moveEvent);
		};

		mouse.onMouseDrag = function (dragEvent) {
			dragEvent = dragEvent || function () {};
			mouse.dragEvents.push(dragEvent);
		};

		mouse.onMouseStop = function (stopEvent) {
			stopEvent = stopEvent || function () {};
			mouse.stopEvents.push(stopEvent);
		};

		mouse.onMouseOut = function (outEvent) {
			outEvent = outEvent || function () {};
			mouse.outEvents.push(outEvent);
		};

		mouse.onMouseOver = function (overEvent) {
			overEvent = overEvent || function () {};
			mouse.overEvents.push(overEvent);
		};

		mouse.onMouseClick = function (clickEvent) {
			clickEvent = clickEvent || function () {};
			mouse.clickEvents.push(clickEvent);
		};

		/** Calculate the distance from the origin position to the destination position. */
		mouse.getDistance = function (position1, position2) {
			var distance = { x: position2.x - position1.x, y: position2.y - position1.y };
			return Math.sqrt(distance.x * distance.x + distance.y * distance.y);
		};

		/** Calculate the angle using trigonometry. Returns angle ranged from -180 to 180 degrees in radian. */
		mouse.getAngle = function (x, y, z) {
			return x > 0 ? Math.asin(y / z) : (y > 0 ? Math.PI - Math.asin(y / z) : -Math.asin(y / z) - Math.PI);
		};

		/** Calculate the directional angle to the destination position in terms of the angle oriented from the East. */
		mouse.getDirection = function (position1, position2) {
			var distance = { x: position2.x - position1.x, y: position2.y - position1.y };
			var distanceMag = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
			return mouse.getAngle(distance.x, distance.y, distanceMag);
		};

		/** Update the Position of the mouse. */
		mouse.updatePosition = function (newPosition) {
			/* Get the current time. */
			var currentTime = Date.now();

			/* Calculate the moved distance. */
			mouse.movedDistance = mouse.position != null && newPosition != null ? mouse.getDistance(mouse.position, newPosition) : 0;

			/* Calculate the moving speed from time difference and distance. */
			var timeDiff = (currentTime - mouse.lastUpdateTime) / 1000;
			mouse.movingSpeed = timeDiff > 0 ? mouse.movedDistance / timeDiff : 0;

			/* Update the mouse direction with the new position. */
			mouse.direction = mouse.position != null && newPosition != null ? mouse.getDirection(mouse.position, newPosition) : 0;

			/* Update the mouse position. */
			mouse.previousPosition = mouse.position != null ? { x : mouse.position.x, y : mouse.position.y } : null;
			mouse.position = newPosition !== null ? { x : newPosition.x, y : newPosition.y } : null;

			/* Update the time-stamp. */
			mouse.lastUpdateTime = currentTime;
		};

		/** Perform action for over event */
		mouse.fireOverEvent = function (event) {
			for (var i = 0; i < mouse.overEvents.length; i++) {
				mouse.overEvents[i](event);
			}
		};

		/** Perform action for out event */
		mouse.fireOutEvent = function (event) {
			for (var i = 0; i < mouse.outEvents.length; i++) {
				mouse.outEvents[i](event);
			}
		};

		/** Perform action for down event */
		mouse.fireDownEvent = function (event) {
			for (var i = 0; i < mouse.downEvents.length; i++) {
				mouse.downEvents[i](event);
			}
		};

		/** Perform action for up event */
		mouse.fireUpEvent = function (event) {
			for (var i = 0; i < mouse.upEvents.length; i++) {
				mouse.upEvents[i](event);
			}
		};

		/** Perform action for move event */
		mouse.fireMoveEvent = function (event) {
			for (var i = 0; i < mouse.moveEvents.length; i++) {
				mouse.moveEvents[i](event);
			}
		};

		/** Perform action for drag event */
		mouse.fireDragEvent = function (event) {
			for (var i = 0; i < mouse.dragEvents.length; i++) {
				mouse.dragEvents[i](event);
			}
		};

		/** Perform action for stop event */
		mouse.fireStopEvent = function (event) {
			for (var i = 0; i < mouse.stopEvents.length; i++) {
				mouse.stopEvents[i](event);
			}
		};

		/** Perform action for click event */
		mouse.fireClickEvent = function (event) {
			for (var i = 0; i < mouse.clickEvents.length; i++) {
				mouse.clickEvents[i](event);
			}
		};

		/** When the mouse comes into the parent container. */
		mouse.overEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Skip the default behaviours upon this event. */
				if (mouse.preventDefault) {
					event.preventDefault();
				}

				/* Update the mouse position with a null position to refresh the statistics. */
				mouse.updatePosition(null);

				/* Perform action for over event */
				mouse.fireOverEvent(event);
			}
		};

		/** When the mouse moves out from the parent container. */
		mouse.outEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Skip the default behaviours upon this event. */
				if (mouse.preventDefault) {
					event.preventDefault();
				}

				/* Update the mouse position with a null position to clear the statistics. */
				mouse.updatePosition(null);

				/* Perform action for out event */
				mouse.fireOutEvent(event);
			}
		};

		/** When the mouse is pressed. */
		mouse.downEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Populate flags indicating which buton is pressed. */
				mouse.isLeftButton = event.which === LEFT_BUTTON;
				mouse.isMiddleButton = event.which === MIDDLE_BUTTON;
				mouse.isRightButton = event.which === RIGHT_BUTTON;

				/* Skip the default behaviours upon this event. */
				if (mouse.preventDefault) {
					event.preventDefault();
				}

				/* Update the mouse relative position. */
				var offsetPosition = getOffsetPosition(mouse.listenElement);
				mouse.updatePosition({ x: event.clientX - offsetPosition.x, y: event.clientY - offsetPosition.y });

				/* Update the mouse down flag and time-stamp. */
				mouse.isMouseDown = true;
				mouse.lastMouseDownTime = mouse.lastUpdateTime;

				/* Perform action for down event. */
				mouse.fireDownEvent(event);

				mouse.addDocumentMouseListener();
			}
		};

		/** When the mouse's button is released. */
		mouse.upEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Populate flags indicating which buton is pressed. */
				mouse.isLeftButton = event.which === LEFT_BUTTON;
				mouse.isMiddleButton = event.which === MIDDLE_BUTTON;
				mouse.isRightButton = event.which === RIGHT_BUTTON;

				/* Skip the default behaviours upon this event. */
				if (mouse.preventDefault) {
					event.preventDefault();
				}

				/* Update the mouse relative position. */
				var offsetPosition = getOffsetPosition(mouse.listenElement);
				mouse.updatePosition({ x: event.clientX - offsetPosition.x, y: event.clientY - offsetPosition.y });

				/* Update the mouse down flag. */
				mouse.isMouseDown = false;

				if (mouse.lastUpdateTime - mouse.lastMouseDownTime <= mouse.CLICK_DELAY) {
					mouse.clickEventMethod(event);
				}

				/* Perform action for up event. */
				mouse.fireUpEvent(event);

				mouse.removeDocumentMouseListener();
			}
		};

		/** When the mouse is moving. */
		mouse.moveEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Skip the default behaviours upon this event. */
				if (mouse.preventDefault) {
					event.preventDefault();
				}

				/* Update the mouse relative position. */
				var offsetPosition = getOffsetPosition(mouse.listenElement);
				mouse.updatePosition({ x: event.clientX - offsetPosition.x, y: event.clientY - offsetPosition.y });

				/* Re-initiate the stopping thread, calling the mouse stop in 0.05s. */
				clearTimeout(mouse.stoppingThread);
				mouse.stoppingThread = setTimeout(function() { mouse.stopEventMethod(event); }, 50);

				/* Perform action for move event. */
				mouse.fireMoveEvent(event);

				if (mouse.isMouseDown === true) {
					/* Perform action for drag event. */
					mouse.fireDragEvent(event);
				}
			}
		};

		/** When the mouse has stop moving in the container. */
		mouse.stopEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Update the mouse relative position. */
				var offsetPosition = getOffsetPosition(mouse.listenElement);
				mouse.updatePosition({ x: event.clientX - offsetPosition.x, y: event.clientY - offsetPosition.y });

				/* Perform action for stop event. */
				mouse.fireStopEvent(event);
			}
		};

		/** When the mouse clicks. */
		mouse.clickEventMethod = function (event) {
			if (mouse.isTouching === false) {
				/* Put mouse as a reference in the event. */
				event.mouse = mouse;

				/* Populate flags indicating which buton is pressed. */
				mouse.isLeftButton = event.which === LEFT_BUTTON;
				mouse.isMiddleButton = event.which === MIDDLE_BUTTON;
				mouse.isRightButton = event.which === RIGHT_BUTTON;

				/* Update the mouse relative position. */
				var offsetPosition = getOffsetPosition(mouse.listenElement);
				mouse.updatePosition({ x: event.clientX - offsetPosition.x, y: event.clientY - offsetPosition.y });

				/* Perform action for stop event. */
				mouse.fireClickEvent(event);
			}
		};

		/** When a contact is made on the touch surface. */
		mouse.touchStartMethod = function (event) {
			mouse.isTouching = true;

			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse relative position. */
			var offsetPosition = getOffsetPosition(mouse.listenElement);
			mouse.updatePosition({ x: event.changedTouches[0].clientX - offsetPosition.x, y: event.changedTouches[0].clientY - offsetPosition.y });

			/* Update the mouse down flag and time-stamp. */
			mouse.isMouseDown = true;
			mouse.lastMouseDownTime = mouse.lastUpdateTime;

			/* Perform action for down event. */
			mouse.fireDownEvent(event);
		};

		/** When a contact is remove on the touch surface. */
		mouse.touchEndMethod = function (event) {
			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse relative position. */
			var offsetPosition = getOffsetPosition(mouse.listenElement);
			mouse.updatePosition({ x: event.changedTouches[0].clientX - offsetPosition.x, y: event.changedTouches[0].clientY - offsetPosition.y });

			/* Update the mouse down flag. */
			mouse.isMouseDown = false;

			if (mouse.lastUpdateTime - mouse.lastMouseDownTime <= mouse.CLICK_DELAY) {
				mouse.clickEventMethod(event);
			}

			/* Perform action for up event. */
			mouse.fireUpEvent(event);

			setTimeout(function () { mouse.isTouching = false; }, 0);
		};

		/** When a touch point moves across the touch surface. */
		mouse.touchMoveMethod = function (event) {
			mouse.isTouching = true;

			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse relative position. */
			var offsetPosition = getOffsetPosition(mouse.listenElement);
			mouse.updatePosition({ x: event.changedTouches[0].clientX - offsetPosition.x, y: event.changedTouches[0].clientY - offsetPosition.y });

			/* Re-initiate the stopping thread, calling the mouse stop in 0.05s. */
			clearTimeout(mouse.stoppingThread);
			mouse.stoppingThread = setTimeout(function() { mouse.stopEventMethod(event); }, 50);

			/* Perform action for move event. */
			mouse.fireMoveEvent(event);

			if (mouse.isMouseDown === true) {
				/* Perform action for drag event. */
				mouse.fireDragEvent(event);
			}
		};

		/** When a contact enters the bound-to element on the touch surface. */
		mouse.touchEnterMethod = function (event) {
			mouse.isTouching = true;

			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse position with a null position to refresh the statistics. */
			mouse.updatePosition(null);

			/* Perform action for over event */
			mouse.fireOverEvent(event);
		};

		/** When a contact leaves the bound-to element on the touch surface. */
		mouse.touchLeaveMethod = function (event) {
			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse position with a null position to refresh the statistics. */
			mouse.updatePosition(null);

			/* Perform action for over event. */
			mouse.fireOutEvent(event);

			setTimeout(function () { mouse.isTouching = false; }, 0);
		};

		/** When a contact gets cancelled. This can occur if the user has moved
		 *	the touch point outside the browser UI or into a plugin or if an alert modal pops up. */
		mouse.touchCancelMethod = function (event) {
			/* Put mouse as a reference in the event. */
			event.mouse = mouse;

			/* Skip the default behaviours upon this event. */
			if (mouse.preventDefault) {
				event.preventDefault();
			}

			/* Update the mouse position with a null position to refresh the statistics. */
			mouse.updatePosition(null);

			/* Perform action for over event. */
			mouse.fireOutEvent(event);

			setTimeout(function () { mouse.isTouching = false; }, 0);
		};

		mouse.addDocumentMouseListener = function () {
			mouse.documentMouseListener = { mouse: mouse, moveEvent: mouse.moveEventMethod, upEvent: mouse.upEventMethod };
			documentMouseListeners.push(mouse.documentMouseListener);
		};

		mouse.removeDocumentMouseListener = function () {
			for (var i = documentMouseListeners.length - 1; i >= 0; i--) {
				if (documentMouseListeners[i] === mouse.documentMouseListener) {
					documentMouseListeners.splice(i, 1);
				}
			}
		};

		/** Append the mouse to the a DOM element and event functions to it. */
		mouse.attachToElement = function (element) {
			/* Store a reference of the DOM element. */
			mouse.listenElement = element;

			/* Engage the essential mouse events to each corresponding handler. */
			mouse.listenElement.addEventListener("mouseover", mouse.overEventMethod, false);
			mouse.listenElement.addEventListener("mouseout", mouse.outEventMethod, false);
			mouse.listenElement.addEventListener("mousedown", mouse.downEventMethod, false);
			mouse.listenElement.addEventListener("mouseup", mouse.upEventMethod, false);
			mouse.listenElement.addEventListener("mousemove", mouse.moveEventMethod, false);

			mouse.listenElement.addEventListener("touchenter", mouse.touchEnterMethod, false);
			mouse.listenElement.addEventListener("touchleave", mouse.touchLeaveMethod, false);
			mouse.listenElement.addEventListener("touchstart", mouse.touchStartMethod, false);
			mouse.listenElement.addEventListener("touchend", mouse.touchEndMethod, false);
			mouse.listenElement.addEventListener("touchmove", mouse.touchMoveMethod, false);
			mouse.listenElement.addEventListener("touchcancel", mouse.touchCancelMethod, false);
		};

		/** Disengage the mouse from DOM element and event functions from it. */
		mouse.detachFromElement = function () {
			/* Disengage all the mouse events from each corresponding handler. */
			if (mouse.listenElement !== null && mouse.listenElement !== undefined) {
				mouse.listenElement.removeEventListener("mouseover", mouse.overEventMethod, false);
				mouse.listenElement.removeEventListener("mouseout", mouse.outEventMethod, false);
				mouse.listenElement.removeEventListener("mousedown", mouse.downEventMethod, false);
				mouse.listenElement.removeEventListener("mouseup", mouse.upEventMethod, false);
				mouse.listenElement.removeEventListener("mousemove", mouse.moveEventMethod, false);

				mouse.listenElement.removeEventListener("touchenter", mouse.touchEnterMethod, false);
				mouse.listenElement.removeEventListener("touchleave", mouse.touchLeaveMethod, false);
				mouse.listenElement.removeEventListener("touchstart", mouse.touchStartMethod, false);
				mouse.listenElement.removeEventListener("touchend", mouse.touchEndMethod, false);
				mouse.listenElement.removeEventListener("touchmove", mouse.touchMoveMethod, false);
				mouse.listenElement.removeEventListener("touchcancel", mouse.touchCancelMethod, false);

				/* Remove the reference of the DOM element. */
				mouse.listenElement = null;
			}
		};

		/** Toggle value for mouse prevent default on all events. */
		mouse.setPreventDefault = function (preventDefault) {
			mouse.preventDefault = preventDefault;
		};

		/* Append the canvas to the DIV container. */
		if (container !== undefined) {
			mouse.attachToElement(container);
		}
	};
});
