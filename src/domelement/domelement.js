define([
  "../classmanager/classmanager"
], function (ClassManager) {

	return function (type, properties) {
    type = type || "div";
    properties = properties || {};

		var domElement = document.createElement(type);
    domElement.mousePressed = false;
    domElement.mouseDownListeners = [];
    domElement.mouseUpListeners = [];
    domElement.mouseMoveListeners = [];
    domElement.mouseDragListeners = [];

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        if (property === "class") {
          domElement.className = properties[property];
        } else if (property === "html") {
          domElement.innerHTML = properties[property];
        } else {
          domElement[property] = properties[property];
        }
      }
    }

    function addMouseDownListener () {
      domElement.addEventListener("mousedown", function (event) {
        domElement.mousePressed = true;

        for (var i = 0; i < domElement.mouseDownListeners.length; i++) {
          domElement.mouseDownListeners[i](event);
        }
      }, false);
    };

    function addMouseUpListener () {
      domElement.addEventListener("mouseup", function (event) {
        domElement.mousePressed = false;

        for (var i = 0; i < domElement.mouseUpListeners.length; i++) {
          domElement.mouseUpListeners[i](event);
        }
      }, false);
    };

    function addMouseMoveListener () {
      domElement.addEventListener("mousemove", function (event) {

        for (var i = 0; i < domElement.mouseMoveListeners.length; i++) {
          domElement.mouseMoveListeners[i](event);
        }

        if (domElement.mousePressed === true) {
          for (var j = 0; j < domElement.mouseDragListeners.length; j++) {
            domElement.mouseDragListeners[j](event);
          }
        }
      }, false);
    };

		domElement.onMouseDown = function (mouseDown) {
      if (domElement.mouseDownListeners.length === 0) {
        addMouseDownListener();
      }

      domElement.mouseDownListeners.push(mouseDown);

      return domElement;
		};

		domElement.onMouseUp = function (mouseUp) {
      if (domElement.mouseUpListeners.length === 0) {
        addMouseUpListener();
      }

      domElement.mouseUpListeners.push(mouseUp);

      return domElement;
		};

    domElement.onMouseMove = function (mouseMove) {
      if (domElement.mouseMoveListeners.length === 0) {
        addMouseMoveListener();
      }

      domElement.mouseMoveListeners.push(mouseMove);

      return domElement;
    };

    domElement.onMouseDrag = function (mouseDrag) {
      if (domElement.mouseDownListeners.length === 0) {
        addMouseDownListener();
      }
      if (domElement.mouseUpListeners.length === 0) {
        addMouseUpListener();
      }
      if (domElement.mouseMoveListeners.length === 0) {
        addMouseMoveListener();
      }

      domElement.mouseDragListeners.push(mouseDrag);

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
