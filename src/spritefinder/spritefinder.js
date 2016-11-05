define(function () {

  function getImagePixels (image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, image.width, image.height);

    return imageData.data;
  };

  function Sprite () {
    var sprite = this;
    sprite.points = [];
    sprite.boundaries = { startX: null, startY: null, endX: null, endY: null };
    sprite.currentPointRanges = [];
    sprite.previousPointRanges = [];

    sprite.isOverlapWithPreviousRanges = function (startPoint, endPoint) {
      for (var i = 0; i < sprite.previousPointRanges.length; i++) {
        var previouPointRange = sprite.previousPointRanges[i];
        var previousStartPoint = previouPointRange.startPoint;
        var previousEndPoint = previouPointRange.endPoint;

        if (startPoint.y === previousStartPoint.y + 1 && startPoint.x <= previousEndPoint.x && endPoint.x >= previousStartPoint.x) {
          return true;
        }
      }

      return false;
    };

    sprite.hasPassedPreviousRange = function (startPoint) {
      // TODO
    };

    sprite.addPointRange = function (startPoint, endPoint) {
      sprite.currentPointRanges.push({ startPoint: startPoint, endPoint: endPoint });
    };

    sprite.processPointRanges = function () {
      for (var i = 0; i < sprite.previousPointRanges.length; i++) {
        var pointRange = sprite.previousPointRanges[i];
        var startPoint = pointRange.startPoint;
        var endPoint = pointRange.endPoint;

        sprite.points.push(startPoint);
        if (startPoint.x !== endPoint.x) {
          sprite.points.push(endPoint);
        }
      }

      sprite.previousPointRanges = sprite.currentPointRanges;
      sprite.currentPointRanges = [];
    };
  };

  return function (image) {
    var pixels = getImagePixels(image);

    var sprites = [];
    var openSprites = [];

    var alphaFound = false;
    var startPoint = null;
    var endPoint = null;

    var updateSprites = function () {
      for (var i = openSprites.length - 1; i >= 0; i--) {
        var sprite = openSprites[i];

        if (sprite.isOverlapWithPreviousRanges(startPoint, endPoint)) {
          sprite.addPointRange(startPoint, endPoint);
          return;
        }
      }

      var sprite = new Sprite();
      sprite.addPointRange(startPoint, endPoint);
      openSprites.push(sprite);
    };

    var processSprites = function () {
      // close up sprites
      // or merge sprites
    };

    var setStartPoint = function (x, y) {
      startPoint = { x: x, y: y };
      alphaFound = true;
    };

    var setEndPoint = function (x, y) {
      endPoint = { x: x, y: y };
      alphaFound = false;

      updateSprites();

      startPoint = null;
      endPoint = null;
    };

    for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
        var i = y * image.width * 4 + x * 4;
        var alpha = pixels[i + 3];

        if (alpha > 0 && alphaFound === false) {
          setStartPoint(x, y);
        } else if (alpha === 0 && alphaFound === true) {
          setEndPoint(x - 1, y);
        }
      }

      if (startPoint !== null) {
        setEndPoint(image.width - 1, y);
      }

      processSprites();
    }

    return sprites;
  };
});
