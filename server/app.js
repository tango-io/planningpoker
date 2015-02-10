/**
 * Main application file
 */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config  = require('./config/environment');

// Setup server
var app    = express();
var server = require('http').createServer(app);

var socketio = require('socket.io')(server, {
  serveClient: (config.env != 'development' && config.env != 'test') ? false : true,
  path: '/socket.io-client'
});

require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
