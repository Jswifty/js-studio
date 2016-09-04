define([
  "js-studio/mouse/mouse",
  "js-studio/mouse/mouselistener",
  "js-studio/keyboard/keyboard",
  "js-studio/keyboard/keylistener",
  "js-studio/classmanager/classmanager"
], function (Mouse, MouseListener, Keyboard, KeyListener, ClassManager) {

  var currentTabIndex = 1;

	return function (type, properties) {
    type = type || "div";
    properties = properties || {};

		var domElement = document.createElement(type);

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        var propertyValue = properties[property];

        if (propertyValue !== undefined) {
          if (property === "class") {
            domElement.className = properties[property];
          } else if (property === "html") {
            domElement.innerHTML = properties[property];
          } else {
            domElement[property] = properties[property];
          }
        }
      }
    }

    function addMouseListener () {
      if (domElement.mouse === undefined) {
        domElement.mouseDownListeners = [];
        domElement.mouseUpListeners = [];
        domElement.mouseMoveListeners = [];
        domElement.mouseDragListeners = [];
        domElement.mouseOutListeners = [];
        domElement.mouseOverListeners = [];
        domElement.mouseClickListeners = [];
        domElement.mouseRightClickListeners = [];

        domElement.mouse = new Mouse(domElement);

        domElement.mouseListener = new MouseListener();
        domElement.mouseListener.onMouseDown(function (event) {
          for (var i = 0; i < domElement.mouseDownListeners.length; i++) {
            domElement.mouseDownListeners[i](event);
          }
        });
        domElement.mouseListener.onMouseUp(function (event) {
          for (var i = 0; i < domElement.mouseUpListeners.length; i++) {
            domElement.mouseUpListeners[i](event);
          }

          if (event.mouse.isLeftButton === true) {
            for (var i = 0; i < domElement.mouseClickListeners.length; i++) {
              domElement.mouseClickListeners[i](event);
            }
          } else if (event.mouse.isRightButton === true) {
            for (var i = 0; i < domElement.mouseRightClickListeners.length; i++) {
              domElement.mouseRightClickListeners[i](event);
            }
          }
        });
        domElement.mouseListener.onMouseMove(function (event) {
          for (var i = 0; i < domElement.mouseMoveListeners.length; i++) {
            domElement.mouseMoveListeners[i](event);
          }

          if (event.mouse.isMouseDown === true) {
            for (var j = 0; j < domElement.mouseDragListeners.length; j++) {
              domElement.mouseDragListeners[j](event);
            }
          }
        });
        domElement.mouseListener.onMouseOut(function (event) {
          for (var i = 0; i < domElement.mouseOutListeners.length; i++) {
            domElement.mouseOutListeners[i](event);
          }
        });
        domElement.mouseListener.onMouseOver(function (event) {
          for (var i = 0; i < domElement.mouseOverListeners.length; i++) {
            domElement.mouseOverListeners[i](event);
          }
        });

        domElement.mouse.addMouseListener(domElement.mouseListener);
      }
    };

    function addKeyListener () {
      if (domElement.keyboard === undefined) {
        domElement.tabIndex = currentTabIndex;
        currentTabIndex++;

        domElement.keyDownListeners = [];
        domElement.keyUpListeners = [];

        domElement.keyboard = new Keyboard(domElement);

        domElement.keyListener = new KeyListener();
        domElement.keyListener.onKeyDown(function (event) {
          for (var i = 0; i < domElement.keyDownListeners.length; i++) {
            domElement.keyDownListeners[i](event);
          }
        });
        domElement.keyListener.onKeyUp(function (event) {
          for (var i = 0; i < domElement.keyUpListeners.length; i++) {
            domElement.keyUpListeners[i](event);
          }
        });

        domElement.keyboard.addKeyListener(domElement.keyListener);
      }
    };

		domElement.onMouseDown = function (mouseDown) {
      addMouseListener();
      domElement.mouseDownListeners.push(mouseDown);
      return domElement;
		};

		domElement.onMouseUp = function (mouseUp) {
      addMouseListener();
      domElement.mouseUpListeners.push(mouseUp);
      return domElement;
		};

    domElement.onMouseMove = function (mouseMove) {
      addMouseListener();
      domElement.mouseMoveListeners.push(mouseMove);
      return domElement;
    };

    domElement.onMouseDrag = function (mouseDrag) {
      addMouseListener();
      domElement.mouseDragListeners.push(mouseDrag);
      return domElement;
    };

    domElement.onMouseOut = function (mouseOut) {
      addMouseListener();
      domElement.mouseOutListeners.push(mouseOut);
      return domElement;
    };

    domElement.onMouseClick = function (mouseClick) {
      addMouseListener();
      domElement.mouseClickListeners.push(mouseClick);
      return domElement;
    };

    domElement.onMouseRightClick = function (mouseRightClick) {
      addMouseListener();
      domElement.mouseRightClickListeners.push(mouseRightClick);
      return domElement;
    };

    domElement.onKeyDown = function (keyDown) {
      addKeyListener();
      domElement.keyDownListeners.push(keyDown);
      return domElement;
    };
    domElement.onKeyUp = function (keyUp) {
      addKeyListener();
      domElement.keyUpListeners.push(keyUp);
      return domElement;
    };

    domElement.hasClass = function (classname) {
      return ClassManager.hasClass(domElement, classname);
    };

    domElement.addClass = function (classname) {
      ClassManager.addClass(domElement, classname);
      return domElement;
    };

    domElement.removeClass = function (classname) {
      ClassManager.removeClass(domElement, classname);
      return domElement;
    };

    domElement.toggleClass = function (classname, toggleOn) {
      ClassManager.toggleClass(domElement, classname, toggleOn);
      return domElement;
    };

		return domElement;
	};
});
