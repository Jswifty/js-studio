# Keyboard

## Keyboard
```Keyboard``` is an object class which monitors key events triggered from the given container.
It also captures details of the input over time in terms of location and motion.

## Usage
```javascript
/* Get the container for the keyboard. */
var container = document.getElementById("container");

/* Create a keyboard instance, with the element as its container.
 * This is to allow the keyboard to monitor all key events from the container. */
var keyboard = new Keyboard(container);

keyboard.onKeyDown(function (event) {
	/* Do your stuff when key is pressed within the container. */
});

keyboard.onKeyUp(function (event) {
	/* Do your stuff when key is released within the container. */
});
```
