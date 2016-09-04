define(function () {

	function addKeyCode (keyCodes, keyCode) {
		for (var i = 0; i < keyCodes.length; i++) {
			if (keyCodes[i] === keyCode) {
				return;
			}
		}

		keyCodes.push(keyCode);
	};

	function removeKeyCode (keyCodes, keyCode) {
		for (var i = keyCodes.length - 1; i >= 0; i--) {
			if (keyCodes[i] === keyCode) {
				keyCodes.splice(i, 1);
			}
		}
	};

  return function (container) {
    var keyboard = this;

		this.UP = 38;
		this.DOWN = 40;
		this.LEFT = 37;
		this.RIGHT = 39;

    /* Whether the keyboard skips the default behaviours upon the listen element. */
		this.preventDefault = false;

		/* The list of key codes of the keys that this keyboard has been pressed. */
		this.keyCodesPressed = [];

		/* Whether the keyboard skips any further key down event after the first one. */
		this.skipRepeatKeyDownEvent = false;

		/* The list of listeners this keyboard is appended to. Each keyboard event will trigger the corresponding method of each listeners. */
		this.listeners = [];

    /** Perform action for key press event */
    this.onKeyDown = function (event) {
      for (var i = 0; i < keyboard.listeners.length; i++) {
        keyboard.listeners[i].downEvent(event);
      }
    };

    /** Perform action for key up event */
    this.onKeyUp = function (event) {
      for (var i = 0; i < keyboard.listeners.length; i++) {
        keyboard.listeners[i].upEvent(event);
      }
    };

    /** When a key is pressed. */
		this.downEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

			keyboard.keyCode = event.which || event.keyCode;
			addKeyCode(keyboard.keyCodesPressed, keyboard.keyCode);

      /* Perform action for down event. */
      keyboard.onKeyDown(event);
    };

    /** When a key is released. */
    this.upEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

			keyboard.keyCode = event.which || event.keyCode;
			removeKeyCode(keyboard.keyCodesPressed, keyboard.keyCode);

      /* Perform action for down event. */
      keyboard.onKeyUp(event);
    };

		this.hasKeyPressed = function (keyCode) {
			return contains(keyboard.keyCodesPressed, keyCode);
		};

		this.getLastKeyPressed = function () {
			return keyboard.keyCodesPressed.length > 0 ? keyboard.keyCodesPressed[keyboard.keyCodesPressed.length - 1] : null;
		};

    /** Add a key listener to the keyboard. */
    this.addKeyListener = function (keyListener) {
      /* Check if the input object is an instance of KeyListener. */
      if (keyListener.downEvent && keyListener.upEvent) {
        keyboard.listeners.push(keyListener);
      }
    };

    /** Remove a key listener from the keyboard. */
    this.removeKeyListener = function (keyListener) {
      /* Check if the input object is an instance of KeyListener. */
      if (keyListener.downEvent && keyListener.upEvent) {

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

		/** Toggle value for keyboard skipping further key down events. */
		this.setSkipRepeatKeyDownEvent = function (skipRepeatKeyDownEvent) {
			keyboard.skipRepeatKeyDownEvent = skipRepeatKeyDownEvent;
		};

		/* Append the canvas to the DIV container. */
		if (container !== undefined) {
			this.attachToElement(container);
		}
  };
});
