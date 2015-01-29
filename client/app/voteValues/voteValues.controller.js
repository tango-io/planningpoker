'use strict';

angular.module('pokerestimateApp')
  .controller('VoteValuesCtrl', function ($scope, $routeParams, userService, $location) {
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
     $location.path('/sessions/' + $routeParams.id);
    };

    $scope.removeValue = function(value){
      $scope.voteValues = _.reject($scope.voteValues, {value: value});
    };
  });
