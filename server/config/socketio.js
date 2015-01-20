/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var bcrypt = require('bcrypt');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // Insert sockets below
  require('../api/thing/thing.socket').register(socket);
}

var rooms = {};

module.exports = function (socketio) {
  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    socket.on('updateDescription', function (data) {
      socketio.to(data.id).emit('descriptionUpdated', data.description);
    });

    socket.on('newSession', function (data) {
      var roomId = bcrypt.hashSync(new Date().toString(), 1);
      socket.join(roomId);
      rooms[roomId] = rooms[roomId] || [];
      rooms[roomId].push({username: data, socketId: socket.id});
      socket.emit('sessionCreated', roomId);
      socket.emit('updateUsers', rooms[roomId]);
    });

    socket.on('joinSession', function (data) {
      socket.join(data.id);
      rooms[data.id] = rooms[data.id] || [];
      rooms[data.id].push({username: data.username, socketId: socket.id});
      socketio.to(data.id).emit('updateUsers', rooms[data.roomId]);
    });

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.log("disconnected");
    });

    // Call onConnect.
    onConnect(socket);
  });
};
