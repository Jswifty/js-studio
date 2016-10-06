define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
], function (Module, CSSLoader, DOMElement) {

  var currentDirectory = Module.uri.replace("fileselector.js", "");

  /* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "fileselector.css");

  var inputIndex = 1;

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

    fileSelector.appendChild(dropZone);

    var hiddenFileInput = new DOMElement("input", { id: "input_" + inputIndex, class: "hiddenFileInput", type: "file", multiple: options && options.multiple });
    hiddenFileInput.onChange(function (event) {
      fileSelector.fileSelected(hiddenFileInput.files);
    });
    dropZone.appendChild(hiddenFileInput);

    var inputLabelHTML = (options && options.inputLabelHTML) || "Choose or drop files here";
    var fileInputLabel = new DOMElement("label", { class: "fileInputLabel", for: "input_" + inputIndex, html: inputLabelHTML });
    dropZone.appendChild(fileInputLabel);

    inputIndex++;

    return fileSelector;
  };
});
