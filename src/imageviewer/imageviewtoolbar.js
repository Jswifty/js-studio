define([
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
  "js-studio/file/fileselector"
], function (CSSLoader, DOMElement, FileSelector) {

  return function (options) {
    var toolbar = new DOMElement("div", { id: options && options.id, class: "imageViewToolbar" + (options && options.class ? " " + options.class : "") });
    toolbar.loadImage = function () {};
    toolbar.gridChanged = function () {};

    var fileSelector = new FileSelector({
      class: "chooseImage",
      inputLabelHTML: "Choose...",
      fileSelected: function (files) {
        if (files !== undefined && files[0] !== undefined) {
          toolbar.loadImage(files[0]);
        }
      }
    });
    toolbar.appendChild(fileSelector);

    var imageNameLabel = new DOMElement("div", { class: "imageNameLabel" });
    toolbar.appendChild(imageNameLabel);

    var imageZoomLabel = new DOMElement("div", { class: "imageZoomLabel" });
    toolbar.appendChild(imageZoomLabel);

    var imageDimensionLabel = new DOMElement("div", { class: "imageDimensionLabel" });
    toolbar.appendChild(imageDimensionLabel);

    var imageLocationLabel = new DOMElement("div", { class: "imageLocationLabel" });
    toolbar.appendChild(imageLocationLabel);

    var imageGridButton = new DOMElement("div", { class: "imageGridButton gridOn" });
    imageGridButton.onMouseClick(function (event) {
      imageGridButton.toggleClass("gridOn");
      toolbar.gridChanged(imageGridButton.hasClass("gridOn"));
    });
    toolbar.appendChild(imageGridButton);

    toolbar.setLoadImage = function (loadImage) {
      toolbar.loadImage = loadImage;
    };

    toolbar.setImage = function (image, file) {
      imageNameLabel.innerHTML = file.name.length > 11 ? file.name.substring(0, 8) + "..." : file.name;
      imageDimensionLabel.innerHTML = image.width + " x " + image.height;
      imageZoomLabel.innerHTML = imageZoomLabel.innerHTML || "100%";
    };

    toolbar.setZoom = function (zoom) {
      imageZoomLabel.innerHTML = Math.round(zoom * 100) + "%";
    };

    toolbar.setPosition = function (position) {
      if (position !== undefined && position.x !== undefined && position.y !== undefined) {
        imageLocationLabel.innerHTML = Math.floor(position.x) + ", " + Math.floor(position.y);
      } else {
        imageLocationLabel.innerHTML = "";
      }
    };

    toolbar.onGridChanged = function (gridChanged) {
      toolbar.gridChanged = gridChanged;
    };

    return toolbar;
  };
});
