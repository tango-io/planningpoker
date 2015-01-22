'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $http, socket, $location, userService) {

  $scope.startSession = function(){
    socket.socket.emit('newSession', $scope.username);
  };

  socket.socket.on('sessionCreated', function(sessionId){
    userService.setUser({username: $scope.username});
    $location.path('/sessions/' + sessionId);
  });

  $scope.joinSession = function(){
    userService.setUser({username: $scope.username_});
    $location.path('/sessions/' + $scope.sessionId);
  };
});
