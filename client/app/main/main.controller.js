'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $location, userService) {

  //Setting default options and clearing user in userservice
  $scope.init = function(){
    $scope.currentUser  = {username:"", type:"player"};
    $scope.currentUser_ = {username:"", type:"player"};
    userService.setUser($scope.currentUser);
  };

  $scope.startSession = function(){
    if($scope.currentUser.username){
      userService.setUser($scope.currentUser);
      $location.path('/voteValues');
    }else{
      //Set submitted to true to show form errors in start form
      $scope.submitted = true;
    }
  };

  $scope.joinSession = function(){
    if($scope.currentUser_.username && $scope.sessionId){
      userService.setUser($scope.currentUser_);
      $location.path('/sessions/' + $scope.sessionId);
    }else{
      //Set submitted_ to true to show errors in join form
      $scope.submitted_ = true;
    }
  };
});
