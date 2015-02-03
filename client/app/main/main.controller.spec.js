'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('userServiceMock'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope) {
    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('initialize variables', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.init();
    expect(userService.setUser).toHaveBeenCalledWith({ username : '' });
    expect(scope.username).toBe("");
    expect(scope.userType).toBe("player");
    expect(scope.userType_).toBe("player");
  }));

  it('does not go to vote values page without username', inject(function (userService, $location) {
    spyOn(userService, 'setUser');
    scope.startSession();
    expect(userService.setUser).not.toHaveBeenCalledWith();
     expect($location.path()).toBe('');
  }));

  it('sets submitted to true when starts a session without username', inject(function () {
    scope.startSession();
    expect(scope.submitted).toBe(true);
  }));

  it('calls sets username function in service before start session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.username = "tester";
    scope.startSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', userType : undefined });
  }));

  it('sets userType in service before start session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.userType = "observer";
    scope.username = "tester";
    scope.startSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', userType : 'observer' });
  }));

  it('goes to vote values start session', inject(function ($location) {
    scope.username = "tester";
    scope.startSession();
     expect($location.path()).toBe('/voteValues');
  }));

  it('does not join a session without username or session id', inject(function (userService, socket) {
    spyOn(socket.socket, 'emit');
    spyOn(userService, 'setUser');
    scope.startSession();
    expect(userService.setUser).not.toHaveBeenCalledWith();
    scope.username_ = "tester";
    expect(userService.setUser).not.toHaveBeenCalledWith();
    expect(socket.socket.emit).not.toHaveBeenCalledWith('joinSession');
  }));

  it('sets submitted_ to true after attempting starting a session without username or session id', inject(function () {
    scope.joinSession();
    expect(scope.submitted_).toBe(true);
  }));

  it('sets username in service before join session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.username_ = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(userService.setUser).toHaveBeenCalledWith({ username : 'tester', userType : undefined });
  }));

  it('sets userType_ in service before join session', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.userType_ = "player";
    scope.username_ = "Tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect(userService.setUser).toHaveBeenCalledWith( { username : 'Tester', userType : 'player' });
  }));

  it('reditects to session/:id when user joins a session', inject(function ($location) {
    scope.username_ = "tester";
    scope.sessionId = "some-1231";
    scope.joinSession();
    expect($location.path()).toBe('/sessions/some-1231')
  }));
});
