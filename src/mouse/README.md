# Mouse & MouseListener


## Mouse
<code>Mouse</code> is an object class which monitors mouse events triggered from the given div container.
It also captures details of the input over time in terms of location and motion.

## Usage
```javascript
/* Get the div container for the mouse. */
var divContainer = document.getElementById("divContainer");

/* Create a mouse instance, with the div element as its container. 
 * This is to allow the mouse to monitor all mouse events from the div container. */
var mouse = new Mouse(divContainer);
```

## Mouseistener
<code>Mouseistener</code> is an object class which handles events triggered from <code>Mouse</code>.
Each instance of <code>Mouseistener</code> is required to be added into a <code>Mouse</code> object.

## Usage
```javascript

/* Create a mouse listener instance, with the div element as its container. */
var mouseListener = new MouseListener();

/**** There are 7 methods that can be overwritten: ****/
mouseListener.mouseOver (function () {
	/* Do your stuff when mouse is over the div container. */
});

mouseListener.mouseOut (function () {
	/* Do your stuff when mouse is out of the div container. */
});

mouseListener.mouseDown (function () {
	/* Do your stuff when mouse button is down. */
});

mouseListener.mouseUp (function () {
	/* Do your stuff when mouse button is up. */
});

mouseListener.mouseMove (function () {
	/* Do your stuff when mouse moves. */
});

mouseListener.mouseStop (function () {
	/* Do your stuff when mouse stops moving. */
});

mouseListener.mouseClick (function () {
	/* Do your stuff when a mouse button is clicked. */
});

/* Append the listener to the mouse. */
mouse.addMouseListener(mouseListener);

...

/* Listener is no longer useful, remove it from the mouse. */
mouse.removeMouseListener(mouseListener);
```
