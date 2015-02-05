var finance = require("yahoo-finance");
var express = require("express");
EventEmitter = require("events").EventEmitter;
module.exports = stocks;

var lastSnapshot = {};

var updateInterval = 2000; // milliseconds

var stockData = new EventEmitter();

stockData.lastSnapshot = {};

stockData.interval = undefined;

/**
 * Triggers a message with last stock data
 * for a specific company with symbol 'symbol'.
 * @param {myelements.Client} client. myelements client on which to emit messages
 * @param {String} symbol. Financial symbol for a company. e.g. AAPL
 * @event 'dataupdate' {Object} }
 *   - lastStockSnapshot: object as returnds by yahoo-finance.snapshot.
 */
function stocks(app, frontend, symbol) {
  app.use("/stockticker", express.static(__dirname + '/client/'));

  stockData.interval = getStockDataAtInterval(symbol, updateInterval);
  frontend.io.on("connection", function(client) {
    stockData.on("updated", function(snapshot) {
      client.trigger("dataupdate", {
        lastStockSnapshot: snapshot
      });
    })


    client.on("userinput", function(data) {
      //console.log("yeaiii user inputted %s", JSON.stringify(data));
    })
  });
}

function getStockDataAtInterval(symbol, updateInterval) {
  return setInterval(function GetAndEmitYahooFinance() {
    finance.snapshot({
      symbol: symbol,
      // http://search.cpan.org/~edd/Finance-YahooQuote/YahooQuote.pm#The_available_custom_fields
      fields: ['s', 'n', 'd1', 't1', 'l1', 'y', 'r'],
    }, function onSnapshot(err, snapshot) {
      if (err) {
        return console.error(err);
      }
      // if (lastSnapshot.lastTradeTime == snapshot.lastTradeTime &&
      //  lastSnapshot.lastTradeDate == snapshot.lastTradeDate) {
      //   return;
      // }
      // if (stockData.lastSnapshot.lastTradePriceOnly == snapshot.lastTradePriceOnly) {
      //   return;
      // }

      stockData.lastSnapshot = snapshot;
      stockData.emit("updated", snapshot)
    });

  }, updateInterval);

}