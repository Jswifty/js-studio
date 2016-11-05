define([
	"module",
 	"js-studio/mouse/mouse",
	"js-studio/cssloader/cssloader",
  "js-studio/domelement/domelement",
	"js-studio/imageviewer/imageviewer",
  "js-studio/spritefinder/spritefinder"
], function (Module, Mouse, CSSLoader, DOMElement, ImageViewer, findSprites) {

	var currentDirectory = Module.uri.replace("spriteboundariestest.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "spriteboundariestest.css");

	return function (container) {
    var scene = this;

    /* Apply the scene's styling onto the container. */
    container.className = "spriteBoundariesTest";

    scene.imageViewer = new ImageViewer();

    scene.imageViewer.onImageLoaded(function (image, file) {
      var sprites = findSprites(image);

      console.log(sprites);
    });

    container.appendChild(scene.imageViewer);
	};
});
