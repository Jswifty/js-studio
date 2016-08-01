define([
  "../classmanager/classmanager"
], function (ClassManager) {

	return function (type, properties) {
    type = type || "div";
    properties = properties || {};

		var domElement = document.createElement(type);

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
});
