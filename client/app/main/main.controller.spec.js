'use strict';

ddescribe('Controller: MainCtrl', function () {

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

    scope.init();
  }));

  it('initialize variables', inject(function (userService) {
    spyOn(userService, 'setUser');
    scope.init();
    expect(userService.setUser).toHaveBeenCalledWith({username : '', type: 'player'});
    expect(scope.currentUser.username).toBe("");
    expect(scope.currentUser.type).toBe("player");
    expect(scope.currentUser_.type).toBe("player");
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


    it('reditects to session/:id when user joins a session', inject(function ($location) {
      scope.currentUser_.username = "tester";
      scope.sessionId = "some-1231";
      scope.joinSession();
      expect($location.path()).toBe('/sessions/some-1231')
    }));
  });

  xdescribe("Retrospective Sessions", function(){
    it('starts session as player', inject(function (userService, $location) {
    }));

    it('starts session as moderator', inject(function ($location) {
    }));

    it('reditects to retrospectives/:id when user creates a session', inject(function ($location) {
    }));

    it('reditects to retrospectives/:id when user joins a session', inject(function ($location) {
    }));
  });
});
