'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope) {
    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('clears usernames on initializer', inject(function (userService) {
    scope.init();
    expect(scope.username).toBe("");
    expect(userService.getUser().username).toBe("");
  }));

  it('does not start a session without username', inject(function (userService, socket) {
    spyOn(socket.socket, 'emit');
    scope.startSession();
    expect(socket.socket.emit).not.toHaveBeenCalledWith('newSession');
    expect(userService.getUser().username).toBe(undefined);
    expect(userService.getUser().username).toBe(undefined);
  }));

  it('sets submitted to true when starts a session without username', inject(function () {
    scope.startSession();
    expect(scope.submitted).toBe(true);
  }));

  it('sets username in service before start session', inject(function (userService) {
    scope.username = "tester";
    scope.startSession();
    expect(userService.getUser().username).toBe("tester");
  }));

  it('emits new session in start session', inject(function (socket) {
    spyOn(socket.socket, 'emit');
    scope.username = "tester";
    scope.startSession();
     expect(socket.socket.emit).toHaveBeenCalledWith('newSession');
  }));

  it('redirects to session:id on session created', inject(function ($location) {
    scope.username = "tester";
    scope.startSession();
    expect($location.path()).toBe('/sessions/sessionId')
  }));

  it('does not join a session without username or session id', inject(function (userService, socket) {
    spyOn(socket.socket, 'emit');
    scope.startSession();
    expect(userService.getUser().username).toBe(undefined)
    scope.username_ = "tester";
    expect(userService.getUser().username).toBe(undefined);
    expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
  }));

  it('sets submitted_ to true after attempting starting a session without username or session id', inject(function () {
    scope.joinSession();
    expect(scope.submitted_).toBe(true);
  }));

  it('sets username in service before join session', inject(function (userService) {
    scope.username_ = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(userService.getUser().username).toBe("tester");
  }));

  it('reditects to session/:id when user joins a session', inject(function ($location) {
    scope.username_ = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect($location.path()).toBe('/sessions/some-1231')
  }));
});
