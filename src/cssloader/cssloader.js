define([
  "js-studio/domelement/domelement"
], function (DOMElement) {

  var head = document.getElementsByTagName("head")[0];

	return {
    load: function (link, callback) {
      var style = new DOMElement("link", { rel: "stylesheet", type: "text/css", href: link });
      var loadEvent = function () {
        style.removeEventListener("load", loadEvent);

        if (typeof callback === "function") {
          callback();
        }
      };

      style.addEventListener("load", loadEvent);
      head.appendChild(style);
    }
  };
});
