'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $location, $routeParams, $modal, userService) {
  $scope.init = function(){
    $scope.voteValues  = userService.getVoteValues(); //get default points
    $scope.sessionId   = $routeParams.id;
    $scope.socket      = socket.socket;
    $scope.votes       = {};
    $scope.currentUser = userService.getUser();

    if($scope.currentUser.username){
     $scope.currentUser.roomId = $scope.sessionId;
     $scope.socket.emit('joinSession', $scope.currentUser);
    }else{
      $scope.userType = "player";//default option in modal
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/username.html', keyboard:false, scope: this});
      modalInstance.result.then(function (data) {
        $scope.currentUser = {username: data.username, type: data.type};
        $scope.socket.emit('joinSession', {username: $scope.currentUser.username, id: $scope.sessionId, type: data.type});
      });
    }

    $scope.socket.on('clearVotes',         $scope.clearSession);
    $scope.socket.on('descriptionUpdated', $scope.listeners.onDescriptionUpdated);
    $scope.socket.on('joinedSession',      $scope.listeners.onJoinedSession);
    $scope.socket.on('updateUsers',        $scope.listeners.onUpdateUsers);
    $scope.socket.on('hideVotes',          $scope.listeners.onHideVotes);
    $scope.socket.on('updateVotes',        $scope.listeners.onUpdateVotes);
    $scope.socket.on('errorMsg',           $scope.listeners.onError);
  };

  $scope.listeners = {
    onDescriptionUpdated: function(description){
      $scope.description = description;
    },

    onJoinedSession: function (data){
      $scope.currentUser.id  = data.id;
      $scope.description = data.description;
      $scope.voteValues = data.voteValues;
    },

    onUpdateUsers:  function (data){
      $scope.players = data.players;
      $scope.moderators = data.moderators;
      //
      $scope.currentUser = _.findWhere(_.union(data.players, data.moderators), {id: $scope.currentUser.id});
    },

    onError: function(){
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/error.html', keyboard:false});
      modalInstance.result.then(function () {
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
    if($scope.type == 'moderator'){
      $scope.socket.emit('updateDescription', {id: $scope.sessionId, description: $scope.description});
    }
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
      $scope.votes[$scope.currentUser.id] = vote;
      $scope.socket.emit('vote', {id:$scope.sessionId, userId: $scope.currentUser.id, vote:vote});
    }
  };

  $scope.$on('$locationChangeStart', function (event, next, current) {
    $scope.socket.emit('leaveSession');
  });
});
