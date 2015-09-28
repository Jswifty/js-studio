/**  
 *	Mouse.js is an object class which monitors mouse events triggered from the given DIV container.
 *  It also captures details of the input over time in terms of motion, location, etc.
 */ 

var Mouse = function(divContainer) {
	
	/* Mouse Buttons */
	this.LEFT_BUTTON = 1;
	this.MIDDLE_BUTTON = 2;
	this.RIGHT_BUTTON = 3;
	
	/* Time delay determined to be a mouse click, by default is 0.15 second. */
	this.CLICK_DELAY = 150;
	
	/* The DOM element that this mouse is listening to. */
	this.listenElement = null;
	
	/* The thread for calling the mouse stop event function. */
	this.stoppingThread = null;
		
	/* Previous update time-stamp of all mouse actions. */
	this.lastUpdateTime = 0;
	
	/* Previous update time-stamp of a mouse down action. */
	this.lastMouseDownTime = 0;
	
	/* Current mouse position. */
	this.position = null;
	
	/* Current mouse direction. */
	this.direction = 0;
	
	/* Current mouse moved distance. */
	this.movedDistance = 0;
	
	/* Current mouse moving speed. */
	this.movingSpeed = 0;
	
	/* Whether the mouse skips the default behaviours upon the listen element. */
	this.preventDefault = false;
	
	/* The list of listeners this mouse is appended to. Each mouse event will trigger the corresponding method of each listeners. */
	this.listeners = [];
		
	/** Calculate the distance from the origin position to the destination position. */
	this.getDistance = function (position1, position2) {
		var distance = { x: position2.x - position1.x, y: position2.y - position1.y };
		return Math.sqrt(distance.x * distance.x + distance.y * distance.y);
	};
	
	/** Calculate the angle using trigonometry. Returns angle ranged from -180 to 180 degrees in radian. */
	this.getAngle = function (x, y, z) {
		return x > 0 ? Math.asin(y / z) : (y > 0 ? Math.PI - Math.asin(y / z) : -Math.asin(y / z) - Math.PI);
	};
	
	/** Calculate the directional angle to the destination position in terms of the angle oriented from the East. */
	this.getDirection = function (position1, position2) {
		var distance = { x: position2.x - position1.x, y: position2.y - position1.y };
		var distanceMag = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
		return this.getAngle(distance.x, distance.y, distanceMag);
	};
	
	/** Update the Position of the mouse. */
	this.updatePosition = function (newPosition) {

		/* Get the current time. */
		var currentTime = Date.now();
	
		/* Calculate the moved distance. */
		this.movedDistance = this.position != null && newPosition != null ? this.getDistance(this.position, newPosition) : 0;
		
		/* Calculate the moving speed from time difference and distance. */
		var timeDiff = (currentTime - this.lastUpdateTime) / 1000;
		this.movingSpeed = timeDiff > 0 ? this.movedDistance / timeDiff : 0;
		
		/* Update the mouse direction with the new position. */
		this.direction = this.position != null && newPosition != null ? this.getDirection(this.position, newPosition) : 0;
		
		/* Update the mouse position. */
		this.position = newPosition != null ? { x : newPosition.x, y : newPosition.y } : null;
		
		/* Update the time-stamp. */
		this.lastUpdateTime = currentTime;
	};
	
	/** Perform action for over event */
	this.onMouseOver = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseOver(event);
		}
	};
		
	/** Perform action for out event */
	this.onMouseOut = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseOut(event);
		}
	};
		
	/** Perform action for down event */
	this.onMouseDown = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseDown(event);
		}
	};

	/** Perform action for up event */
	this.onMouseUp = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseUp(event);
		}
	};

	/** Perform action for move event */
	this.onMouseMove = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseMove(event);
		}
	};
		
	/** Perform action for stop event */
	this.onMouseStop = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseStop(event);
		}
	};

	/** Perform action for click event */
	this.onMouseClick = function (event) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].onMouseClick(event);
		}
	};

	/** When the Mouse comes into the parent container. */
	this.overEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
	
		/* Skip the default behaviours upon this event. */
		if (this.preventDefault) {
			event.preventDefault();
		}
		
		/* Update the mouse position with a null position to refresh the statistics. */
		this.updatePosition(null);
		
		/* Perform action for over event */
		this.onMouseOver(event);
	};

	/** When the Mouse moves out from the parent container. */
	this.outEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
	
		/* Skip the default behaviours upon this event. */
		if (this.preventDefault) {
			event.preventDefault();
		}
		
		/* Update the mouse position with a null position to clear the statistics. */
		this.updatePosition(null);
		
		/* Perform action for out event */
		this.onMouseOut(event);
	};

	/** When the Mouse is pressed. */
	this.downEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
	
		/* Skip the default behaviours upon this event. */
		if (this.preventDefault) {
			event.preventDefault();
		}
		
		/* Update the mouse position. */
		this.updatePosition({ x: event.pageX, y: event.pageY });
		
		/* Update the mouse down time-stamp. */
		this.lastMouseDownTime = this.lastUpdateTime;
		
		/* Perform action for down event. */
		this.onMouseDown(event);
	};

	/** When the Mouse's button is released. */
	this.upEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
	
		/* Skip the default behaviours upon this event. */
		if (this.preventDefault) {
			event.preventDefault();
		}
		
		/* Update the mouse position. */
		this.updatePosition({ x: event.pageX, y: event.pageY });
		
		if (this.lastUpdateTime - this.lastMouseDownTime <= this.CLICK_DELAY) {
			this.clickEventMethod(event);
		}
		
		/* Perform action for up event. */
		this.onMouseUp(event);
	};

	/** When the Mouse is moving. */
	this.moveEventMethod = function (event) {
		
		/* Put mouse as a reference in the event. */
		event.mouse = this;
		
		/* Skip the default behaviours upon this event. */
		if (this.preventDefault) {
			event.preventDefault();
		}

		/* Update the time-stamp. */
		this.lastUpdateTime = Date.now();
		
		/* Update the mouse position. */
		this.updatePosition({ x: event.pageX, y: event.pageY });
		
		/* Re-initiate the stopping thread, calling the mouse stop in 0.05s. */
		clearTimeout(this.stoppingThread);
		this.stoppingThread = setTimeout(function() { event.mouse.stopEventMethod(event); }, 50);
		
		/* Perform action for move event */
		this.onMouseMove(event);
	};
	
	/** When the Mouse has stop moving in the container. */
	this.stopEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
		
		/* Update the mouse position. */
		this.updatePosition({ x: event.pageX, y: event.pageY });
		
		/* Perform action for stop event */
		this.onMouseStop(event);
	};

	/** When the Mouse clicks. */
	this.clickEventMethod = function (event) {

		/* Put mouse as a reference in the event. */
		event.mouse = this;
		
		/* Update the mouse position. */
		this.updatePosition({ x: event.pageX, y: event.pageY });
		
		/* Perform action for stop event */
		this.onMouseClick(event);
	};

	/** Add a mouse listener to the mouse. */
	this.addMouseListener = function (mouseListener) {
		
		/* Check if the input object is an instance of MouseListener. */
		if (mouseListener.onMouseOver && mouseListener.onMouseOut && mouseListener.onMouseDown && mouseListener.onMouseUp && 
			mouseListener.onMouseMove && mouseListener.onMouseStop && mouseListener.onMouseClick) {
			this.listeners.push(mouseListener);
		}
	};

	/** Remove a mouse listener from the mouse. */
	this.removeMouseListener = function (mouseListener) {
		
		/* Check if the input object is an instance of MouseListener. */
		if (mouseListener.onMouseOver && mouseListener.onMouseOut && mouseListener.onMouseDown && mouseListener.onMouseUp && 
			mouseListener.onMouseMove && mouseListener.onMouseStop && mouseListener.onMouseClick) {
			
			/* Attempt to find the index of the given listener and then remove it. */
			for(var i = this.listeners.length - 1; i >= 0; i--) {
				if(this.listeners[i] === mouseListener) {
					this.listeners.splice(i, 1);
				}
			}
		}
	};

	/** Append the mouse to the a DOM element and event functions to it. */
	this.attachToElement = function (element) {
	
		/* Store a reference of the DOM element. */
		this.listenElement = element;
		
		/* Store the current instance of the mouse adapter */
		var mouse = this;
		
		/* Engage the essential mouse events to each corresponding handler. */
		this.listenElement.addEventListener("mouseover", function(event) { mouse.overEventMethod(event); }, false);
		this.listenElement.addEventListener("mouseout", function(event) { mouse.outEventMethod(event); }, false);
		this.listenElement.addEventListener("mousedown", function(event) { mouse.downEventMethod(event); }, false);
		this.listenElement.addEventListener("mouseup", function(event) { mouse.upEventMethod(event); }, false);
		this.listenElement.addEventListener("mousemove", function(event) { mouse.moveEventMethod(event); }, false);
	};

	/** Disengage the mouse from DOM element and event functions from it. */
	this.detachFromElement = function () {
	
		/* Remove the reference of the DOM element. */
		this.listenElement = null;

		/* Disengage all the mouse events from each corresponding handler. */
		this.listenElement.removeEventListener("mouseover", function(event) { mouse.overEventMethod(event); }, false);
		this.listenElement.removeEventListener("mouseout", function(event) { mouse.outEventMethod(event); }, false);
		this.listenElement.removeEventListener("mousedown", function(event) { mouse.downEventMethod(event); }, false);
		this.listenElement.removeEventListener("mouseup", function(event) { mouse.upEventMethod(event); }, false);
		this.listenElement.removeEventListener("mousemove", function(event) { mouse.moveEventMethod(event); }, false);
	};

	/**** INITIALISATION ****/
	/* Append the canvas to the DIV container. */
	this.attachToElement(divContainer);
};

