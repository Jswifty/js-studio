define([
  "js-studio/engine2d/object2d"
], function (Object2D) {

  return function (x, y, width, height) {
    var character = new Object2D(x, y, width, height);

    character.movementSpeed = 5;
    character.jumpSpeed = 1000;
    character.speedX = 0;
    character.speedY = 0;
    character.topBlocked = false;
    character.bottomBlocked = false;
    character.leftBlocked = false;
    character.rightBlocked = false;

    character.render = function (context, x, y, width, height) {
      context.fillStyle = "red";
      context.fillRect(character.x - x, character.y - y, character.width, character.height);
    };

    character.update = function (timeDiff, width, height, accelX, accelY) {

      character.speedX += accelX * timeDiff;
      character.speedY += accelY * timeDiff;

      character.x += character.speedX * timeDiff;
      character.y += character.speedY * timeDiff;

      character.x = Math.max(0, Math.min(width - character.width, character.x));
      character.y = Math.max(0, Math.min(height - character.height, character.y));

      character.topBlocked = character.y === 0;
      character.bottomBlocked = character.y === height - character.height;
      character.leftBlocked = character.x === 0;
      character.rightBlocked = character.x === width - character.width;

      if (character.leftBlocked || character.rightBlocked) {
        character.speedX = 0;
      }

      if (character.topBlocked || character.bottomBlocked) {
        character.speedY = 0;
      }
    };

    character.moveLeft = function () {
      character.x -= character.movementSpeed;
    };

    character.moveRight = function () {
      character.x += character.movementSpeed;
    };

    character.jump = function () {
      if (character.bottomBlocked === true) {
        character.speedY = -character.jumpSpeed;
      }
    };

    return character;
  };
});
