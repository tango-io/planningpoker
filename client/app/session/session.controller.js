'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $location, $routeParams, $modal, userService, $rootScope) {
  $scope.init = function(){
    $scope.url = $location.$$absUrl;
    $scope.socket = socket.socket;
    $scope.voteValues = userService.getVoteValues();
    $scope.sessionId = $routeParams.id;
    $scope.votes = {};
    $scope.currentUser = {};
    $scope.username = userService.getUser().username;
    $scope.userType = userService.getUser().userType;

    if($scope.username){
     $scope.socket.emit('joinSession', {username: $scope.username, id: $scope.sessionId, userType: $scope.userType});
    }else{
      $scope.userType = "player";
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/username.html', keyboard:false, scope: this});
      modalInstance.result.then(function (username) {
        $scope.username = username;
        $scope.socket.emit('joinSession', {username: $scope.username, id: $scope.sessionId});
      });
    }

    $scope.socket.on('clearVotes', $scope.clearSession);
    $scope.socket.on('descriptionUpdated', function(description){ $scope.listeners.onDescriptionUpdated(description)});
    $scope.socket.on('joinedSession', function(data){ $scope.listeners.onJoinedSession(data)});
    $scope.socket.on('updateUsers', function(data){ $scope.listeners.onUpdateUsers(data)});
    $scope.socket.on('hideVotes', function(){ $scope.listeners.onHideVotes()});
    $scope.socket.on('updateVotes', function(votes){ $scope.listeners.onUpdateVotes(votes)});
    $scope.socket.on('errorMsg', function(){ $scope.listeners.onError() });
  };

  $scope.listeners = {
    onDescriptionUpdated: function(description){
      $scope.description = description;
    },

    onJoinedSession: function (data){
      $scope.id  = data.id;
      $scope.description = data.description;
      $scope.voteValues = data.voteValues;
    },

    onUpdateUsers:  function (data){
      $scope.players = data.players;
      $scope.observers = data.observers;
      $scope.currentUser = _.findWhere(_.join(data.players, data.observers), {socketId: $scope.id});
    },

    onError: function(){
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/error.html', keyboard:false});
      modalInstance.result.then(function (username) {
        $location.path("/");
      });
    },

    onHideVotes: function(){
      $scope.showVotes = false;
    },

    onUpdateVotes: function(votes){
      $scope.showVotes = _.isEmpty(votes) ? false : true;
      $scope.votes = votes;
      $scope.points = _.groupBy(votes);
      $scope.consensus = _.keys($scope.points).length == 1 && _.keys(votes).length > 1 ? true : false;
    }
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
    $scope.players  = _.map($scope.players, function(u){ u.voted = false; return u;});
    $scope.votes = {};
    $scope.showVotes = false;
  };

  $scope.setVote = function(vote){
    if(!$scope.showVotes){
      $scope.currentUser.voted = true;
      $scope.votes[$scope.id] = vote;
      $scope.socket.emit('vote', {id:$scope.sessionId, userId: $scope.id, vote:vote});
    }
  };

  $scope.$on('$locationChangeStart', function (event, next, current) {
    $scope.socket.emit('leaveSession');
  });
});
