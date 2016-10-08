define([
  "js-studio/domelement/domelement",
  "js-studio/engine2d/scene2d",
  "js-studio/engine2d/object2d"
], function (DOMElement, Scene2D, Object2D) {

  function createImage2D (image) {
    var image2D = new Object2D(0, 0, image.width, image.height);

    image2D.render = function (context, x, y, width, height) {
      context.drawImage(image, image2D.x - x, image2D.y - y, image2D.width, image2D.height);
    };

    return image2D;
  };

  return function (container) {

    var imageView = this;

    imageView.scene2D = new Scene2D(container);
    imageView.scene2D.start();

    imageView.image2D = null;

    imageView.loadImage = function (image) {
      if (imageView.image2D !== null) {
        imageView.scene2D.remove(imageView.image2D);
      }

      imageView.image2D = createImage2D(image);

      imageView.scene2D.add(imageView.image2D);
      imageView.scene2D.setDimension(image.width, image.height);
    };

    return imageView;
  };
});
