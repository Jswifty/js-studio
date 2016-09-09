# CanvasView

## CanvasView
```CanvasView``` is an object class which creates an instance of a HTML5 canvas under the given container element. It also initiates an animator, in which it can pass rendering functions through into it.

Requires: animator.js

## Usage
```javascript
/* Get the div container for the canvas view. */
var container = document.getElementById("container");

/* Create an instance of CanvasView, with the div element as its container. */
var canvasView = new CanvasView(container);

canvasView.setRender(function (context, width, height) {
    /** Do your rendering here **/
});

/* Define your canvas view pause event handler. */
canvasView.onPause(function () {
  console.log('canvas view paused!');
});

/* Define your canvas view resume event handler. */
canvasView.onResume(function () {
  console.log('canvas view resumed!');
});

/* Start of the canvas animation! */
canvasView.start();
```
