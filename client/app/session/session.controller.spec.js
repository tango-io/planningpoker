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
      var  defaultValues = [
        {label: 0, value: 0},
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 5, value: 5},
        {label: 8, value: 8},
        {label: 13, value: 13}
      ];

      $location.path('/sessions/sessionId');
      spyOn(userService, 'getUser').andReturn(userService.fakeResponses.getFakeUser());
      scope.init();
      expect(scope.url).toEqual($location.$$absUrl + "sessions/sessionId");
      expect(scope.socket).toEqual(socket.socket);
      expect(scope.voteValues).toEqual(defaultValues);
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(userService.getUser).toHaveBeenCalled();
      expect(scope.username).toEqual(userService.fakeResponses.getFakeUser().username);
      expect(scope.userType).toEqual(userService.fakeResponses.getFakeUser().userType);
      expect(scope.votes).toEqual({});
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

    it('emits join session if user has a username', inject(function (socket) {
      spyOn(socket.socket, 'emit');
      scope.init();
      expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
    }));

    it('sets username and emits session id after setting username in modal', inject(function ($modal) {
      $modal.open.andReturn($modal.fakeResponses.open);
      spyOn(scope.listeners, 'onJoinedSession');
      scope.init();

      expect($modal.open).toHaveBeenCalled();
      expect(scope.username).toBe('tester');
      expect(scope.userType).toBe('observer');
      expect(scope.listeners.onJoinedSession).toHaveBeenCalled();
    }));

    it('sets id and description on joinedSession function', inject(function () {
      scope.listeners.onDescriptionUpdated("Updated description");
      expect(scope.description).toEqual('Updated description');
    }));

    it('sets description and id on joined session function', inject(function () {
      scope.listeners.onJoinedSession({id: 1, description: "This is a description"});
      expect(scope.description).toEqual('This is a description');
      expect(scope.id).toEqual(1);
    }));

    it('sets players, observers and current user, and users list on updateUsers function', inject(function () {
      scope.id = 1;
      scope.listeners.onUpdateUsers({players:[{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}], observers: [{socketId: 4, username: 'Viserys'}]});
      expect(scope.currentUser.username).toEqual('Daenerys');
      expect(scope.players).toEqual([{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}]);
      expect(scope.observers).toEqual([{socketId: 4, username: 'Viserys'}]);
      scope.listeners.onUpdateUsers({observers:[{socketId: 1, username: 'Daenerys'}, {socketId: 2, username: 'Drogo'}], players: [{socketId: 4, username: 'Viserys'}]});
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

    it('opens modal and redirects to home on errorMsg function', inject(function ($location, $modal) {
      var fakeResponse = $modal.open();
      $modal.open.andReturn(fakeResponse);
      scope.listeners.onError();

      expect($modal.open).toHaveBeenCalled();
      expect($location.path()).toBe('/');
    }));

    it('it clears variables related to session in clear session function', inject(function () {
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

    it('it sets votes values  and emit vote event in set vote function', inject(function (socket) {
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

    it('does not emit vote if show votes is true ', inject(function (socket) {
      spyOn(socket.socket, 'emit');
      scope.showVotes = true;
      expect(socket.socket.emit).not.toHaveBeenCalled();
    }));

    it('emits leave session if location.patch changes', inject(function ($location, socket) {
      spyOn(socket.socket, 'emit');
      $location.path('/')
      expect(socket.socket.emit).not.toHaveBeenCalledWith('leaveSession');
    }));
  });
});
