define(function () {

  return function () {
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
});
