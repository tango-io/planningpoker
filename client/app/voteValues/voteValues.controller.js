'use strict';

angular.module('pokerestimateApp')
  .controller('VoteValuesCtrl', function ($scope, $routeParams, userService, $location, socket) {
    $scope.init = function(){
      $scope.voteValues = [
        {label: 0, value: 0},
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 5, value: 5},
        {label: 8, value: 8},
        {label: 13, value: 13}
      ];
    };

    $scope.go = function(){
     userService.setVoteValues($scope.voteValues);
     socket.socket.emit('newSession', $scope.voteValues);
    };

    socket.socket.on('sessionCreated', function(sessionId){
     $location.path('/sessions/' + sessionId);
    });


    $scope.removeValue = function(value){
      $scope.voteValues = _.reject($scope.voteValues, {value: value});
    };
  });
