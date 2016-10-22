define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
], function (Module, CSSLoader, DOMElement) {

  var currentDirectory = Module.uri.replace("fileselector.js", "");

  var fileSelectorIndex = 1;

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

    fileSelector.appendChild(dropZone);

    var inputID = "fileSelector_" + fileSelectorIndex;

    var inputText = new DOMElement("span", { class: "inputText", html: (options && options.inputLabelHTML) || "Choose or drop files here" });
    dropZone.appendChild(inputText);

    var inputLabel = new DOMElement("label", { class: "inputLabel", for: inputID });
    dropZone.appendChild(inputLabel);

    var hiddenFileInput = new DOMElement("input", { id: inputID, class: "hiddenFileInput", type: "file", multiple: options && options.multiple });
    hiddenFileInput.onChange(function (event) {
      fileSelector.fileSelected(hiddenFileInput.files);
    });
    dropZone.appendChild(hiddenFileInput);

    fileSelector.setText = function (html) {
      inputText.innerHTML = html;
    };

    fileSelector.onFileSelected = function (fileSelected) {
      fileSelector.fileSelected = fileSelected;
    };

    fileSelectorIndex++;

    return fileSelector;
  };
});
