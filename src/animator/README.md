# Animator & AnimatorListener


## Animator
<code>Animator</code> is an object class which registers rendering functions from objects and executes them repeatedly in a rate depended on the native window browser's <code>requestAnimationFrame</code> call-back method.

## Usage
```javascript
/* Create an instance of an animator. */
var animator = new Animator();

/* Create an object which has a render function. */
var object = createRenderingObject();

/* Register the object and its render function to the animator. 
 * It returns the render ID. Store it for future reference. */
var renderID = animator.addRenderFunction(object, object.renderFunction());

/* Start the animation. */
animator.start();

...

/* Pause the animation. */
animator.pause();

/* Remove the registry of the object from the animator using the render ID. */
animator.removeRenderFunction(renderID);
```

## AnimatorListener
<code>AnimatorListener</code> is an interface which handles events triggered from <code>Animator</code>.
Each instance of <code>AnimatorListener</code> is required to be appended to an <code>Animator</code> object.

## Usage
```javascript
/* Create an animator listener for listening to events from the animator. */

/* Define your animation pause event handler. */
function onAnimatorPause() {
  console.log('animation paused!'); 
}

/* Define your animation resume event handler. */
function onAnimatorResume() {
  console.log('animation resumed!'); 
}

var animatorListener = new AnimatorListener(onAnimatorPause, onAnimatorResume);

/* Append the listener to the animator. */
animator.addAnimatorListener(animatorListener);

...

/* Listener is no longer useful, remove it from the animator. */
animator.removeAnimatorListener(animatorListener);
```