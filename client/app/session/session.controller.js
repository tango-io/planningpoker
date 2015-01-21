'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $routeParams) {

  $scope.init = function(){
    $scope.socket = socket.socket;
    $scope.username = 'asd' + _.random(20);
    $scope.voteValues = [0,1,2,3,5,8,13];
    $scope.sessionId = $routeParams.id;
    $scope.votes = {};
    $scope.currentUser = {};
    $scope.socket.emit('joinSession', {username: $scope.username, id: $scope.sessionId});

    $scope.socket.on('joinedSession', function(id){
      $scope.id  = id;
    });

    $scope.socket.on('updateUsers', function(data){
      $scope.users = data.users;
      $scope.currentUser = _.findWhere(data.users, {socketId: $scope.id});
    });

    $scope.socket.on('descriptionUpdated', function(description){
      $scope.description = description;
    });
  };

  $scope.updateDescription = function(){
    $scope.socket.emit('updateDescription', {id: $scope.sessionId, description: $scope.description});
  };

  //$scope.clearValues = function(){
  //  $scope.voteValues = [];
  //  $scope.storyDescription = "";
  //  //$scope.players = _.map($scope.players, function(player){ return _.omit(player, 'vote', 'voted'); });
  //};

  $scope.setVote = function(vote){
    $scope.currentUser.voted = true;
    $scope.votes[$scope.id] = vote;
    $scope.socket.emit('vote', {id:$scope.sessionId, userId: $scope.id});
  };
});
