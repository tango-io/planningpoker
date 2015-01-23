/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var uuid = require('node-uuid');
var _ = require('lodash');

function onConnect(socket, io) {
  require('../components/sockets/main').register(socket, io);
}

module.exports = function (socketio) {

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();
    onConnect(socket, socketio);
  });
};
