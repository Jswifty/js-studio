define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
  "js-studio/file/fileselector",
  "./imagefileloader",
  "./imageview",
  "./imageviewcontroller",
  "./imageviewtoolbar"
], function (Module, CSSLoader, DOMElement, FileSelector, loadImageFile, ImageView, ImageViewController, ImageViewToolbar) {

  var currentDirectory = Module.uri.replace("imageviewer.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "imageviewer.css");

  return function (options) {
    var imageViewer = new DOMElement("div", { id: options && options.id, class: "imageViewer" + (options && options.class ? " " + options.class : "") });

    imageViewer.imageView = new ImageView({ class: "hide" });
    imageViewer.appendChild(imageViewer.imageView);

    imageViewer.toolbar = new ImageViewToolbar({ class: "hide" });
    imageViewer.toolbar.setLoadImage(loadImage);
    imageViewer.appendChild(imageViewer.toolbar);

    imageViewer.controller = new ImageViewController(imageViewer.imageView, imageViewer.toolbar);

    imageViewer.overlay = new FileSelector({
      class: "imageViewerOverlay",
      inputLabelHTML: "Choose or drop images here",
      fileSelected: function (files) {
        if (files !== undefined && files[0] !== undefined) {
          loadImage(files[0]);
        }
      }
    });
    imageViewer.appendChild(imageViewer.overlay);

    function loadImage (file) {
      loadImageFile(file, function () {
        imageViewer.imageView.addClass("hide");
        imageViewer.overlay.removeClass("hide");
        imageViewer.overlay.setText("Loading image...");
      }, function (image) {
        imageViewer.imageView.removeClass("hide");
        imageViewer.overlay.addClass("hide");
        imageViewer.overlay.setText("Choose or drop images here");
        imageViewer.toolbar.removeClass("hide");
        imageViewer.toolbar.setImage(image);
        imageViewer.imageView.loadImage(image);
      });
    };

    return imageViewer;
  };
});
