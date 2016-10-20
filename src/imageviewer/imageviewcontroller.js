define([
  "js-studio/keyboard/keycodes"
], function (Key) {

  return function (imageView, toolbar) {
    var controller = this;

    controller.previousFocusPosition = null;

    controller.imageView = imageView;
    controller.toolbar = toolbar;

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
  };
});
