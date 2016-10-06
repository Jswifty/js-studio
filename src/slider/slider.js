define([
	"module",
  "js-studio/cssloader/cssloader",
	"js-studio/domelement/domelement",
	"js-studio/keyboard/keycodes"
], function (Module, CSSLoader, DOMElement, Key) {

	var currentDirectory = Module.uri.replace("slider.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "slider.css");

	return function (options) {
    options = options || {};

    var slider = new DOMElement("div", { id: options && options.id, class: "slider" + (options && options.class ? " " + options.class : "") });
    slider.step = options.step || 1;
    slider.min = options.min || 0;
    slider.max = options.max || 100;
    slider.range = slider.max - slider.min;
    slider.value = options.value || 50;
    slider.vertical = options.vertical === true;
    slider.onChange = options.onChange || function () {};
    slider.slideProperty = slider.vertical ? "top" : "left";
    slider.onMouseDown(sliderMouseEvent);
    slider.onMouseDrag(sliderMouseEvent);
    slider.onKeyDown(sliderKeyEvent);
    slider.setValue = function (value) {
      value = value || slider.value;
      value = Math.max(slider.min, Math.min(slider.max, value));

      var percentage = (value - slider.min) / slider.range * 100;

      sliderThumb.style[slider.slideProperty] = percentage + "%";
      slider.value = value;
      slider.onChange(value);
    };

    if (options && options.class !== undefined) {
      slider.addClass(options.class);
    }

    if (slider.vertical === true) {
      slider.addClass("vertical");
    }

    var sliderThumb = new DOMElement("div", { class: "sliderThumb" });
    slider.appendChild(sliderThumb);

    function sliderMouseEvent (event) {
      if (event.mouse.isLeftButton === true) {
	      var length = slider.vertical ? slider.offsetHeight : slider.offsetWidth;
	      var position = slider.vertical ? event.mouse.position.y : event.mouse.position.x;

	      var value = slider.min + slider.range * Math.max(0, Math.min(1, position / length));

	      value = Math.round(value / slider.step) * slider.step;

	      slider.setValue(value);
			}
    };

   function sliderKeyEvent (event) {
      var keyCode = event.keyboard.keyCode;

      if ((keyCode === Key.LEFT && slider.vertical !== true) || (keyCode === Key.UP && slider.vertical === true)) {
        slider.setValue(slider.value - slider.step);
      } else if ((keyCode === Key.RIGHT && slider.vertical !== true) || (keyCode === Key.DOWN && slider.vertical === true)) {
        slider.setValue(slider.value + slider.step);
      }
    };

    slider.setValue();

    return slider;
  }
});
