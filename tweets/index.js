var debug = require("debug")("myelements:example:tweets");
var express = require("express");
var Twitter = require('node-tweet-stream');

module.exports = goTweets;


var nLastTweets = 10;

var t = new Twitter({
  consumer_key: 'bOdydemXqqWdBPWBIIPkgw',
  consumer_secret: '4C5XjPJCJZGXsbrT59PG8MJEW7UHONikfHZdMP23g',
  token: '288162692-4r12FqWTxE9CcwoNThAd8X2C4S0PyBGxmq8xKqmA',
  token_secret: 'f1SRckMoHMkiL8NTWkfIQdYAlzeHL9rMANfsZE18rV6z7'
})


var tweets = [];

function goTweets(app, frontend stringToTrack) {
  app.use("/tweets", express.static(__dirname + '/client/'));

  t.on("tweet", function(tweet) {
    if (tweets.length === nLastTweets) {
      tweets.shift();
    }
    tweets.push(tweet);
  }).on('error', function(err) {
    console.log('Oh no')
  });

  frontend.io.on("connection", function(client) {
    t.on('tweet', function(tweet) {
      // send last tweets
      client.trigger("dataupdate", {
        lastTweets: tweets
      });
    });
    client.on("disconnect", function() {

    });
  });

  t.track(stringToTrack)
}