define([
  "js-studio/keyboard/keycodes"
], function (Key) {

  return function (imageView) {
    var controller = this;

    controller.previousFocusPosition = null;

    controller.scene2D = imageView.scene2D;

    controller.zoomFactor = 1.1;

    controller.moveSpeed = 10;

    controller.scene2D.setKeyInputs({
      [Key.UP]: function () { imageView.moveFocusPosition(0, -controller.moveSpeed); },
      [Key.DOWN]: function () { imageView.moveFocusPosition(0, controller.moveSpeed); },
      [Key.LEFT]: function () { imageView.moveFocusPosition(-controller.moveSpeed, 0); },
      [Key.RIGHT]: function () { imageView.moveFocusPosition(controller.moveSpeed, 0); }
    });

    controller.scene2D.canvasView
    .onMouseScroll(function (event) {
      if (event.mouse.scrollDelta > 0) {
        imageView.zoomIn(controller.zoomFactor);
      } else if (event.mouse.scrollDelta < 0) {
        imageView.zoomOut(controller.zoomFactor);
      }
    }).onMouseDown(function (event) {
      if (event.mouse.isLeftButton === true) {
        controller.previousFocusPosition = imageView.getFocusPosition();
      }
    }).onMouseUp(function (event) {
      controller.previousFocusPosition = null;
    }).onMouseDrag(function (event) {
      if (event.mouse.isLeftButton === true && controller.previousFocusPosition !== null) {
        var previousDownPosition = event.mouse.previousDownPosition;
        var mousePosition = event.mouse.position;
        var previousFocusPosition = controller.previousFocusPosition;
        var zoom = controller.scene2D.getZoom();
        var movedDistance = { x: (previousDownPosition.x - mousePosition.x) / zoom, y: (previousDownPosition.y - mousePosition.y) / zoom };

        imageView.setFocusPosition(previousFocusPosition.x + movedDistance.x, previousFocusPosition.y + movedDistance.y);
      }
    });
  };
});
