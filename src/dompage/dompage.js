define([
  "js-studio/taskscheduler/taskscheduler",
  "js-studio/taskscheduler/taskschedulerlistener"
], function (TaskScheduler, TaskSchedulerListener) {

  return function (container, loadPage, unloadPage) {

    var page = this;

    this.container = container;
    this.loaded = false;

    this.loadPage = loadPage || function () {};
    this.unloadPage = unloadPage || function () {};

    this.style = document.createElement("link");
    this.style.rel = "stylesheet";
    this.style.type = "text/css";

    this.setStyleSource = function (source) {
      page.style.href = source;
    };

    this.loadStyle = function (callback) {
      var loadEvent = function () {
        style.removeEventListener("load", loadEvent);
        callback();
      }
      style.addEventListener("load", loadEvent);
      page.container.appendChild(style);
    };

    this.load = function (callback) {
      if (page.loaded === false) {
        new TaskScheduler()
        .addTask({ caller: page, method: page.loadStyle, params: [ function () {} ], callbackIndex: 0 })
        .addTask({ caller: page, method: page.loadPage, params: [ function () {} ], callbackIndex: 0 })
        .addTask({ method: function () { page.loaded = true; callback(); })
        .run();
      }
    };

    this.unload = function (callback) {
      if (page.loaded === true) {
        new TaskScheduler()
        .addTask({ caller: page, method: page.unloadPage, params: [ function () {} ], callbackIndex: 0 })
        .addTask({ method: function () { page.loaded = false; callback(); })
        .run();
      }
    };
  };
}