/**  
 *	MouseListener.js is an interface object class which handles events triggered from Mouse.
 *	Each instance is required to be added into a mouse object.
 */ 
var MouseListener = function() {
	
	/** The following are all override methods which have commented examples. */
	
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
			case this.LEFT_BUTTON:
				// console.log("mouse left button down ");
				break;
			case this.MIDDLE_BUTTON:
				// console.log("mouse middle button down ");
				break;
			case this.RIGHT_BUTTON:
				// console.log("mouse right button down ");
				break;
			default:
				break;
		}
	};

	/** Perform action for up event */
	this.onMouseUp = function (event) {
		switch (event.which) {
			case this.LEFT_BUTTON:
				// console.log("mouse left button up ");
				break;
			case this.MIDDLE_BUTTON:
				// console.log("mouse middle button up ");
				break;
			case this.RIGHT_BUTTON:
				// console.log("mouse right button up ");
				break;
			default:
				break;
		}
	};

	/** Perform action for move event */
	this.onMouseMove = function (event) {
		// console.log("mouse move" + (event.mouseMovingFast ? " fast" : ""));
	};
		
	/** Perform action for stop event */
	this.onMouseStop = function (event) {
		// console.log("mouse stop");
	};

	/** Perform action for click event */
	this.onMouseClick = function (event) {
		switch (event.which) {
			case this.LEFT_BUTTON:
				// console.log(" left click on " + this.position.x + ", " + this.position.y);
				break;
			case this.MIDDLE_BUTTON:
				// console.log(" middle click ");
				break;
			case this.RIGHT_BUTTON:
				// console.log(" right click ");
				break;
			default:
				break;
		}
	};
};