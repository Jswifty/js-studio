define([
  "js-studio/keyboard/keycodes",
  "./imagefileloader"
], function (Key, loadImageFile) {

  return function (imageView, toolbar, overlay) {
    var controller = this;

    controller.imageLoadedEvents = [];

    controller.imageView = imageView;

    controller.toolbar = toolbar;
    controller.toolbar.setLoadImage(loadImage);
    controller.toolbar.onGridChanged(gridChanged);

    controller.overlay = overlay;
    controller.overlay.onFileSelected(function (files) {
      if (files !== undefined && files[0] !== undefined) {
        loadImage(files[0]);
      }
    });

    controller.previousFocusPosition = null;

    controller.zoomFactor = 1.1;

    controller.moveSpeed = 10;

    controller.imageView.scene2D.setKeyInputs({
      [Key.UP]: function () { controller.imageView.moveFocusPosition(0, -controller.moveSpeed); },
      [Key.DOWN]: function () { controller.imageView.moveFocusPosition(0, controller.moveSpeed); },
      [Key.LEFT]: function () { controller.imageView.moveFocusPosition(-controller.moveSpeed, 0); },
      [Key.RIGHT]: function () { controller.imageView.moveFocusPosition(controller.moveSpeed, 0); }
    });

    controller.imageView.scene2D.canvasView
    .onMouseScroll(function (event) {
      if (event.mouse.scrollDelta > 0) {
        controller.imageView.zoomIn(controller.zoomFactor);
      } else if (event.mouse.scrollDelta < 0) {
        controller.imageView.zoomOut(controller.zoomFactor);
      }

      controller.toolbar.setZoom(controller.imageView.getZoom());
    }).onMouseDown(function (event) {
      if (event.mouse.isLeftButton === true) {
        controller.previousFocusPosition = controller.imageView.getFocusPosition();
      }
    }).onMouseMove(function (event) {
      var scenePosition = controller.imageView.scene2D.getScenePosition();
      var zoom = controller.imageView.scene2D.getZoom();
      var mousePosition = event.mouse.position;
      var position = { x: scenePosition.x + (mousePosition.x / zoom), y: scenePosition.y + (mousePosition.y / zoom) };

      controller.toolbar.setPosition(position);
    }).onMouseUp(function (event) {
      controller.previousFocusPosition = null;
    }).onMouseDrag(function (event) {
      if (event.mouse.isLeftButton === true && controller.previousFocusPosition !== null) {
        var previousDownPosition = event.mouse.previousDownPosition;
        var mousePosition = event.mouse.position;
        var previousFocusPosition = controller.previousFocusPosition;
        var zoom = controller.imageView.scene2D.getZoom();
        var movedDistance = { x: (previousDownPosition.x - mousePosition.x) / zoom, y: (previousDownPosition.y - mousePosition.y) / zoom };

        controller.imageView.setFocusPosition(previousFocusPosition.x + movedDistance.x, previousFocusPosition.y + movedDistance.y);
      }
    }).onMouseOut(function (event) {
      controller.toolbar.setPosition();
    });

    controller.onImageLoaded = function (imageLoaded) {
      controller.imageLoadedEvents.push(imageLoaded);
    };

    controller.fireImageLoaded = function (image, file) {
      for (var i = 0; i < controller.imageLoadedEvents.length; i++) {
        controller.imageLoadedEvents[i](image, file);
      }
    };

    function loadImage (file) {
      loadImageFile(file, function () {
        controller.imageView.addClass("hide");
        controller.overlay.removeClass("hide");
        controller.overlay.setText("Loading image...");
      }, function (image) {
        controller.imageView.removeClass("hide");
        controller.overlay.addClass("hide");
        controller.overlay.setText("Choose or drop images here");
        controller.toolbar.removeClass("hide");
        controller.toolbar.setImage(image, file);
        controller.imageView.loadImage(image);
        controller.fireImageLoaded(image, file);
      });
    };

    function gridChanged (showGrid) {
      controller.imageView.scene2D.setShowGrid(showGrid);
    };
  };
});
