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
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.log("hereeeeeeeeeeeeeeeee");;
    //console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

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

    socket.on('newSession', function (data) {
      var roomId = bcrypt.hashSync(new Date().toString(), 1);
      socket.join(roomId);
      rooms[roomId] = rooms[roomId] || [];
      rooms[roomId].push({username: data, socketId: socket.id});
    });

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
    console.log("disconnected");
      //console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.log("connected");
    //console.info('[%s] CONNECTED', socket.address);
  });
};
