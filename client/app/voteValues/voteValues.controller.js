'use strict';

angular.module('pokerestimateApp')
  .controller('VoteValuesCtrl', function ($scope, userService, $location, socket) {
    $scope.init = function(){
      $scope.voteValues = [
        {label: 0, value: 0},
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 5, value: 5},
        {label: 8, value: 8},
        {label: 13, value: 13},
        {label: ':/', value: '?'},
        {label: 'Break', value: 'need a break'}
      ];

      $scope.newVote = { label: null , value: null };
    };

    $scope.go = function(){
     userService.setVoteValues($scope.voteValues);
     socket.emit('newSession', $scope.voteValues);
    };

    $scope.removeValue = function(vote){
      $scope.voteValues = _.without($scope.voteValues, vote);
    };

    $scope.addValue= function(value){
      $scope.voteValues.push(value);
      $scope.newVote = { label: null , value: null };
    };
  });
