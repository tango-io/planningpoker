'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $routeParams) {

  $scope.socket = socket.socket;
  $scope.voteValues = [0,1,2,3,5,8,13];
  $scope.sessionId = $routeParams.id;

  $scope.username = 'asd';
  $scope.socket.emit('joinSession', {username: $scope.username, session: $scope.sessionId});

  $scope.socket.on('descriptionUpdated', function(description){
    $scope.description = description;
  });

  $scope.socket.on('updateUsers', function(users){
    $scope.users = users;
  });

  $scope.updateDescription = function(){
    $scope.socket.emit('updateDescription', $scope.description);
  }

  $scope.clearValues = function(){
    $scope.voteValues = [];
    $scope.storyDescription = "";
    //$scope.players = _.map($scope.players, function(player){ return _.omit(player, 'vote', 'voted'); });
  };

  $scope.setVote = function(vote){
    $scope.vote = vote;
  };
});
