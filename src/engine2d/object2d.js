define(function () {

  return function (x, y, width, height) {
    var object2D = this;

    object2D.x = x;
    object2D.y = y;
    object2D.width = width;
    object2D.height = height;
    object2D.centerX = x + width / 2;
    object2D.centerY = y + height / 2;
    object2D.render = function (context, x, y, width, height) {};
    object2D.update = function (timeDiff, width, height, speedX, speedY) {};
  };
});
