'use strict';

angular.module('pokerestimateApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
      //socket.syncUpdates('thing', $scope.awesomeThings);
      //socket.unsyncUpdates('thing');
      $scope.startSession = function(){
        socket.socket.emit('newSession', 'Xaid');
      };
  });
