var express = require("express");

module.exports = function(app, frontend) {
  app.get("currenttime", express.static('./client/currenttime'));
  var time = new EventEmitter();

  setInterval(function() {
    time.emit("timeupdate", new Date().toString());
  }, 2000);

  frontend.io.on("myelements client connected", function(client) {
    time.on("timeupdate", function(currentTime) {
      client.trigger("dataupdate", {
        currentTime: currentTime
      })
    });

  });
}