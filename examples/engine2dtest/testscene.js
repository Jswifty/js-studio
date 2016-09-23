define([
	"js-studio/engine2d/scene2d"
], function (Scene2D) {

  return function (container, width, height) {
    var testScene = new Scene2D(container, width, height);

    var updateScene = testScene.update;

    testScene.update = function () {
      updateScene();
    };

    return testScene;
  };
});
