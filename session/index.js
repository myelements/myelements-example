module.exports = function(app, frontend) {

  frontend.io.on("connection", function(client) {
    client.trigger("dataupdate", {
      session: {
        user: client.session
      }
    });
  });
  app.post("/login", function(req, res, next) {

  })
}