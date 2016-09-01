# Mouse & MouseListener

## Mouse
```Mouse``` is an object class which monitors mouse events triggered from the given container.
It also captures details of the input over time in terms of location and motion.

## Usage
```javascript
/* Get the container for the mouse. */
var Container = document.getElementById("Container");

/* Create a mouse instance, with the element as its container.
 * This is to allow the mouse to monitor all mouse events from the container. */
var mouse = new Mouse(Container);
```

## MouseListener
```MouseListener``` is an object class which handles events triggered from ```Mouse```.
Each instance of ```MouseListener``` is required to be added into a ```Mouse``` object.

## Usage
```javascript

/* Create a mouse listener instance, with the element as its container. */
var mouseListener = new MouseListener();

/**** There are 7 methods that can be overwritten: ****/
mouseListener.onMouseOver = function (event) {
	/* Do your stuff when mouse is over the container. */
};

mouseListener.onMouseOut = function (event) {
	/* Do your stuff when mouse is out of the container. */
};

mouseListener.onMouseDown = function (event) {
	/* Do your stuff when mouse button is down. */
};

mouseListener.onMouseUp = function (event) {
	/* Do your stuff when mouse button is up. */
};

mouseListener.onMouseMove = function (event) {
	/* Do your stuff when mouse moves. */
};

mouseListener.onMouseStop = function (event) {
	/* Do your stuff when mouse stops moving. */
};

mouseListener.onMouseClick = function (event) {
	/* Do your stuff when a mouse button is clicked. */
};

/* Append the listener to the mouse. */
mouse.addMouseListener(mouseListener);

...

/* Listener is no longer useful, remove it from the mouse. */
mouse.removeMouseListener(mouseListener);
```
