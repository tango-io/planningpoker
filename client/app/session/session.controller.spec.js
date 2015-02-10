'use strict';

describe('Controller: SessionCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('modalMock'));
  beforeEach(module('userServiceMock'));

  var SessionCtrl, scope, $modal;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope, $routeParams, $modal) {
    scope = $rootScope.$new();

    SessionCtrl = $controller('SessionCtrl', {
      $scope: scope,
    });

    spyOn($modal, 'open').andReturn($modal.fakeResponses.cleanOpen);
  }));

  describe('Sessions controller', function(){

    it('initialize variables on calling init', inject(function ($location, socket, userService, $routeParams, $modal) {
      $location.path('/sessions/sessionId');
      spyOn(userService, 'getUser').andReturn(userService.fakeResponses.getFakeUser());
      scope.init();
      expect(scope.url).toEqual($location.$$absUrl + "sessions/sessionId");
      expect(scope.socket).toEqual(socket.socket);
      expect(scope.voteValues).toEqual(userService.fakeResponses.getFakeValues());
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(userService.getUser).toHaveBeenCalled();
      expect(scope.username).toEqual(userService.fakeResponses.getFakeUser().username);
      expect(scope.userType).toEqual(userService.fakeResponses.getFakeUser().userType);
      expect(scope.votes).toEqual({});
    }));

    it('opens modal and redirects to home on errorMsg function', inject(function ($location, $modal) {
      var fakeResponse = $modal.open();
      $modal.open.andReturn(fakeResponse);
      scope.listeners.onError();

      expect($modal.open).toHaveBeenCalled();
      expect($location.path()).toBe('/');
    }));

    it('emits leave session if location.patch changes', inject(function ($location, socket) {
      spyOn(socket.socket, 'emit');
      $location.path('/')
      expect(socket.socket.emit).not.toHaveBeenCalledWith('leaveSession');
    }));

    it('sets the listener for socket events', inject(function () {
      spyOn(scope, 'clearSession');
      spyOn(scope.listeners, 'onDescriptionUpdated');
      spyOn(scope.listeners, 'onJoinedSession');
      spyOn(scope.listeners, 'onUpdateUsers');
      spyOn(scope.listeners, 'onHideVotes');
      spyOn(scope.listeners, 'onUpdateVotes');
      spyOn(scope.listeners, 'onError');
      scope.init();
      expect(scope.listeners.onDescriptionUpdated).toHaveBeenCalled();
      expect(scope.listeners.onJoinedSession).toHaveBeenCalled();
      expect(scope.listeners.onUpdateUsers).toHaveBeenCalled();
      expect(scope.listeners.onHideVotes).toHaveBeenCalled();
      expect(scope.listeners.onUpdateVotes).toHaveBeenCalled();
      expect(scope.listeners.onError).toHaveBeenCalled();
    }));

    it('emit join session it user have a username', inject(function (socket) {
      spyOn(socket.socket, 'emit');
      scope.init();
      expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
      scope.username = 'Tester';
      scope.init();
      expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
    }));

    it('emits update description in updateDescription function', inject(function (socket) {
      scope.init();
      spyOn(socket.socket, 'emit');

      scope.userType = 'moderator';
      scope.sessionId = 'sessionId';

      scope.updateDescription("This is an update for description");
      expect(socket.socket.emit).toHaveBeenCalledWith('updateDescription', { id : 'sessionId', description : 'this is a description' });
    }));

    it('does not emit update description in updateDescription function if user is a player', inject(function (socket) {
      scope.init();
      spyOn(socket.socket, 'emit');

      scope.userType = 'player';
      scope.sessionId = 'sessionId';

      scope.updateDescription("This is an update for description");
      expect(socket.socket.emit).not.toHaveBeenCalled();
    }));

    it('sets username and emits session id after setting username in modal', inject(function ($modal) {
      $modal.open.andReturn($modal.fakeResponses.open);
      spyOn(scope.listeners, 'onJoinedSession');
      scope.init();

      expect($modal.open).toHaveBeenCalled();
      expect(scope.username).toBe('tester');
      expect(scope.userType).toBe('moderator');
      expect(scope.listeners.onJoinedSession).toHaveBeenCalled();
    }));

    it('does not emit vote if show votes is true ', inject(function (socket) {
      spyOn(socket.socket, 'emit');
      scope.showVotes = true;
      expect(socket.socket.emit).not.toHaveBeenCalled();
    }));

    it('sets description and id on joined session function', inject(function () {
      scope.listeners.onJoinedSession({id: 1, description: "This is a description"});
      expect(scope.description).toEqual('This is a description');
      expect(scope.id).toEqual(1);
    }));

    it('sets players, moderators, and current user on updateUsers function', inject(function () {
      scope.id = 1;
      scope.listeners.onUpdateUsers({players:[{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}], moderators: [{socketId: 4, username: 'Viserys'}]});
      expect(scope.currentUser.username).toEqual('Daenerys');
      expect(scope.players).toEqual([{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}]);
      expect(scope.moderators).toEqual([{socketId: 4, username: 'Viserys'}]);
      scope.listeners.onUpdateUsers({moderators:[{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}], players: [{socketId: 4, username: 'Viserys'}]});
      expect(scope.currentUser.username).toEqual('Daenerys');
    }));

    it('sets show votes to false on hideVotes function', inject(function () {
      scope.listeners.onHideVotes();
      expect(scope.showVotes).toEqual(false);
    }));

    it('update votes on updateVotes function', inject(function () {
      scope.listeners.onUpdateVotes({socketId: 4});
      expect(scope.showVotes).toEqual(true);
      expect(scope.votes).toEqual({socketId: 4});
      expect(scope.consensus).toEqual(false);
    }));

    it('does not show votes if votes are empty', inject(function () {
      scope.listeners.onUpdateVotes({});
      expect(scope.showVotes).toEqual(false);
    }));

    it('does not show consensus if there is only one vote or votes does not match', inject(function () {
      scope.listeners.onUpdateVotes({socketId: 3});
      expect(scope.consensus).toEqual(false);
      scope.listeners.onUpdateVotes({socketId: 4, otherSocketId: 3, anotherSocketId: 3});
      expect(scope.consensus).toEqual(false);
    }));

    it('shows consensus if there is all votes matches', inject(function ($location) {
      scope.listeners.onUpdateVotes({socketId: 3, otherSocketId: 3, anotherSocketId: 3});
      expect(scope.consensus).toEqual(true);
    }));

    it('clears variables related to session in clear session function', inject(function () {
      scope.description = "some description";
      scope.consensus = true;
      scope.points = true;
      scope.players = [{socketId: 'socketId', username: 'tester', voted:true}];
      scope.votes = {socketId: 4};
      scope.showVotes = true;

      scope.clearSession();

      expect(scope.description).toEqual("");
      expect(scope.consensus).toEqual(false);
      expect(scope.points).toEqual(false);
      expect(scope.players[0].voted).toEqual(false);
      expect(scope.votes).toEqual({});
      expect(scope.showVotes).toEqual(false);
    }));

    it('sets votes values  and emit vote event in set vote function', inject(function (socket) {
      spyOn(socket.socket, 'emit');
      scope.init();
      scope.id = 'socketId';
      scope.sessionId = 'sessionId';
      scope.showVotes = false;
      scope.currentUser = {};
      scope.votes = {};

      scope.setVote(4);

      expect(scope.currentUser.voted).toEqual(true);
      expect(scope.votes[scope.id]).toEqual(4);
      expect(socket.socket.emit).toHaveBeenCalledWith('vote', {id: 'sessionId', userId: 'socketId', vote:4});
    }));
  });
});
