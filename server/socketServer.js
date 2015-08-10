/**
 * WebSocket server for real-time client-server communication.
 * You can require this config file in your controllers and start sending WebSocket messages to connected clients.
 * See /controllers directory for sample usage.
 */

var WebSocketServer = require('ws').Server,
    url = require('url'),
    _ = require('lodash');

/**
 * Creates and attaches a WebSocket server to a given HTTP server with the same host URI.
 * @param server Node.js HTTP server instance.
 * @returns {WebSocketServer}
 */
exports.listen = function (server) {
  console.log('will listen ws');

  // create a new WebSocket server and start listening on the same port as the given http server but with ws:// protocol
  var wss = new WebSocketServer({server: server});

  // WebSocket event that is fired when a new client is validated and connected
  wss.on('connection', function (ws) {
    var user = ws.upgradeReq.user;
    console.log('A new WebSocket client connected');

    // associate connecting user ID with WebSocket connection in the clients dictionary
    exports.clients.push(ws);

    ws.on('close', function () {
      console.log('A WebSocket client disconnected.');

      var index = exports.clients.indexOf(ws);
      exports.clients.splice(index, 1);

    });

    ws.on('error', function (err) {
      console.log('A WebSocket error occurred: %s', err);
    });

    ws.on('message', function (data) {
      if (data !== 'ping') {
        console.log('An unexpected WebSocket message received from client with data: %s', JSON.parse(data));
      }
    });
  });

  exports.wss = wss;
  return wss;
};

/**
 * Dictionary (array of arrays) to math connected user IDs with connected clients (i.e. one user might be connected from multiple devices).
 * Array index is the client ID and the stored value is also an array with socket client objects. i.e. clients[33452234]: [ws1, ws2, ws3...]
 */
exports.clients = [];

/**
 * A JSON-RPC 2.0 implementation over WebSockets. Sends a one way notifications to all designated recipients with given data and method.
 * @param recipients - Array of user IDs to send the data to. Only the online clients receive the data out of the entire given recipient list. If omitted, all users will receive the message.
 * @param method - Remote method to execute in the connected client.
 * @param params - Array or object containing method parameters as defined in JSON-RPC 2.0 specs.
 */
exports.notify = function (method, params) {
  var recipients = exports.clients;

  var data = JSON.stringify({jsonrpc: '2.0', method: method, params: params});

  // send the data to only the online recipients
  var send = function (client) {
    client.send(data, function (err) {
      // if error is null, the send has been completed
      if (err) {
        console.log('A WebSocket error occurred: %s', err);
      }
    });
  };

  function sendMessageCallback (err) {
    // if error is null, the send has been completed
    if (err) {
      console.log('A WebSocket error occurred: %s', err);
    }
  }

  for (var i = 0; i < recipients.length; i++) {
    var client = recipients[i];
    client.send(data, sendMessageCallback);
  }
};
