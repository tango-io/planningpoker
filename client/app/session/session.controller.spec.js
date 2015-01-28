'use strict';

describe('Controller: SessionCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));

  var SessionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope, $routeParams) {
    scope = $rootScope.$new();
    SessionCtrl = $controller('SessionCtrl', {
      $scope: scope
    });
  }));

  ddescribe('Sessions controller', function(){
    it('initialize variables on calling init', inject(function ($location, socket, userService, $routeParams) {
      $location.path('/sessions/sessionId');
      scope.init();
      expect(scope.url).toEqual($location.$$absUrl);
      expect(scope.socket).toEqual(socket.socket);
      expect(scope.voteValues).toEqual([0,1,2,3,5,8,13]);
      expect(scope.sessionId).toEqual($routeParams.id);
      expect(scope.username).toEqual(userService.getUser().username);
      expect(scope.votes).toEqual({});
    }));

    it('emits join session if user has a username', inject(function ($location, socket, userService, $routeParams) {
      spyOn(socket.socket, 'emit');
      scope.init();
      expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
    }));

    //it('sets username and emits session id after setting username in modal', inject(function ($location, socket, userService, $routeParams) {
    //}));

    it('sets id and description on joinedSession event', inject(function ($location, socket, userService, $routeParams) {
      scope.init();
      expect(scope.id).toEqual('sessionId');
      expect(scope.description).toEqual('this is a description');
    }));

    it('sets users and current userr on updateUsers event', inject(function ($location, socket, userService, $routeParams) {
    }));

    it('sets show votes to false on hideVotes event', inject(function ($location, socket, userService, $routeParams) {
    }));

    it('updates description on descriptionUpdated event', inject(function ($location, socket, userService, $routeParams) {
    }));

    it('update votes on updateVotes event', inject(function ($location, socket, userService, $routeParams) {
    }));

    it('calls clear session function on clear votes event', inject(function ($location, socket, userService, $routeParams) {
    }));

    //it('opens modal and redirects to home on errorMsg events', inject(function ($location, socket, userService, $routeParams) {
    //}));

    it('it clears variables related to session in clear session function', inject(function ($location, socket, userService, $routeParams) {
      scope.description = "some description";
      scope.consensus = true;
      scope.points = true;
      scope.users = [{socketId: 'socketId', username: 'tester', voted:true}];
      scope.votes = {socketId: 4};
      scope.showVotes = true;

      scope.clearSession();

      expect(scope.description).toEqual("");
      expect(scope.consensus).toEqual(false);
      expect(scope.points).toEqual(false);
      expect(scope.users[0].voted).toEqual(false);
      expect(scope.votes).toEqual({});
      expect(scope.showVotes).toEqual(false);
    }));

    it('it sets votes values  and emit vote event in set vote function', inject(function ($location, socket, userService, $routeParams) {
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

    it('does not emit vote if show votes is true ', inject(function ($location, socket, userService, $routeParams) {
    }));

    it('emits leave session if location.patch changes', inject(function ($location, socket, userService, $routeParams) {
      spyOn(socket.socket, 'emit');
      $location.path('/')
      expect(socket.socket.emit).not.toHaveBeenCalledWith('leaveSession');
    }));
  });
});
