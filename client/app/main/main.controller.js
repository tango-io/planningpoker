'use strict';

angular.module('pokerestimateApp')
.controller('MainCtrl', function ($scope, $location, userService, socket) {

  //Setting default options and clearing user in userservice
  $scope.init = function(){
    $scope.sessionType  = "pointing";
    $scope.currentUser  = {username:"", type:"player"};
    $scope.currentUser_ = {username:"", type:"player"};
    userService.setUser($scope.currentUser);
  };

  $scope.startSession = function(){
    if($scope.currentUser.username){
      userService.setUser($scope.currentUser);

      if($scope.sessionType == "pointing"){
        $location.path("/voteValues");
      }else{
        socket.emit('newSession', 'retrospective');
      }
    }else{
      //Set submitted to true to show form errors in start form
      $scope.submitted = true;
    }
  };

  $scope.joinSession = function(){
    var url = ($scope.sessionType == "pointing" ? '/sessions/' : '/retrospectives/') + $scope.sessionId;
    if($scope.currentUser_.username && $scope.sessionId){
      userService.setUser($scope.currentUser_);
      $location.path(url);
    }else{
      //Set submitted_ to true to show errors in join form
      $scope.submitted_ = true;
    }
  };

  //Redirect to retrospective page after create a session
  socket.on('sessionCreated', function (roomId){
    $location.path('retrospectives/' + roomId);
  });

});
