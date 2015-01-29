'use strict';

angular.module('pokerestimateApp')
  .controller('VoteValuesCtrl', function ($scope) {
    //$location.path('/sessions/' + $scope.sessionId);
    $scope.init = function(){
      $scope.voteValues = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        5: 4,
        8: 5,
        13: 13
      };
    }
  });
