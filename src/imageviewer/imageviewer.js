define([
  "module",
  "js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
  "js-studio/file/fileselector",
  "./imageview",
  "./imageviewcontroller",
  "./imageviewtoolbar"
], function (Module, CSSLoader, DOMElement, FileSelector, ImageView, ImageViewController, ImageViewToolbar) {

  var currentDirectory = Module.uri.replace("imageviewer.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "imageviewer.css");

  return function (options) {
    var imageViewer = new DOMElement("div", { id: options && options.id, class: "imageViewer" + (options && options.class ? " " + options.class : "") });

    imageViewer.imageView = new ImageView({ class: "hide" });
    imageViewer.appendChild(imageViewer.imageView);

    imageViewer.toolbar = new ImageViewToolbar({ class: "hide" });
    imageViewer.appendChild(imageViewer.toolbar);

    imageViewer.overlay = new FileSelector({ class: "imageViewerOverlay", inputLabelHTML: "Choose or drop images here" });
    imageViewer.appendChild(imageViewer.overlay);

    imageViewer.controller = new ImageViewController(imageViewer.imageView, imageViewer.toolbar, imageViewer.overlay);

    return imageViewer;
  };
});
