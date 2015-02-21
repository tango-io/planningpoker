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
        socket.emit('joinSession', {roomId: $scope.sessionId, username: data.username, type: data.userType, sessionType: 'retrospective'});
      });
    }

    $scope.inputMode = {};
    $scope.newEntry = {};
  };

  $scope.add = function(type){
    if($scope.newEntry[type]){
      $scope.session[type].push({text: $scope.newEntry[type]});
      socket.emit('newMessage', {id: $scope.sessionId, text: $scope.newEntry[type], username: $scope.currentUser.username, type: type});
      $scope.newEntry[type] = "";
    }
  };

  $scope.toggleInputMode = function(type){
    $scope.inputMode[type] = !$scope.inputMode[type];
  };

  $scope.remove = function(type, entry){
    $scope.session[type] =  _.without($scope.session[type], entry);
  };

  $scope.edit = function(type, entry){
    $scope.editEntry = entry;
    var modalInstance = $modal.open({templateUrl: 'app/templates/modals/entry.html', keyboard:false, scope: this});
    modalInstance.result.then(function (data) {
      entry.text = data.editEntry.text;
    });
  };

  $scope.toggleRead = function(entry){
    entry.read = !entry.read;
    $scope.update(entry);
  };

  $scope.update = function(entry){
    socket.emit('updateEntry', {id: $scope.sessionId, entry: entry});
  };

  $scope.openEntry = function(entry){
    socket.emit('openEntry', {id: $scope.sessionId, entry: entry});
    $scope.editEntry = entry;
    var modalInstance = $modal.open({templateUrl: 'app/templates/modals/showEntry.html', keyboard:false, scope: this});

    modalInstance.result.then(function (data) {
      socket.emit('closeEntry', {id: $scope.sessionId});
    });
  };

  $scope.toggleReviewMode = function(){
    $scope.reviewMode = !$scope.reviewMode;
    if($scope.reviewMode){
      socket.emit('reveal', {id: $scope.sessionId});
    }else{
      socket.emit('hide', {id: $scope.sessionId});
    }
  };

  $scope.setCopyMsg = function(msg){
    $scope.copyMsg = msg;
  };

    function getRetrospectiveData(data){
      return {good: hideText(data.good), bad: hideText(data.bad), improvements: hideText(data.improvements)}
    };

    function hideText(data){
      var entry;
      return _.map(data, function(value){
        if(value.id != $scope.currentUser.id){
          entry = _.clone(value);
          entry.text = '________ (' + entry.username + ')';
          return entry;
        }else{
          return value;
        }
      }) || [];
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
    },

    onNewMessage:  function(data){
     $scope.session[data.type].push({text: "________ (" + data.username + ")", disabled: true});
    },

    onReveal: function(data){
      $scope.session = data.session;
      $scope.reviewMode = true;
    },

    onHide: function(data){
      //$scope.session = data.session;
      $scope.reviewMode = false;
      $scope.session  = getRetrospectiveData($scope.session);
    },


    onOpenEntry: function(data){
      $scope.editEntry = data.entry;
      $scope.entryModal = $modal.open({templateUrl: 'app/templates/modals/showEntry.html', keyboard:false, scope: $scope});
    },

    onCloseEntry: function(data){
      $scope.entryModal.close();
    },

    onEntryUpdated: function(e){
      var o = _.pick($scope.session, 'good', 'bad', 'improvements');
      var a = _.union(o.good, o.bad, o.improvements);
      var entry = _.findWhere(a, {text: e.text});
      entry.text = e.text;
      entry.read = e.read;
      if($scope.editEntry.text == e.text){
        $scope.editEntry.read = e.read;
      }
    },

    onError: function(){
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/error.html', keyboard:false});
      modalInstance.result.then(function () {
        $location.path("/");
      });
    }
  };

  socket.on('joinedSession', $scope.listeners.onJoinedSession);
  socket.on('updateUsers',   $scope.listeners.onUpdateUsers);
  socket.on('newMessage',    $scope.listeners.onNewMessage);
  socket.on('errorMsg',      $scope.listeners.onError);
  socket.on('reveal',        $scope.listeners.onReveal);
  socket.on('hide',          $scope.listeners.onHide);
  socket.on('openEntry',     $scope.listeners.onOpenEntry);
  socket.on('entryUpdated',  $scope.listeners.onEntryUpdated);
  socket.on('closeEntry',    $scope.listeners.onCloseEntry);
});
