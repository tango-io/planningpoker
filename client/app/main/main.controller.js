'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $location, userService) {

  $scope.init = function(){
    userService.setUser({username: ""});
    $scope.username = "";
  };

  $scope.startSession = function(){
    if($scope.username){
      userService.setUser({username: $scope.username});
      $location.path('/voteValues');
    }else{
      $scope.submitted = true;
    }
  };

  $scope.joinSession = function(){
    if($scope.username_ && $scope.sessionId){
      userService.setUser({username: $scope.username_});
      $location.path('/sessions/' + $scope.sessionId);
    }else{
      $scope.submitted_ = true;
    }
  };
});
