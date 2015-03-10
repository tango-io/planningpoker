'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('userServiceMock'));
  beforeEach(module('modalMock'));

  var MainCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope) {
    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

    scope.init();
  }));

  it('initialize variables', inject(function (userService, socket) {
    socket.on = socket.onFake;
    spyOn(userService, 'setUser');
    spyOn(scope.listeners, 'onSessionCreated');
    spyOn(scope.listeners, 'onError');
    scope.init();
    expect(userService.setUser).toHaveBeenCalledWith({username : '', type: 'player'});
    expect(scope.currentUser.username).toBe("");
    expect(scope.currentUser.type).toBe("player");
    expect(scope.currentUser_.type).toBe("player");
    expect(scope.listeners.onSessionCreated.callCount).toBe(2);
    expect(scope.listeners.onError).toHaveBeenCalled();
  }));

  it('sets submitted to true when starts a session without username', inject(function () {
    scope.startSession();
    expect(scope.submitted).toBe(true);
  }));

  it('calls sets username function in service before start session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.currentUser.username = "tester";
    scope.startSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', type : 'player' });
  }));

  it('sets type in service before start session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.currentUser.type = "moderator";
    scope.currentUser.username = "tester";
    scope.startSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', type : 'moderator' });
  }));

  it('does not join a session without username or session id', inject(function (userService, socket) {
    spyOn(socket, 'emit');
    spyOn(userService, 'setUser');
    scope.startSession();
    expect(userService.setUser).not.toHaveBeenCalledWith();
    scope.currentUser_.username = "tester";
    expect(userService.setUser).not.toHaveBeenCalledWith();
    expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
  }));

  it('sets submitted_ to true after attempting starting a session without username or session id', inject(function () {
    scope.joinSession();
    expect(scope.submitted_).toBe(true);
  }));

  it('sets username in service before join session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.currentUser_.username = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', type : 'player' });
  }));

  it('sets type_ in service before join session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.currentUser_.type = "player";
    scope.currentUser_.username = "Tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(userService.setUser).toHaveBeenCalledWith( { username : 'Tester', type : 'player' });
  }));

  it('emits verify session on joinSession', inject(function (socket) {
    spyOn(socket, 'emit');
    scope.currentUser_.username = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(socket.emit).toHaveBeenCalledWith("verifySession", { type : 'pointing', id : 'some-1231' });
  }));

  describe("Pointing Sessions", function(){
    it('does not go to vote values page without username', inject(function (userService, $location) {
      spyOn(userService, 'setUser');
      scope.startSession();
      expect(userService.setUser).not.toHaveBeenCalledWith();
       expect($location.path()).toBe('');
    }));

    it('goes to vote values start session', inject(function ($location) {
      scope.currentUser.username = "tester";
      scope.startSession();
       expect($location.path()).toBe('/voteValues');
    }));

    it('reditects to session/:id on session verified', inject(function ($location) {
      scope.listeners.onSessionCreated({id: 'some-1231', data:'session'});
      expect($location.path()).toBe('/sessions/some-1231')
    }));
  });

  describe("Retrospective Sessions", function(){
    it('emit new session on start session', inject(function (socket) {
      spyOn(socket, 'emit');
      scope.currentUser.username = "tester";
      scope.sessionType = "retrospective";
      scope.startSession();
      expect(socket.emit).toHaveBeenCalledWith('newSession', 'retrospective');
    }));

    it('reditects to retrospectives/:id on session created listener', inject(function (socket, $location) {
      scope.listeners.onSessionCreated({id: 'some-1231', data:'retrospective'});
      expect($location.path()).toBe('/retrospectives/some-1231')
      scope.listeners.onSessionCreated({id: 'some-1231'});
      expect($location.path()).toBe('/sessions/some-1231')
    }));

    it('reditects to retrospectives/:id on session verified', inject(function ($location) {
      scope.listeners.onSessionCreated({id: 'some-1231', data:'retrospective'});
      expect($location.path()).toBe('/retrospectives/some-1231')
    }));

    it('opens modal on errorMsg function', inject(function ($modal) {
      spyOn($modal, 'open').andReturn($modal.fakeResponses.cleanOpen);
      scope.listeners.onError();

      expect($modal.open).toHaveBeenCalled();
    }));
  });
});
