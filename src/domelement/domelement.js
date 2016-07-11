define([
  "../classmanager/classmanager"
], function (ClassManager) {

	return function (properties) {
    properties = properties || {};

		var domElement = document.createElement(properties.type || "div");

    if (properties.id !== undefined) {
	    domElement.id = properties.id;
    }

    if (properties.class !== undefined) {
      domElement.className = properties.class;
    }

    if (properties.html !== undefined) {
      domElement.innerHTML = properties.html;
    }

		domElement.onMouseDown = function (mouseDown) {
			domElement.addEventListener("mousedown", function (event) {
				mouseDown(event);
			}, false);
      return domElement;
		};

		domElement.onMouseUp = function (mouseUp) {
			domElement.addEventListener("mouseup", function (event) {
				mouseUp(event);
			}, false);
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
}
