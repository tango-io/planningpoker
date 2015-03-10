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
      spyOn(userService, 'getUser').andReturn(userService.fakeResponses.getFakeUser());
      $location.path('/sessions/sessionId');
      socket.on = socket.onFake;
      scope.init();
      expect(scope.url).toEqual($location.$$absUrl + "sessions/sessionId");
      expect(scope.voteValues).toEqual(userService.fakeResponses.getFakeValues());
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(userService.getUser).toHaveBeenCalled();
      expect(scope.currentUser.username).toEqual(userService.fakeResponses.getFakeUser().username);
      expect(scope.currentUser.type).toEqual(userService.fakeResponses.getFakeUser().type);
      expect(scope.votes).toEqual({});
    }));

    it('opens modal and redirects to home on errorMsg function', inject(function ($location, $modal) {
      var fakeResponse = $modal.open();
      $modal.open.andReturn(fakeResponse);
      scope.listeners.onError();

      expect($modal.open).toHaveBeenCalled();
      expect($location.path()).toBe('/');
    }));

    it('emits leave session if location.path changes', inject(function ($location, socket) {
      spyOn(socket, 'emit');
      $location.path('/')
      expect(socket.emit).not.toHaveBeenCalledWith('leaveSession');
    }));

    it('sets the listeners for socket events', inject(function (socket) {
      socket.on = socket.onFake;
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
      spyOn(socket, 'emit');
      scope.init();
      expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
      scope.currentUser.username = 'Tester';
      scope.init();
      expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
    }));

    it('emits update description in updateDescription function', inject(function (socket) {
      spyOn(socket, 'emit');
      scope.currentUser= {type:'moderator'};
      scope.sessionId = 'sessionId';
      scope.description = "This is an update for description";
      scope.updateDescription();
      expect(socket.emit).toHaveBeenCalledWith('updateDescription', { id : 'sessionId', description : 'This is an update for description' });
    }));

    it('does not emit update description in updateDescription function if user is a player', inject(function (socket) {
      scope.init();
      spyOn(socket, 'emit');

      scope.type = 'player';
      scope.sessionId = 'sessionId';

      scope.updateDescription("This is an update for description");
      expect(socket.emit).not.toHaveBeenCalled();
    }));

    it('sets username and emits session id after setting username in modal', inject(function ($modal, userService, socket, $location) {
      $modal.open.andReturn($modal.fakeResponses.open);
      spyOn(socket, 'emit');
      scope.init();
      expect($modal.open).toHaveBeenCalled();
      expect(scope.currentUser.username).toBe('tester');
      expect(scope.currentUser.type).toBe('moderator');
      expect(socket.emit).toHaveBeenCalledWith('joinSession', {roomId : undefined, username : 'tester', type : 'moderator' });
    }));

    it('does not emit vote if show votes is true ', inject(function (socket) {
      spyOn(socket, 'emit');
      scope.showVotes = true;
      expect(socket.emit).not.toHaveBeenCalled();
    }));

    it('sets description and id on joined session function', inject(function () {
      scope.init();
      scope.listeners.onJoinedSession({id: 1, description: "This is a description"});
      expect(scope.description).toEqual('This is a description');
      expect(scope.currentUser.id).toEqual(1);
    }));

    it('sets players, moderators, and current user on updateUsers function', inject(function () {
      scope.init();
      scope.currentUser.id = 1;
      scope.listeners.onUpdateUsers({players:[{id: 1, username: 'Daenerys'}, {id: 2, username: 'Drogo'}], moderators: [{id: 4, username: 'Viserys'}]});
      expect(scope.currentUser.username).toEqual('Daenerys');
      expect(scope.players).toEqual([{id: 1, username: 'Daenerys'}, {id: 2, username: 'Drogo'}]);
      expect(scope.moderators).toEqual([{id: 4, username: 'Viserys'}]);
      scope.listeners.onUpdateUsers({moderators:[{id: 1, username: 'Daenerys'}, {id: 2, username: 'Drogo'}], players: [{id: 4, username: 'Viserys'}]});
      expect(scope.currentUser.username).toEqual('Daenerys');
    }));

    it('sets show votes to false on hideVotes function', inject(function () {
      scope.listeners.onHideVotes();
      expect(scope.showVotes).toEqual(false);
    }));

    it('update votes on updateVotes function', inject(function () {
      scope.init();
      scope.listeners.onUpdateVotes({id: 4});
      expect(scope.showVotes).toEqual(true);
      expect(scope.votes).toEqual({id: 4});
      expect(scope.unanimous).toEqual(false);
    }));

    it('does not show votes if votes are empty', inject(function () {
      scope.listeners.onUpdateVotes({});
      expect(scope.showVotes).toEqual(false);
    }));

    it('does not show unanimous if there is only one vote or votes does not match', inject(function () {
      scope.init();
      scope.listeners.onUpdateVotes({id: 3});
      expect(scope.unanimous).toEqual(false);
      scope.listeners.onUpdateVotes({id: 4, otherSocketId: 3, anotherSocketId: 3});
      expect(scope.unanimous).toEqual(false);
    }));

    it('shows unanimous if there is all votes matches', inject(function ($location) {
      scope.init();
      scope.listeners.onUpdateVotes({id: 3, otherSocketId: 3, anotherSocketId: 3});
      expect(scope.unanimous).toEqual(true);
    }));

    it('clears variables related to session in clear session function', inject(function () {
      scope.description = "some description";
      scope.unanimous = true;
      scope.points = true;
      scope.players = [{id: 'id', username: 'tester', voted:true}];
      scope.votes = {id: 4};
      scope.showVotes = true;

      scope.clearSession();

      expect(scope.description).toEqual("");
      expect(scope.unanimous).toEqual(false);
      expect(scope.points).toEqual(false);
      expect(scope.players[0].voted).toEqual(false);
      expect(scope.votes).toEqual({});
      expect(scope.showVotes).toEqual(false);
    }));

    it('sets votes values  and emit vote event in set vote function', inject(function (socket) {
      spyOn(socket, 'emit');
      scope.sessionId = 'sessionId';
      scope.currentUser = {id: 4};
      scope.showVotes = false;
      scope.votes = {};

      scope.setVote(4);

      expect(scope.currentUser.voted).toEqual(true);
      expect(scope.votes[scope.currentUser.id]).toEqual(4);
      expect(socket.emit).toHaveBeenCalledWith('vote', {id: 'sessionId', userId: 4, vote:4});
    }));
  });
});
