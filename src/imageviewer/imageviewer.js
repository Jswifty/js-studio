define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/imagepreloader/imagepreloader",
  "js-studio/domelement/domelement",
  "js-studio/file/fileselector",
  "js-studio/file/fileutils",
  "./imageview"
], function (Module, CSSLoader, preloadImage, DOMElement, FileSelector, FileUtils, ImageView) {

  var currentDirectory = Module.uri.replace("imageviewer.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "imageviewer.css");

  function isImageFile (file) {
    return /image\/[^svg]/.test(file.type);
  };

  function getImageFromFile (file, callback) {
    FileUtils.readFileAsDataURL(file, function (dataURL) {
      preloadImage(dataURL, function (images) {
        if (images && images[0]) {
          callback(images[0]);
        }
      });
    });
  };

  function fileSelectionHandler (files, loadingEvent, callback) {
    if (files && files[0] && isImageFile(files[0])) {
      loadingEvent();
      getImageFromFile(files[0], callback);
    }
  }

  return function (options) {
    var imageViewer = new DOMElement("div", { id: options && options.id, class: "imageViewer" + (options && options.class ? " " + options.class : "") });

    imageViewer.imageView = new ImageView(imageViewer);

    imageViewer.overlay = new FileSelector({
      class: "imageViewerOverlay",
      inputLabelHTML: "Choose or drop images here",
      fileSelected: function (files) {
        fileSelectionHandler(files, function () {
          imageViewer.overlay.setLabelHTML("Loading image...");
        }, function (image) {
          imageViewer.imageView.loadImage(image);
          imageViewer.overlay.setLabelHTML("Choose or drop images here");
          imageViewer.overlay.addClass("hide");
        })
      }
    });
    imageViewer.appendChild(imageViewer.overlay);

    return imageViewer;
  };
});
