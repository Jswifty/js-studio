define([
	"js-studio/canvasview/canvasview"
], function (CanvasView) {

  return function (container, width, height) {
    var scene2D = this;

    scene2D.x = 0;
    scene2D.y = 0;
    scene2D.accelX = 0;
    scene2D.accelY = 0;
    scene2D.xRange = 0;
    scene2D.yRange = 0;
    scene2D.width = width || 0;
    scene2D.height = height || 0;
    scene2D.canvasWidth = width;
    scene2D.canvasHeight = height;
    scene2D.zoom = 1;
    scene2D.requestedZoom = 1;
    scene2D.zoomSpeed = 0.5;
    scene2D.showGrid = true;
    scene2D.gridSize = 20;
    scene2D.gridColor1 = "rgba(150, 150, 150, 0.7)";
    scene2D.gridColor2 = "rgba(200, 200, 200, 0.7)";
    scene2D.followObjects = [];
    scene2D.followSpeed = 1;
    scene2D.objects = [];
    scene2D.enableSmoothing = true;

    /* Create a CanvasView to draw. */
    scene2D.canvasView = new CanvasView(container);
    scene2D.canvasView.onResize(function (canvasWidth, canvasHeight) {
      scene2D.canvasWidth = canvasWidth;
      scene2D.canvasHeight = canvasHeight;

      scene2D.adjustScenePosition();
      scene2D.adjustCanvasContext();
    });
    scene2D.canvasView.setRender(function (context, width, height) {
      context.clearRect(0, 0, width / scene2D.zoom, height / scene2D.zoom);

      if (scene2D.showGrid === true) {
      	scene2D.drawGrid(context, scene2D.x, scene2D.y, scene2D.width, scene2D.height);
      }

      for (var i = 0; i < scene2D.objects.length; i++) {
        scene2D.objects[i].render(context, scene2D.x, scene2D.y, scene2D.width, scene2D.height);
      }
    });

    scene2D.adjustCanvasContext = function () {
      var context = scene2D.canvasView.getContext("2d");
      context.scale(scene2D.zoom, scene2D.zoom);
      context.mozImageSmoothingEnabled = scene2D.enableSmoothing;
      context.webkitImageSmoothingEnabled = scene2D.enableSmoothing;
      context.msImageSmoothingEnabled = scene2D.enableSmoothing;
      context.imageSmoothingEnabled = scene2D.enableSmoothing;
    };

    scene2D.adjustScenePosition = function () {
      var widthDiff = scene2D.canvasWidth - scene2D.width * scene2D.zoom;
      var heightDiff = scene2D.canvasHeight - scene2D.height * scene2D.zoom;

      if (widthDiff >= 0) {
      	scene2D.xRange = 0;
      	scene2D.x = -widthDiff / 2 / scene2D.zoom;
      } else {
      	scene2D.xRange = -widthDiff / scene2D.zoom;
      	scene2D.x = Math.max(0, Math.min(scene2D.x, scene2D.xRange));
      }

      if (heightDiff >= 0) {
      	scene2D.yRange = 0;
      	scene2D.y = -heightDiff / 2 / scene2D.zoom;
      } else {
      	scene2D.yRange = -heightDiff / scene2D.zoom;
      	scene2D.y = Math.max(0, Math.min(scene2D.y, scene2D.yRange));
      }
    };

  	scene2D.drawGrid = function (context, sceneX, sceneY, width, height) {
      for (var x = 0, xIndex = 0; x <= width; x += scene2D.gridSize, xIndex++) {
        for (var y = 0, yIndex = 0; y <= height; y += scene2D.gridSize, yIndex++) {
          context.fillStyle = (xIndex + yIndex) % 2 === 0 ? scene2D.gridColor1 : scene2D.gridColor2;
          context.fillRect(x - sceneX, y - sceneY, Math.min(width - x, scene2D.gridSize), Math.min(height - y, scene2D.gridSize));
        }
      }
  	};

  	scene2D.processKeyInputs = function () {
      var keyboard = scene2D.keyboard;

      if (keyboard !== undefined) {
      	for (var i = 0; i < keyboard.keyCodesPressed.length; i++) {
          var keyCode = keyboard.keyCodesPressed[i];
          var keyEvent = scene2D.keyInputs[keyCode];

          if (typeof keyEvent === "function") {
          	keyEvent();
          }
      	}
      }
  	};

    scene2D.processZoom = function () {
      var zoom = scene2D.zoom + (scene2D.requestedZoom - scene2D.zoom) * scene2D.zoomSpeed;
      var newZoom = zoom / scene2D.zoom;
      scene2D.canvasView.getContext("2d").scale(newZoom, newZoom);
      scene2D.zoom = zoom;
    };

    scene2D.add = function (object) {
      scene2D.objects.push(object);
    };

    scene2D.remove = function (object) {
      for(var i = scene2D.objects.length - 1; i >= 0; i--) {
        if(scene2D.objects[i] === object) {
          scene2D.objects.splice(i, 1);
          break;
        }
      }
    };

  	scene2D.setAcceleration = function (accelX, accelY) {
      scene2D.accelX = accelX || scene2D.accelX;
      scene2D.accelY = accelY || scene2D.accelY;
  	};

    scene2D.getZoom = function () {
      return scene2D.zoom;
    };

    scene2D.setZoom = function (zoom, zoomSpeed) {
      scene2D.requestedZoom = zoom || scene2D.requestedZoom;
      scene2D.zoomSpeed = zoomSpeed || scene2D.zoomSpeed;
    };

    scene2D.getRequestedZoom = function () {
      return scene2D.requestedZoom;
    };

  	scene2D.zoomIn = function (zoomFactor, zoomSpeed) {
      scene2D.setZoom(scene2D.requestedZoom * (zoomFactor || 1.05), zoomSpeed);
  	};

  	scene2D.zoomOut = function (zoomFactor, zoomSpeed) {
      scene2D.setZoom(scene2D.requestedZoom / (zoomFactor || 1.05), zoomSpeed);
  	};

    scene2D.getNavigationRange = function () {
      return { xRange: scene2D.xRange, yRange: scene2D.yRange };
    };

    scene2D.getDimension = function () {
      return { width: scene2D.width, height: scene2D.height };
    };

    scene2D.setDimension = function (width, height) {
      scene2D.setWidth(width);
      scene2D.setHeight(height);

      scene2D.canvasView.fireResizeEvent();
    };

    scene2D.setWidth = function (width) {
      scene2D.width = width || scene2D.width;
    };

    scene2D.setHeight = function (height) {
      scene2D.height = height || scene2D.height;
    };

  	scene2D.setShowGrid = function (showGrid, gridSize) {
      scene2D.showGrid = showGrid === true;
      scene2D.gridSize = gridSize || scene2D.gridSize;
  	};

  	scene2D.setKeyInputs = function (keyInputs) {
      if (scene2D.keyboard === undefined) {
      	scene2D.canvasView.onKeyDown();
      	scene2D.keyboard = scene2D.canvasView.keyboard;
      }

      scene2D.keyInputs = keyInputs || {};
  	};

    scene2D.getScenePosition = function () {
      return { x: scene2D.x, y: scene2D.y };
    };

    scene2D.setScenePosition = function (x, y) {
      if (scene2D.xRange > 0) {
        scene2D.x = Math.max(0, Math.min(x, scene2D.xRange));
      }
      if (scene2D.yRange > 0) {
        scene2D.y = Math.max(0, Math.min(y, scene2D.yRange));
      }
    };

    scene2D.setEnableImageSmoothing = function (enableSmoothing) {
      scene2D.enableSmoothing = enableSmoothing;
    };

  	scene2D.setFollowObjects = function (object2Ds, followSpeed) {
      scene2D.followObjects = object2Ds || [];
      scene2D.followSpeed = followSpeed || scene2D.followSpeed;
  	};

    scene2D.start = function () {
      scene2D.canvasView.start();
    };

  	scene2D.update = function (timeDiff) {
      scene2D.processKeyInputs();
      scene2D.processZoom();
      scene2D.adjustScenePosition();

      for (var i = 0; i < scene2D.objects.length; i++) {
      	scene2D.objects[i].update(timeDiff, scene2D.width, scene2D.height, scene2D.accelX, scene2D.accelY);
      }

      var x = 0;
      var y = 0;

      if (scene2D.followObjects.length > 0) {
        for (var i = 0; i < scene2D.followObjects.length; i++) {
          var object = scene2D.followObjects[i];

          x += object.x + (object.width - scene2D.canvasWidth / scene2D.zoom) / 2;
          y += object.y + (object.height - scene2D.canvasHeight / scene2D.zoom) / 2;
        }

        x /= scene2D.followObjects.length;
        y /= scene2D.followObjects.length;
      } else {
        x = (scene2D.width - scene2D.canvasWidth / scene2D.zoom) / 2;
        y = (scene2D.height - scene2D.canvasHeight / scene2D.zoom) / 2;
      }

      x = scene2D.x + (x - scene2D.x) * scene2D.followSpeed;
      y = scene2D.y + (y - scene2D.y) * scene2D.followSpeed;

    	scene2D.setScenePosition(x, y);
  	};

  	scene2D.canvasView.animator.addRenderFunction(scene2D, scene2D.update);
  };
});
