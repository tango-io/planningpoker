'use strict';

angular.module('pokerestimateApp')
.controller('RetrospectiveCtrl', function ($scope, socket, $location, userService, $routeParams, $modal) {
  $scope.init = function(){
    $scope.url         = $location.$$absUrl;// Url to share with the team
    $scope.currentUser = userService.getUser(); //get user name and type
    $scope.sessionId   = $routeParams.id;

    if(userService.getUser().username){
      $scope.currentUser.roomId = $scope.sessionId;
      socket.emit('joinSession', $scope.currentUser);
    }else{
      //open modal to ask for username and type when user joins
      $scope.userType = "player"; //default option in modal
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/username.html', keyboard:false, scope: this});
      modalInstance.result.then(function (data) {
        $scope.currentUser = {username: data.username, type: data.userType};
        socket.emit('joinSession', {roomId: $scope.sessionId, username: data.username, type: data.userType});
      });
    }
  };

  $scope.listeners = {
    onJoinedSession: function (data){
      // Set previous data from room
      $scope.currentUser.id  = data.id;
      $scope.session = data.session;
    },

    onUpdateUsers:  function (data){
      $scope.players = data.players;
      $scope.moderators = data.moderators;
      //Need this to update player list when they vote
      $scope.currentUser = _.findWhere(_.union(data.players, data.moderators), {id: $scope.currentUser.id});
    }
  };

  socket.on('joinedSession', $scope.listeners.onJoinedSession);
  socket.on('updateUsers',   $scope.listeners.onUpdateUsers);

});
