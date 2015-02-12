'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $location, userService) {

  //Setting default options and clearing user in userservice
  $scope.init = function(){
    userService.setUser({username: ""});
    $scope.username = "";
    $scope.userType = "player";
    $scope.userType_ = "player";
  };

  $scope.startSession = function(){
    if($scope.username){
      userService.setUser({username: $scope.username, userType: $scope.userType});
      $location.path('/voteValues');
    }else{
      //Set submitted to true to show form errors in start form
      $scope.submitted = true;
    }
  };

  $scope.joinSession = function(){
    if($scope.username_ && $scope.sessionId){
      userService.setUser({username: $scope.username_, userType: $scope.userType_});
      $location.path('/sessions/' + $scope.sessionId);
    }else{
      //Set submitted_ to true to show errors in join form
      $scope.submitted_ = true;
    }
  };
});
