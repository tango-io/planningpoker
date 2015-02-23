'use strict';

angular.module('pokerestimateApp')
.controller('RetrospectiveCtrl', function ($scope, socket, $location, userService, $routeParams, $modal, $timeout) {
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
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/username.html', keyboard:false, scope: this});
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
    socket.on('entryUpdated',     $scope.listeners.onEntryUpdated);
    socket.on('moveCurrentEntry', $scope.listeners.onMoveCurrentEntry);
    socket.on('openEntry',        $scope.listeners.onOpenEntry);
    socket.on('closeEntry',       $scope.listeners.onCloseEntry);
  };

  $scope.add = function(type){
    if($scope.newEntry[type]){
      var entry = {id: $scope.session[type].length, text: $scope.newEntry[type], username: $scope.currentUser.username, userId: $scope.currentUser.id};
      $scope.session[type].push(entry);
      socket.emit('newEntry', {id: $scope.sessionId, entry: entry, type: type});
      $scope.newEntry[type] = "";
    }
  };

  $scope.remove = function(type, entry){
    //if($scope.entryModal){ $scope.next(entry); }
    //if($scope.entryModal && $scope.session[type].length <= 1){
    //  $scope.entryModal.close();
    //}

    //$timeout(function(){
      socket.emit('deleteEntry', {id: $scope.sessionId, type: type, entry: entry});
      $scope.session[type] =  _.reject($scope.session[type], {id: entry.id});
    //}, 1000);
  };

  $scope.edit = function(type, entry){
    $scope.editEntry = entry.text;
    $scope.entryType = type;
    var modalInstance = $modal.open({templateUrl: 'app/templates/modals/entry.html', keyboard:false, scope: this});
    modalInstance.result.then(function (data) {
      entry.text = data.editEntry;
      $scope.update(entry);
    });
  };

  $scope.update = function(entry){
    socket.emit('updateEntry', {id: $scope.sessionId, entry: entry, entryType: $scope.entryType});
  };

  $scope.openEntry = function(type, entry){
    socket.emit('openEntry', {id: $scope.sessionId, entry: entry});
    $scope.editEntry = entry;
    $scope.entryType = type;
    $scope.entryModal = $modal.open({templateUrl: 'app/templates/modals/showEntry.html', keyboard:false, scope: this});

    $scope.entryModal.result.then(function (data) {
      socket.emit('closeEntry', {id: $scope.sessionId});
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
    return {good: hideText(data.good), bad: hideText(data.bad), improvements: hideText(data.improvements)}
  };

  function hideText(data){
    var entry;
    return _.map(data, function(value){
      if(value.userId != $scope.currentUser.id){
        entry = _.clone(value);
        entry.text = '________ (' + entry.username + ')';
        return entry;
      }else{
        return value;
      }
    }) || [];
  };

  $scope.next = function(entry){

    var indexG = _.indexOf($scope.session.good, entry) ;
    var indexB = _.indexOf($scope.session.bad, entry)
    var indexI = _.indexOf($scope.session.improvements, entry);

    if(indexG != -1 && $scope.session.good[indexG + 1]){
      $scope.editEntry = $scope.session.good[indexG + 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'good', index: indexG + 1});
    }

    if(indexB != -1 && $scope.session.bad[indexB + 1]){
      $scope.editEntry = $scope.session.bad[indexB + 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'bad', index: indexB + 1});
    }

    if(indexI != -1 && $scope.session.improvements[indexI + 1]){
      $scope.editEntry = $scope.session.improvements[indexI + 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'improvements', index: indexB + 1});
    }
  };

  $scope.previous = function(entry){
    var indexG = _.indexOf($scope.session.good, entry) ;
    var indexB = _.indexOf($scope.session.bad, entry)
    var indexI = _.indexOf($scope.session.improvements, entry);

    if(indexG != -1 && $scope.session.good[indexG - 1]){
      $scope.editEntry = $scope.session.good[indexG - 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'good', index: indexG - 1});
    }

    if(indexB != -1 && $scope.session.bad[indexB - 1]){
      $scope.editEntry = $scope.session.bad[indexB - 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'bad', index: indexB - 1});
    }

    if(indexI != -1 && $scope.session.improvements[indexI - 1]){
      $scope.editEntry = $scope.session.improvements[indexI - 1];
      socket.emit('moveCurrentEntry', {id: $scope.sessionId, type: 'improvements', index: indexB - 1});
    }
  };

  //remove user from room when they leave the page
  $scope.$on('$locationChangeStart', function (event, next, current) {
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

    onDeleteEntry: function(data){
      $scope.session[data.type] =  _.reject($scope.session[data.type], {id: data.entry.id});
    },

    onOpenEntry: function(data){
      $scope.editEntry = data.entry;
      $scope.entryModal = $modal.open({templateUrl: 'app/templates/modals/showEntry.html', keyboard:false, scope: $scope});
    },

    onCloseEntry: function(data){
      $scope.entryModal.close();
    },

    onMoveCurrentEntry: function(data){
      $scope.editEntry = $scope.session[data.type][data.index];
    },

    onEntryUpdated: function(data){
      var entry = _.findWhere($scope.session[data.entryType], {id: data.entry.id});
      entry.text = data.entry.text;
      entry.read = data.entry.read;
      if($scope.editEntry.text == data.entry.text){
        $scope.editEntry.read = data.entry.read;
      }
    },

    onError: function(){
      var modalInstance = $modal.open({templateUrl: 'app/templates/modals/error.html', keyboard:false});
      modalInstance.result.then(function () {
        $location.path("/");
      });
    }
  };
});
