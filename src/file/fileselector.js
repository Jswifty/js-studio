define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
], function (Module, CSSLoader, DOMElement) {

  var currentDirectory = Module.uri.replace("fileselector.js", "");

  /* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "fileselector.css");

  var inputIndex = 1;

  return function () {
    var fileSelector = new DOMElement("div", { class: "fileSelector" });

    var dropZone = new DOMElement("div", { class: "dropZone" });
    dropZone.onDrop(function (event) {
      event.preventDefault();
      console.log(event);
    });
    dropZone.onDragOver(function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "link";
      console.log(event);
    });
    fileSelector.appendChild(dropZone);

    var hiddenFileInput = new DOMElement("input", { id: "input_" + inputIndex, class: "hiddenFileInput", type: "file", multiple: true });
    dropZone.appendChild(hiddenFileInput);

    var fileInputLabel = new DOMElement("label", { class: "fileInputLabel", for: "input_" + inputIndex, html: "Choose or drop files here" });
    dropZone.appendChild(fileInputLabel);

    inputIndex++;

    return fileSelector;
  };
});
