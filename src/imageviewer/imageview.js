define([
  "js-studio/domelement/domelement",
  "js-studio/engine2d/scene2d",
  "js-studio/engine2d/object2d",
  "js-studio/keyboard/keycodes"
], function (DOMElement, Scene2D, Object2D, Key) {

  function createImage2D (scene2D) {
    var image2D = new Object2D(0, 0, 0, 0);

    image2D.scene2D = scene2D;
    image2D.image = null;

    image2D.render = function (context, x, y, width, height) {
      if (image2D.image !== null) {
        context.drawImage(image2D.image, -x, -y, image2D.width, image2D.height);
      }
    };

    image2D.setImage = function (image) {
      if (image !== undefined && image.width !== undefined && image.height !== undefined) {
        image2D.image = image;
        image2D.setDimension(image.width, image.height);
      }
    };

    return image2D;
  };

  function createFocusPoint (scene2D) {
    var focusPoint = new Object2D(0, 0, 0, 0);

    focusPoint.scene2D = scene2D;

    var setObjectPosition = focusPoint.setPosition;

    focusPoint.setImage = function (image) {
      focusPoint.setPosition(image.width / 2, image.height / 2);
    };

    focusPoint.setPosition = function (x, y) {
      var dimension = focusPoint.scene2D.getDimension();
      var navigationRange = focusPoint.scene2D.getNavigationRange();

      x = Math.max((dimension.width - navigationRange.xRange) / 2, Math.min((dimension.width + navigationRange.xRange) / 2, x));
      y = Math.max((dimension.height - navigationRange.yRange) / 2, Math.min((dimension.height + navigationRange.yRange) / 2, y));

      setObjectPosition(x, y);
    };

    focusPoint.adjustPosition = function () {
      focusPoint.setPosition(focusPoint.x, focusPoint.y);
    };

    return focusPoint;
  };

  return function (container) {
    var imageView = this;

    imageView.zoomFactor = 1.1;

    imageView.moveSpeed = 10;

    imageView.previousFocusPosition = null;

    imageView.scene2D = new Scene2D(container);
    imageView.scene2D.start();

    imageView.image2D = createImage2D(imageView.scene2D);
    imageView.scene2D.add(imageView.image2D);

    imageView.focusPoint = createFocusPoint(imageView.scene2D);
    imageView.scene2D.add(imageView.focusPoint);

    imageView.scene2D.setFollowObjects([imageView.focusPoint]);

    imageView.scene2D.setKeyInputs({
      [Key.UP]: function () { imageView.moveFocusPosition(0, -imageView.moveSpeed); },
      [Key.DOWN]: function () { imageView.moveFocusPosition(0, imageView.moveSpeed); },
      [Key.LEFT]: function () { imageView.moveFocusPosition(-imageView.moveSpeed, 0); },
      [Key.RIGHT]: function () { imageView.moveFocusPosition(imageView.moveSpeed, 0); }
    });

    imageView.scene2D.canvasView
    .onMouseScroll(function (event) {
      if (event.mouse.scrollDelta > 0) {
        imageView.zoomIn();
      } else if (event.mouse.scrollDelta < 0) {
        imageView.zoomOut();
      }
    }).onMouseDown(function (event) {
      if (event.mouse.isLeftButton === true) {
        imageView.previousFocusPosition = imageView.getFocusPosition();
      }
    }).onMouseDrag(function (event) {
      if (event.mouse.isLeftButton === true && imageView.previousFocusPosition !== null) {
        var previousDownPosition = event.mouse.previousDownPosition;
        var mousePosition = event.mouse.position;
        var previousFocusPosition = imageView.previousFocusPosition;
        var zoom = imageView.scene2D.getZoom();
        var movedDistance = { x: (previousDownPosition.x - mousePosition.x) / zoom, y: (previousDownPosition.y - mousePosition.y) / zoom };
        imageView.setFocusPosition(previousFocusPosition.x + movedDistance.x, previousFocusPosition.y + movedDistance.y);
      }
    }).onMouseUp(function (event) {
      imageView.previousFocusPosition = null;
    });

    imageView.loadImage = function (image) {
      imageView.scene2D.setDimension(image.width, image.height);
      imageView.image2D.setImage(image);
      imageView.focusPoint.setImage(image);
    };

    imageView.getZoom = function () {
      return imageView.scene2D.getZoom();
    };

    imageView.setZoom = function (zoom, zoomSpeed) {
      imageView.scene2D.setZoom(zoom, zoomSpeed);
      imageView.focusPoint.adjustPosition();
    };

  	imageView.zoomIn = function (zoomFactor, zoomSpeed) {
      imageView.scene2D.zoomIn(zoomFactor || imageView.zoomFactor, zoomSpeed);
      imageView.focusPoint.adjustPosition();
  	};

  	imageView.zoomOut = function (zoomFactor, zoomSpeed) {
      imageView.scene2D.zoomOut(zoomFactor || imageView.zoomFactor, zoomSpeed);
      imageView.focusPoint.adjustPosition();
  	};

    imageView.getFocusPosition = function () {
      return imageView.focusPoint.getPosition();
    };

    imageView.setFocusPosition = function (x, y) {
      imageView.focusPoint.setPosition(x, y);
    };

    imageView.moveFocusPosition = function (x, y) {
      var focusPosition = imageView.focusPoint.getPosition();
      imageView.focusPoint.setPosition(focusPosition.x + x, focusPosition.y + y);
    };

    return imageView;
  };
});
