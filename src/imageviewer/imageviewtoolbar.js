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
      inputLabelHTML: "Choose...",
      fileSelected: function (files) {
        if (files !== undefined && files[0] !== undefined) {
          toolbar.loadImage(files[0]);
        }
      }
    });
    toolbar.appendChild(fileSelector);

    var imageDimensionLabel = new DOMElement("div", { class: "imageDimensionLabel" });
    toolbar.appendChild(imageDimensionLabel);

    var imageLocationLabel = new DOMElement("div", { class: "imageLocationLabel" });
    toolbar.appendChild(imageLocationLabel);

    var imageZoomLabel = new DOMElement("div", { class: "imageZoomLabel" });
    toolbar.appendChild(imageZoomLabel);
    
    toolbar.setLoadImage = function (loadImage) {
      toolbar.loadImage = loadImage;
    };

    toolbar.setImage = function (image) {
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

    return toolbar;
  };
});
