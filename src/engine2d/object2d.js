define(function () {

  return function (x, y, width, height) {
    var object2D = this;

    object2D.x = x;
    object2D.y = y;
    object2D.width = width;
    object2D.height = height;
    object2D.centerX = x + width / 2;
    object2D.centerY = y + height / 2;

    object2D.updateCenterPosition = function () {
      object2D.centerX = object2D.x + object2D.width / 2;
      object2D.centerY = object2D.y + object2D.height / 2;
    };

    object2D.getPosition = function () {
      return { x: object2D.x, y: object2D.y };
    };

    object2D.setPosition = function (x, y) {
      object2D.x = x || object2D.x;
      object2D.y = y || object2D.y;

      object2D.updateCenterPosition();
    };

    object2D.setDimension = function () {
      return { width: object2D.width, height: object2D.height };
    };

    object2D.setDimension = function (width, height) {
      object2D.width = width || object2D.width;
      object2D.height = height || object2D.height;

      object2D.updateCenterPosition();
    };

    object2D.getCenterPosition = function () {
      return { x: object2D.centerX, y: object2D.centerY };
    };

    object2D.render = function (context, x, y, width, height) {};
    object2D.update = function (timeDiff, width, height, speedX, speedY) {};
  };
});
