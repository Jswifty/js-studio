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

    /* Whether the keyboard skips the default behaviours upon the listen element. */
		keyboard.preventDefault = false;

		/* The list of key codes of the keys that this keyboard has been pressed. */
		keyboard.keyCodesPressed = [];

		/* Whether the keyboard skips any further key down event after the first one. */
		keyboard.skipRepeatKeyDownEvent = false;

		/* The list of listeners this keyboard is appended to. Each keyboard event will trigger the corresponding method of each listeners. */
		keyboard.downEvents = [];
		keyboard.upEvents = [];

		keyboard.onKeyDown = function (downEvent) {
			downEvent = downEvent || function () {};
			keyboard.downEvents.push(downEvent);
		};

		keyboard.onKeyUp = function (upEvent) {
			upEvent = upEvent || function () {};
			keyboard.upEvents.push(upEvent);
		};

    /** Perform action for key press event */
    keyboard.fireDownEvent = function (event) {
      for (var i = 0; i < keyboard.downEvents.length; i++) {
        keyboard.downEvents[i](event);
      }
    };

    /** Perform action for key up event */
    keyboard.fireUpEvent = function (event) {
      for (var i = 0; i < keyboard.upEvents.length; i++) {
        keyboard.upEvents[i](event);
      }
    };

    /** When a key is pressed. */
		keyboard.downEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

			keyboard.keyCode = event.which || event.keyCode;
			addKeyCode(keyboard.keyCodesPressed, keyboard.keyCode);

      /* Perform action for down event. */
      keyboard.fireDownEvent(event);
    };

    /** When a key is released. */
    keyboard.upEventMethod = function (event) {
      /* Put keyboard as a reference in the event. */
      event.keyboard = keyboard;

			keyboard.keyCode = event.which || event.keyCode;
			removeKeyCode(keyboard.keyCodesPressed, keyboard.keyCode);

      /* Perform action for down event. */
      keyboard.fireUpEvent(event);
    };

		keyboard.hasKeyPressed = function (keyCode) {
			return contains(keyboard.keyCodesPressed, keyCode);
		};

		keyboard.getLastKeyPressed = function () {
			return keyboard.keyCodesPressed.length > 0 ? keyboard.keyCodesPressed[keyboard.keyCodesPressed.length - 1] : null;
		};

    /** Append the keyboard to the a DOM element and event functions to it. */
		keyboard.attachToElement = function (element) {
			/* Store a reference of the DOM element. */
			keyboard.listenElement = element;

			/* Engage the essential keyboard events to each corresponding handler. */
			keyboard.listenElement.addEventListener("keydown", keyboard.downEventMethod, false);
			keyboard.listenElement.addEventListener("keyup", keyboard.upEventMethod, false);
		};

		/** Disengage the keyboard from DOM element and event functions from it. */
		keyboard.detachFromElement = function () {
			/* Disengage all the keyboard events from each corresponding handler. */
			if (keyboard.listenElement !== null && keyboard.listenElement !== undefined) {
        keyboard.listenElement.removeEventListener("keydown", keyboard.downEventMethod, false);
  			keyboard.listenElement.removeEventListener("keyup", keyboard.upEventMethod, false);

				/* Remove the reference of the DOM element. */
				keyboard.listenElement = null;
			}
		};

		/** Toggle value for keyboard prevent default on all events. */
		keyboard.setPreventDefault = function (preventDefault) {
			keyboard.preventDefault = preventDefault;
		};

		/** Toggle value for keyboard skipping further key down events. */
		keyboard.setSkipRepeatKeyDownEvent = function (skipRepeatKeyDownEvent) {
			keyboard.skipRepeatKeyDownEvent = skipRepeatKeyDownEvent;
		};

		/* Append the canvas to the DIV container. */
		if (container !== undefined) {
			keyboard.attachToElement(container);
		}
  };
});
