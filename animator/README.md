# Animator & AnimatorListener


## Animator
<code>Animator</code> is an object class which registers rendering functions from objects and executes them repeatedly in a rate depended on the native window browser's <code>requestAnimationFrame</code> call-back method.

## Usage
```javascript
/* Setup the Animator. */
var animator = new Animator();

...

/* Create a Animator listener to adaptor events. */
var animatorListener = new AnimatorListener();

this.animatorListener.onAnimatorPause = function () {
  console.log('animation paused!'); 
}
this.animatorListener.onAnimatorResume = function () {
  console.log('animation resumed!'); 
}

/* Append the listener to the animator. */
this.animator.addAnimatorListener(this.animatorListener);

...

/* Start the animation. */
this.animator.start();
```

## AnimatorListener
<code>AnimatorListener</code> is an interface object class which handles events triggered from Animator.
Each instance of <code>AnimatorListener</code> is required to be appended to an <code>Animator</code> object.
