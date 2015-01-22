'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $location, $routeParams, $modal, userService) {
  $scope.init = function(){
    $scope.url = $location.$$absUrl;
    $scope.socket = socket.socket;
    $scope.voteValues = [0,1,2,3,5,8,13];
    $scope.sessionId = $routeParams.id;
    $scope.votes = {};
    $scope.currentUser = {};
    $scope.username = userService.getUser().username;

    if($scope.username){
     $scope.socket.emit('joinSession', {username: $scope.username, id: $scope.sessionId});
    }else{
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/username.html', keyboard:false});
      modalInstance.result.then(function (username) {
        $scope.username = username;
        $scope.socket.emit('joinSession', {username: $scope.username, id: $scope.sessionId});
      });
    }

    $scope.socket.on('joinedSession', function(data){
      $scope.id  = data.id;
      $scope.description = data.description;
    });

    $scope.socket.on('updateUsers', function(data){
      $scope.users = data.users;
      $scope.currentUser = _.findWhere(data.users, {socketId: $scope.id});
    });

    $scope.socket.on('descriptionUpdated', function(description){
      $scope.description = description;
    });

    $scope.socket.on('updateVotes', function(votes){
      $scope.votes = votes;
      $scope.points = _.groupBy(votes);
      $scope.consensus = _.keys($scope.points).length == 1 ? true : false;
    });

    $scope.socket.on('clearVotes', $scope.clearSession);
  };

  $scope.updateDescription = function(){
    $scope.socket.emit('updateDescription', {id: $scope.sessionId, description: $scope.description});
  };

  $scope.revealVotes = function(){
    $scope.socket.emit('revealVotes', {id: $scope.sessionId});
  };

  $scope.clearVotes = function(){
    $scope.clearSession();
    $scope.socket.emit('clearSession', {id: $scope.sessionId});
  };

  $scope.clearSession = function(){
    $scope.description = "";
    $scope.consensus = false;
    $scope.points = false;
    $scope.users  = _.map($scope.users, function(u){ u.voted = false; return u;});
    $scope.votes = {};
  };

  $scope.setVote = function(vote){
    $scope.currentUser.voted = true;
    $scope.votes[$scope.id] = vote;
    $scope.socket.emit('vote', {id:$scope.sessionId, userId: $scope.id, vote:vote});
  };
});
