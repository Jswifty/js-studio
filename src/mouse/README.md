# Mouse

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

mouse.onMouseOver(function (event) {
	/* Do your stuff when mouse is over the container. */
});

mouse.onMouseOut(function (event) {
	/* Do your stuff when mouse is out of the container. */
});

mouse.onMouseDown(function (event) {
	/* Do your stuff when mouse button is down. */
});

mouse.onMouseUp(function (event) {
	/* Do your stuff when mouse button is up. */
});

mouse.onMouseMove(function (event) {
	/* Do your stuff when mouse moves. */
});

mouse.onMouseDrag(function (event) {
	/* Do your stuff when mouse button is down. */
});

mouse.onMouseStop(function (event) {
	/* Do your stuff when mouse stops moving. */
});

mouse.onMouseClick(function (event) {
	/* Do your stuff when a mouse button is clicked. */
});
```
