define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
], function (Module, CSSLoader, DOMElement) {

  var currentDirectory = Module.uri.replace("fileselector.js", "");

  /* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "fileselector.css");

  return function (options) {
    var fileSelector = new DOMElement("div", { id: options && options.id, class: "fileSelector" + (options && options.class ? " " + options.class : "") });
    fileSelector.fileSelected = options.fileSelected || function () {};

    var dropEffect = (options && options.dropEffect) || "copy";
    var dropZone = new DOMElement("div", { class: "dropZone" });
    dropZone.onDragOver(function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });
    dropZone.onDrop(function (event) {
      event.preventDefault();
      fileSelector.fileSelected(event.dataTransfer.files);
    });
    dropZone.onMouseDown(function (event) {
      if (event.mouse.isLeftButton === true) {
        hiddenFileInput.click();
      }
    });
    fileSelector.appendChild(dropZone);

    var inputLabel = new DOMElement("span", { class: "fileInputLabel", html: (options && options.inputLabelHTML) || "Choose or drop files here" });
    dropZone.appendChild(inputLabel);

    var hiddenFileInput = new DOMElement("input", { class: "hiddenFileInput", type: "file", multiple: options && options.multiple });
    hiddenFileInput.onChange(function (event) {
      fileSelector.fileSelected(hiddenFileInput.files);
    });
    dropZone.appendChild(hiddenFileInput);

    fileSelector.setLabelHTML = function (html) {
      inputLabel.innerHTML = html;
    };

    return fileSelector;
  };
});
