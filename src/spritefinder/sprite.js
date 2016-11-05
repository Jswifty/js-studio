define(function () {

  return function () {
    var sprite = this;
    sprite.previousPointRange = null;
    sprite.pointRanges = [];

    sprite.getPreviousPointRange = function () {
      return sprite.previousPointRange;
    };
  };
});
