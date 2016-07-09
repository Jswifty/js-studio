define([
  "../classmanager/classmanager",
],function (ClassManager) {

	return function (properties) {

		var domElement = document.createElement(properties.type || "div");
		domElement.id = properties.id;
		domElement.className = properties.class;

		domElement.onMouseDown = function (mouseDown) {
			domElement.addEventListener("mousedown", function (event) {
				mouseDown(event);
			}, false);
		};

		domElement.onMouseUp = function (mouseUp) {
			domElement.addEventListener("mouseup", function (event) {
				mouseUp(event);
			}, false);
		};

    domElement.hasClass = function (classname)  {
      return ClassManager.hasClass(domElement, classname);
    };

    domElement.addClass = function (classname)  {
      ClassManager.addClass(domElement, classname);
    };

    domElement.removeClass = function (classname)  {
      ClassManager.removeClass(domElement, classname);
    };

    domElement.toggleClass = function (classname, toggleOn)  {
      ClassManager.toggleClass(domElement, classname, toggleOn);
    };

		return domElement;
	};
}
