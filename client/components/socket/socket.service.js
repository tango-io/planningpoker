'use strict';

angular.module('pokerestimateApp')
.factory('socket', function(socketFactory) {

  var ioSocket = io('', {
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket: ioSocket
  });

  return {
    socket: socket
  }
});
