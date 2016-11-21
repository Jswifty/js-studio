define([
  "./sprite"
], function (Sprite) {

  function getImagePixels (image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, image.width, image.height);

    return imageData.data;
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
        var openSprite = openSprites[i];

        if (openSprite.isOverlapWithPreviousRanges(startPoint, endPoint)) {
          openSprite.addPointRange(startPoint, endPoint);
          return;
        }
      }

      var sprite = new Sprite();
      sprite.addPointRange(startPoint, endPoint);
      openSprites.push(sprite);
    };

    var processSprites = function () {
      var openSpriteIndices = [];

      for (var i = 0; i < openSprites.length; i++) {
        openSpriteIndices.push(i);
      }

      for (var i = 0; i < openSprites.length; i++) {
        for (var j = i + 1; j < openSprites.length; j++) {
          if (openSprites[i].intersectsWith(openSprites[j])) {
            openSprites[i].mergeWith(openSprites[j]);
            openSpriteIndices[j] = i;
          }
        }
      }

      // TODO: extract unique open sprites.

      for (var i = openSprites.length - 1; i >= 0; i--) {
        var openSprite = openSprites[i];

        openSprite.processPointRanges();

        if (openSprite.isClosed()) {
          sprites.push(openSprite);
          openSprites.splice(i, 1);
        }
      }
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
