var express = require('express'),
  http = require("http"),
  session = require("express-session"),
  debug = require("debug")("myelements:example:server"),
  myelements = require("myelements.jquery");


var app = express();
var server = http.createServer(app);
// Serve index.html
app.use("/", express.static('./client'));

var appSession = session({
  secret: "tongaloca",
  resave: true,
  saveUninitialized: true
});

app.use(appSession);

var frontend = myelements(app, server, {
  session: appSession
});

console.log(h);

frontend.io.on("connection", function(socket) {
  debug(socket.session);
});


require("./tweets")(app, frontend, "pizza");
//This is a module that sends latestStockSnapshot message to the frontend
require("./stockticker")(app, frontend, "GLOB");

require("./mongochat")(app, frontend);
//require("./session")(app);
//require("./currenttime")(app);

server.listen(3000);