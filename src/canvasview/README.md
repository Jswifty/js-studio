# CanvasView & CanvasViewListener


## CanvasView
<code>CanvasView</code> is an object class which creates an instance of a HTML5 canvas under the given DIV container.
It also initiates an animator, in which it can pass rendering functions through into it.

Requires: animator.js

## Usage
```javascript
/* Get the div container for the canvas view. */
var divContainer = document.getElementById("divContainer");

/* Create an instance of CanvasView, with the div element as its container. */
var canvasView = new CanvasView(divContainer);

canvasView.addRenderFunction(function () {
    
		var context = canvasView.getCanvas2DContext();
		var canvasWidth = canvasView.getCanvasWidth();
		var canvasHeight = canvasView.getCanvasHeight();
    
    /** Do your rendering here **/	
});

/* Start of the canvas animation! */
canvasView.start();
```

## CanvasViewListener
<code>CanvasViewListener</code> is an interface which handles events triggered from <code>CanvasView</code>.
Each instance of <code>CanvasViewListener</code> is required to be appended to an <code>CanvasView</code> object.

## Usage
```javascript
/* Create an canvas view listener for listening to events from the animator. */

/* Define your canvas view pause event handler. */
function onViewPause() {
  console.log('canvas view paused!'); 
}

/* Define your canvas view resume event handler. */
function onViewResume() {
  console.log('canvas view resumed!'); 
}

var canvasViewListener = new CanvasViewListener(onViewPause, onViewResume);

/* Append the listener to the canvas view. */
canvasView.addCanvasViewListener(canvasViewListener);

...

/* Listener is no longer useful, remove it from the canvas view. */
canvasView.removeCanvasViewListener(canvasViewListener);
```
