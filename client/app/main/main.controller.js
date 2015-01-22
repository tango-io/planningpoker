'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $http, socket, $location, userService) {

  $scope.startSession = function(){
    socket.socket.emit('newSession', $scope.username);
  };

  socket.socket.on('sessionCreated', function(sessionId){
    $location.path('/sessions/' + sessionId);
    userService.setUser({username: $scope.username});
  });
});
