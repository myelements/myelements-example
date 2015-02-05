var db = require("monk")("mongodb://psocketsuser:tornado@ds051160.mongolab.com:51160/psockets");
var debug = require("debug")("myelements:example:mongochat");
var express = require("express");

module.exports = mongochat;

var chatMessages = db.get("chatMessage");

function mongochat(app, frontend) {
  app.use("/mongochat", express.static(__dirname + '/client/'));
  frontend.io.on("connection", function(client) {
    sendLastChatMessages(client);

    client.on("newChatMessage", function(data) {
      debug("userinput %s", JSON.stringify(data))
      // Insert timestamp
      data.time = Date.now();
      chatMessages.insert(data, function() {
        sendLastChatMessages(client);
        broadcastLastChatMessages(client);
      });
    });
    //chatMessages.insert(msg);
  });
}

function sendLastChatMessages(client) {
  chatMessages.find({}, {
    limit: 5,
    sort: {
      time: -1
    }
  }, function(err, docs) {

    client.trigger("dataupdate", {
      lastChatMessages: docs.reverse()
    });
  });
}

function broadcastLastChatMessages(client) {
  chatMessages.find({}, {
    limit: 5,
    sort: {
      time: -1
    }
  }, function(err, docs) {
    client._broadcast("dataupdate", {
      lastChatMessages: docs.reverse()
    });
  });
}