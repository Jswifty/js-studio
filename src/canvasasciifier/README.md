# CanvasAsciifier


## CanvasAsciifier
<code>CanvasAsciifier</code> is an object class which generates the ascii effect of a given canvas display, optionally with configurations. 
It also allows canvas with animations, which the animator can then be passed in as a parameter.

Requires: animator.js (Optional)

## Usage
```javascript
/* Get the body elements. */
var body = document.getElementsByTagName("body")[0];

/* Create a canvas and append it to the body. */
var canvas = document.createElement("canvas");
canvas.id = "main";
canvas.style.position = "absolute";
canvas.innerHTML = "Your browser does not support HTML5 canvas.";
body.appendChild(canvas);

/* Create an image, set the image source to "darth-vader.jpg". */
var imageObj = new Image();
imageObj.onload = function() {

	/* Draw the image on the canvas once loaded. */
	canvas.getContext("2d").drawImage(imageObj, 0, 0, 300, 150);
	
	/* Create an asciifier and pass in the canvas as the source. */
	var asciify = new asciifier(canvas);
};
imageObj.src = "darth-vader.jpg";
```
