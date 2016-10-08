define([
	"module",
 	"js-studio/mouse/mouse",
	"js-studio/cssloader/cssloader",
	"js-studio/imageviewer/imageviewer"
], function (Module, Mouse, CSSLoader, ImageViewer) {

	var currentDirectory = Module.uri.replace("imageviewertest.js", "");

	/* Insert the scene styling into the the header of the web page. */
	CSSLoader.load(currentDirectory + "imageviewertest.css");

	return function (container) {
    var scene = this;

    /* Apply the scene's styling onto the container. */
    container.className = "imageViewerTest";

    scene.imageViewer = new ImageViewer();
    container.appendChild(scene.imageViewer);
	};
});
