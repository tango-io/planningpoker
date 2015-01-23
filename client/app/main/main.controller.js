'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $http, socket, $location, userService) {
  $scope.init = function(){
    userService.setUser({username: null});
    $scope.username = "";
  };

  $scope.startSession = function(){
    if($scope.username){
      userService.setUser({username: $scope.username});
      socket.socket.emit('newSession');
    }else{
      $scope.submitted = true;
    }
  };

  socket.socket.on('sessionCreated', function(sessionId){
    $location.path('/sessions/' + sessionId);
  });

  $scope.joinSession = function(){
    if($scope.username_ && $scope.sessionId){
      userService.setUser({username: $scope.username_});
      $location.path('/sessions/' + $scope.sessionId);
    }else{
      $scope.submitted_ = true;
    }
  };
});
