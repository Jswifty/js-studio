define([
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
  "js-studio/file/fileselector"
], function (CSSLoader, DOMElement, FileSelector) {

  return function (options) {
    var toolbar = new DOMElement("div", { id: options && options.id, class: "imageViewToolbar" + (options && options.class ? " " + options.class : "") });
    toolbar.loadImage = function () {};

    var fileSelector = new FileSelector({
      class: "chooseImage",
      inputLabelHTML: "Choose Image",
      fileSelected: function (files) {
        if (files !== undefined && files[0] !== undefined) {
          toolbar.loadImage(files[0]);
        }
      }
    });
    toolbar.appendChild(fileSelector);

    toolbar.onLoadImage = function (loadImage) {
      toolbar.loadImage = loadImage;
    };

    return toolbar;
  };
});
