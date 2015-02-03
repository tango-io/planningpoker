'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $location, userService) {

  $scope.init = function(){
    userService.setUser({username: ""});
    $scope.username = "";
    $scope.userType = "player";
  };

  $scope.startSession = function(){
    if($scope.username){
      userService.setUser({username: $scope.username, userType: $scope.userType});
      $location.path('/voteValues');
    }else{
      $scope.submitted = true;
    }
  };

  $scope.joinSession = function(){
    if($scope.username_ && $scope.sessionId){
      userService.setUser({username: $scope.username_, userType: $scope.userType_});
      $location.path('/sessions/' + $scope.sessionId);
    }else{
      $scope.submitted_ = true;
    }
  };
});
