'use strict';

angular.module('pokerestimateApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
      //socket.syncUpdates('thing', $scope.awesomeThings);
      //socket.unsyncUpdates('thing');
      $scope.startSession = function(){
        console.log("_haisdhasd", socket.socket);
        socket.socket.emit('newSession', 'Xaid')
      };
  });
