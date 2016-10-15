define([
  "js-studio/imagepreloader/imagepreloader",
  "js-studio/file/fileutils"
], function (preloadImage, FileUtils) {

  function isImageFile (file) {
    return /image\/[^svg]/.test(file.type);
  };

  function getImageFromFile (file, callback) {
    FileUtils.readFileAsDataURL(file, function (dataURL) {
      preloadImage(dataURL, function (images) {
        if (images && images[0]) {
          callback(images[0]);
        }
      });
    });
  };

  function loadImageFile (file, loadingEvent, callback) {
    if (isImageFile(file)) {
      loadingEvent();
      getImageFromFile(file, callback);
    }
  };

  return loadImageFile;
});
