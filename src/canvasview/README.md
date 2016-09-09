# CanvasView

## CanvasView
```CanvasView``` is an object class which creates an instance of a HTML5 canvas under the given container element. It also initiates an animator, in which it can pass rendering functions through into it.

Requires: animator.js, animatorlistener.js

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
