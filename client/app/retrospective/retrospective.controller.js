'use strict';

angular.module('pokerestimateApp')
.controller('RetrospectiveCtrl', function ($scope, socket, $location, userService, $routeParams, $modal, $timeout, $modalStack) {
  var modalPath = 'app/templates/modals/';

  $scope.init = function(){
    $scope.currentUser = userService.getUser(); //get user name and type
    $scope.url         = $location.$$absUrl;// Url to share with the team
    $scope.sessionId   = $routeParams.id;
    $scope.inputMode   = {};
    $scope.newEntry    = {};

    if(userService.getUser().username){
      socket.emit('joinSession', {roomId: $scope.sessionId, username: $scope.currentUser.username, type: $scope.currentUser.type, sessionType: 'retrospective'});
    }else{
      //open modal to ask for username and type when user joins
      $scope.userType = "player"; //default option in modal
      var modalInstance = $modal.open({templateUrl: modalPath + 'username.html', keyboard:false, backdrop: 'static', scope: this, windowClass:'small'});
      modalInstance.result.then(function (data) {
        $scope.currentUser = {username: data.username, type: data.userType};
        socket.emit('joinSession', {roomId: $scope.sessionId, username: data.username, type: data.userType, sessionType: 'retrospective'});
      });
    }

    socket.on('joinedSession',    $scope.listeners.onJoinedSession);
    socket.on('updateUsers',      $scope.listeners.onUpdateUsers);
    socket.on('errorMsg',         $scope.listeners.onError);
    socket.on('reveal',           $scope.listeners.onReveal);
    socket.on('hide',             $scope.listeners.onHide);
    socket.on('newEntry',         $scope.listeners.onNewEntry);
    socket.on('deleteEntry',      $scope.listeners.onDeleteEntry);
    socket.on('updateEntry',      $scope.listeners.onUpdateEntry);
    socket.on('moveCurrentEntry', $scope.listeners.onMoveCurrentEntry);
    socket.on('openEntry',        $scope.listeners.onOpenEntry);
    socket.on('updateEntries',    $scope.listeners.onUpdateEntries);
    socket.on('closeEntry',       $scope.listeners.onCloseEntry);
    socket.on('disconnect',       $scope.listeners.onDisconnect);
  };

  $scope.add = function(type){
    if($scope.newEntry[type]){ //avoid empty values

      var entry = {
        id: $scope.session[type].length,
        text: $scope.newEntry[type],
        username: $scope.currentUser.username,
        userId: $scope.currentUser.id,
      };

      $scope.session[type].push(entry);
      socket.emit('newEntry', {id: $scope.sessionId, entry: entry, type: type});
      $scope.newEntry[type] = "";
    }
  };

  $scope.remove = function(type, entry){
    socket.emit('deleteEntry', {id: $scope.sessionId, type: type, entry: entry});
    $scope.session[type] =  _.without($scope.session[type], entry);
  };

  $scope.edit = function(type, entry){
    $scope.currentEntry = angular.copy(entry);
    $scope.entryType = type;
    var modalInstance = $modal.open({templateUrl: modalPath + 'editEntry.html', keyboard:false, backdrop: 'static', scope: this, windowClass:'small'});
    modalInstance.result.then(function (data) {
      entry.text = data.currentEntry.text;
      $scope.update(entry);
    });
  };

  $scope.update = function(entry){
    socket.emit('updateEntry', {id: $scope.sessionId, entry: entry, entryType: $scope.entryType});
  };

  $scope.openEntry = function(type, entry){
    $scope.modalTitle = "";
    switch(type){
      case 'good':
        $scope.modalTitle = "We should start doing...";
        break;
      case 'bad':
        $scope.modalTitle = "We should stop doing...";
        break;
      case 'improvements':
        $scope.modalTitle = "We should continue doing...";
        break;
    };

    if($scope.currentUser.type == "moderator" && $scope.showForOthers){
      socket.emit('openEntry', {id: $scope.sessionId, entry: entry, modalTitle: $scope.modalTitle});
    }

    $scope.currentEntry = entry;
    $scope.entryType    = type;

    $scope.entryModal = $modal.open({templateUrl: modalPath + 'showEntry.html', keyboard:false,  backdrop: 'static', scope: this, windowClass:'small'});

    $scope.entryModal.result.then(function (data) {
      if($scope.currentUser.type == "moderator" && $scope.showForOthers){
        socket.emit('closeEntry', {id: $scope.sessionId});
      }
    });
  };

  $scope.setCopyMsg = function(msg){
    $scope.copyMsg = msg;
  };

  $scope.toggleRead = function(entry){
    entry.read = !entry.read;
    $scope.update(entry);
  };

  $scope.toggleInputMode = function(type){
    $scope.inputMode[type] = !$scope.inputMode[type];
  };

  $scope.toggleReviewMode = function(){
    $scope.reviewMode = !$scope.reviewMode;
    if($scope.reviewMode){
      socket.emit('reveal', {id: $scope.sessionId});
    }else{
      socket.emit('hide', {id: $scope.sessionId});
    }
  };

  function getRetrospectiveData(data){
    if(!data){return false; }
    return {good: hideText(data.good), bad: hideText(data.bad), improvements: hideText(data.improvements)}
  };

  function hideText(data){
    var entry;
    return _.map(data, function(value){
      if(value.userId != $scope.currentUser.id){
        entry = _.clone(value);
        entry.text = '';
        return entry;
      }else{
        return value;
      }
    }) || [];
  };

  $scope.next = function(entry){
    var type  = $scope.entryType;
    var index = _.indexOf($scope.session[type], entry);

    if(index != -1 && $scope.session[type][index + 1]){
      $scope.currentEntry = $scope.session[type][index + 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: type, index: index + 1});
    }
  };

  $scope.previous = function(entry){
    var type  = $scope.entryType;
    var index = _.indexOf($scope.session[type], entry);

    if(index != -1 && $scope.session[type][index - 1]){
      $scope.currentEntry = $scope.session[type][index - 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: type, index: index - 1});
    }
  };

  //remove user from room when they leave the page
  $scope.$on('$locationChangeStart', function (event, next, current) {
    $modalStack.dismissAll();
    socket.emit('leaveSession');
  });

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

    onNewEntry:  function(data){
      $scope.session[data.type].push({text: '', username: data.username});
    },

    onReveal: function(data){
      $scope.session = data.session;
      $scope.reviewMode = true;
    },

    onHide: function(data){
      $scope.reviewMode = false;
      $scope.session  = getRetrospectiveData($scope.session);
    },

    onDeleteEntry: function(data){
      if(!data){ return false;}
      $scope.session[data.type] =  _.reject($scope.session[data.type], {id: data.entry.id});
    },

    onOpenEntry: function(data){
      $scope.currentEntry = data.entry;
      $scope.modalTitle = data.modalTitle;
      $scope.entryModal = $modal.open({templateUrl: modalPath + 'showEntry.html', keyboard:false,  backdrop: 'static', scope: $scope, windowClass:'small'});
    },

    onCloseEntry: function(data){
      $scope.entryModal.close();
    },

    onMoveCurrentEntry: function(data){
      $scope.currentEntry = $scope.session[data.type][data.index];
    },

    onUpdateEntry: function(data){
      if(!data){ return false;}

      var entry = _.findWhere($scope.session[data.entryType], {id: data.entry.id});
      entry.read = data.entry.read;
      if($scope.reviewMode){
        entry.text = data.entry.text;
        $scope.currentEntry = data.entry;
        $scope.entryType    = data.entryType;
      }
    },

    onUpdateEntries: function(data){
      $scope.session =  $scope.reviewMode ? $scope.session : getRetrospectiveData(data);
    },

    onError: function(){
      var modalInstance = $modal.open({templateUrl:  modalPath + 'error.html', keyboard:false,  backdrop: 'static', windowClass:'small'});
      modalInstance.result.then(function () {
        $location.path("/");
      });
    },

    onDisconnect: function(){
     $modal.open({templateUrl: 'app/templates/modals/reconnect.html',  backdrop: 'static', windowClass:'small'});
    }
  };
});
