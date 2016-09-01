define(function () {
	var documentKeyListeners = [];

  document.addEventListener("keydown", function (event) {
    for (var i = 0; i < documentKeyListeners.length; i++) {
      var keyListener = documentKeyListeners[i];

      if (event.target !== keyListener.keyboard.listenElement) {
        keyListener.moveEvent.call(keyListener.keyboard, event);
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    for (var i = 0; i < documentKeyListeners.length; i++) {
      var keyListener = documentKeyListeners[i];

      if (event.target !== keyListener.keyboard.listenElement) {
        keyListener.upEvent.call(keyListener.keyboard, event);
      }
    }
  });

  return function (container) {
    var keyboard = this;

    /* Whether the keyboard skips the default behaviours upon the listen element. */
		this.preventDefault = false;

		/* The list of listeners this keyboard is appended to. Each keyboard event will trigger the corresponding method of each listeners. */
		this.listeners = [];

    /** Perform action for key press event */
    this.onKeyDown = function (event) {
      for (var i = 0; i < keyboard.listeners.length; i++) {
        keyboard.listeners[i].onKeyDown(event);
      }
    };

    /** Perform action for key up event */
    this.onKeyUp = function (event) {
      for (var i = 0; i < keyboard.listeners.length; i++) {
        keyboard.listeners[i].onKeyUp(event);
      }
    };

    /** When a key is pressed. */
		this.downEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

      /* Perform action for down event. */
      keyboard.onKeyDown(event);
    };

    /** When a key is released. */
    this.upEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

      /* Perform action for down event. */
      keyboard.onKeyUp(event);
    };

    /** Add a key listener to the keyboard. */
    this.addKeyListener = function (keyListener) {
      /* Check if the input object is an instance of KeyListener. */
      if (keyListener.onKeyDown && keyListener.onKeyUp) {
        keyboard.listeners.push(keyListener);
      }
    };

    /** Remove a key listener from the keyboard. */
    this.removeKeyListener = function (keyListener) {
      /* Check if the input object is an instance of KeyListener. */
      if (keyListener.onKeyDown && keyListener.onKeyUp) {

        /* Attempt to find the index of the given listener and then remove it. */
        for (var i = keyboard.listeners.length - 1; i >= 0; i--) {
          if (keyboard.listeners[i] === keyListener) {
            keyboard.listeners.splice(i, 1);
          }
        }
      }
    };

    /** Append the keyboard to the a DOM element and event functions to it. */
		this.attachToElement = function (element) {
			/* Store a reference of the DOM element. */
			keyboard.listenElement = element;

			/* Engage the essential keyboard events to each corresponding handler. */
			keyboard.listenElement.addEventListener("keydown", keyboard.downEventMethod, false);
			keyboard.listenElement.addEventListener("keyup", keyboard.upEventMethod, false);
		};

		/** Disengage the keyboard from DOM element and event functions from it. */
		this.detachFromElement = function () {
			/* Disengage all the keyboard events from each corresponding handler. */
			if (keyboard.listenElement !== null && keyboard.listenElement !== undefined) {
        keyboard.listenElement.removeEventListener("keydown", keyboard.downEventMethod, false);
  			keyboard.listenElement.removeEventListener("keyup", keyboard.upEventMethod, false);

				/* Remove the reference of the DOM element. */
				keyboard.listenElement = null;
			}
		};

		/** Toggle value for keyboard prevent default on all events. */
		this.setPreventDefault = function (preventDefault) {
			keyboard.preventDefault = preventDefault;
		};

		/* Append the canvas to the DIV container. */
		if (container !== undefined) {
			this.attachToElement(container);
		}
  };
});
