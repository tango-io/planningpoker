'use strict';

angular.module('pokerestimateApp')
.controller('SessionCtrl', function (socket, $scope, $location, $routeParams, $modal, userService, $modalStack) {
  $scope.init = function(){
    $scope.url         = $location.$$absUrl;// Url to share with the team
    $scope.voteValues  = userService.getVoteValues(); //get default points
    $scope.currentUser = userService.getUser(); //get user name and type
    $scope.sessionId   = $routeParams.id;
    $scope.votes       = {};

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

    socket.on('clearVotes',         $scope.clearSession);
    socket.on('descriptionUpdated', $scope.listeners.onDescriptionUpdated);
    socket.on('joinedSession',      $scope.listeners.onJoinedSession);
    socket.on('updateUsers',        $scope.listeners.onUpdateUsers);
    socket.on('hideVotes',          $scope.listeners.onHideVotes);
    socket.on('updateVotes',        $scope.listeners.onUpdateVotes);
    socket.on('errorMsg',           $scope.listeners.onError);
    socket.on('disconnect',         $scope.listeners.onDisconnect);
  };

  $scope.listeners = {
    onDescriptionUpdated: function(description){
      $scope.description = description;
    },

    onJoinedSession: function (data){
      // Set previous data from room
      $scope.currentUser.id  = data.id;
      $scope.description = data.description;
      $scope.voteValues = data.voteValues;
    },

    onUpdateUsers:  function (data){
      $scope.players = data.players;
      $scope.moderators = data.moderators;
      //Need this to update player list when they vote
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
      $scope.votes = votes;
      //Group points to get number of votes for each point
      $scope.showVotes = _.isEmpty(votes) ? false : true; //Show or hide statics  depending of existance of botes
      $scope.points    = _.groupBy(votes);

      //Show unanimous message only when all votes match and is more than one player
      $scope.showDetailsMsg = _.keys(votes).length > 1;
      $scope.unanimous      = _.keys($scope.points).length == 1 && $scope.showDetailsMsg ? true : false;
    },

    onDisconnect: function(){
     $modal.open({templateUrl: 'app/templates/modals/reconnect.html'});
    }
  };

  $scope.updateDescription = function(){
    if($scope.currentUser.type == 'moderator'){
      socket.emit('updateDescription', {id: $scope.sessionId, description: $scope.description});
    }
  };

  $scope.revealVotes = function(){
    socket.emit('revealVotes', {id: $scope.sessionId});
  };

  $scope.clearVotes = function(){
    $scope.clearSession();
    socket.emit('clearSession', {id: $scope.sessionId});
  };

  $scope.clearSession = function(){
    $scope.players     = _.map($scope.players, function(u){ u.voted = false; return u;});
    $scope.description = "";
    $scope.unanimous   = false;
    $scope.points      = false;
    $scope.votes       = {};
    $scope.showVotes   = false;
  };

  $scope.setVote = function(vote){
    //Users can't change vote after all users voted
    if(!$scope.showVotes){
      $scope.currentUser.voted = true;
      $scope.votes[$scope.currentUser.id] = vote;
      socket.emit('vote', {id:$scope.sessionId, userId: $scope.currentUser.id, vote:vote});
    }
  };

  $scope.setCopyMsg = function(msg){
    $scope.copyMsg = msg;
  };

  //remove user from room when they leave the page
  $scope.$on('$locationChangeStart', function (event, next, current) {
    $modalStack.dismissAll();
    socket.emit('leaveSession');
  });
});
