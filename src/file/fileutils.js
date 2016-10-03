define(function () {

  /* Check if all the File APIs are supported. */
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var createSingleReader = function (callback) {
      callback = callback || function () {};
      var reader = new FileReader();

      reader.onload = function (event) {
        callback(event.target.result);
      };

      return reader;
    };

    return {
      readFileAsDataURL: function (file, callback) {
        createSingleReader(callback).readAsDataURL(file);
      },

      readFileAsText: function (file, callback) {
        createSingleReader(callback).readAsText(file);
      },

      readFileAsArrayBuffer: function (file, callback) {
        createSingleReader(callback).readAsArrayBuffer(file);
      },

      readFileAsBinaryString: function (file, callback) {
        createSingleReader(callback).readAsBinaryString(file);
      }
    };
  } else {
    return {};
  }
});
