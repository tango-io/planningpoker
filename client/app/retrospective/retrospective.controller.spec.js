'use strict';

ddescribe('Controller: RetrospectiveCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('modalMock'));
  beforeEach(module('userServiceMock'));

  var RetrospectivesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RetrospectivesCtrl = $controller('RetrospectiveCtrl', {
      $scope: scope
    });
  }));

 //it('initialize variables on calling init', inject(function ($location, userService, $routeParams) {
  //  spyOn(userService, 'getUser').andReturn(userService.fakeResponses.getFakeUser());
  //  $location.path('/retrospectives/sessionId');
  //  scope.init();
  //  expect(userService.getUser).toHaveBeenCalled();
  //  expect(scope.currentUser.username).toEqual(userService.fakeResponses.getFakeUser().username);
  //  expect(scope.currentUser.type).toEqual(userService.fakeResponses.getFakeUser().type);
  //  //expect(scope.url).toEqual($location.$$absUrl + "retrospectives/sessionId");
  //  expect(scope.sessionId).toEqual($routeParams.id);
  //  expect(scope.inputMode).toEqual({});
  //  expect(scope.newEntry).toEqual({});
  //}));

  //it('opens modal and redirects to home on errorMsg function', inject(function ($location, $modal) {
  //  var fakeResponse = $modal.open();
  //  $modal.open.andReturn(fakeResponse);
  //  scope.listeners.onError();

  //  expect($modal.open).toHaveBeenCalled();
  //  expect($location.path()).toBe('/');
  //}));

  //it('emits leave session if location.path changes', inject(function ($location, socket) {
  //  spyOn(socket, 'emit');
  //  $location.path('/')
  //  expect(socket.emit).not.toHaveBeenCalledWith('leaveSession');
  //}));

  //it('emit join session it user have a username', inject(function (socket) {
  //  spyOn(socket, 'emit');
  //  scope.init();
  //  expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
  //  scope.currentUser.username = 'Tester';
  //  scope.init();
  //  expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
  //}));

  //it('sets username and emits session id after setting username in modal', inject(function ($modal, userService, socket, $location) {
  //  $modal.open.andReturn($modal.fakeResponses.open);
  //  spyOn(socket, 'emit');
  //  scope.init();
  //  expect($modal.open).toHaveBeenCalled();
  //  expect(scope.currentUser.username).toBe('tester');
  //  expect(scope.currentUser.type).toBe('moderator');
  //  expect(socket.emit).toHaveBeenCalledWith('joinSession', {roomId : undefined, username : 'tester', type : 'moderator' });
  //}));

  //xit('sets the listeners for socket events', inject(function (socket) {
  //  socket.on = socket.onFake;
  //  spyOn(scope.listeners, 'onJoinedSession');
  //  spyOn(scope.listeners, 'onUpdateUsers');
  //  spyOn(scope.listeners, 'onError');
  //  spyOn(scope.listeners, 'onReveal');
  //  spyOn(scope.listeners, 'onHide');
  //  spyOn(scope.listeners, 'onNewEntry');
  //  spyOn(scope.listeners, 'onEntryUpdated');
  //  spyOn(scope.listeners, 'onMoveCurrentEntry');
  //  spyOn(scope.listeners, 'onOpenEntry');
  //  spyOn(scope.listeners, 'onCloseEntry');
  //  scope.init();
  //  expect(scope.listeners.onJoinedSession).toHaveBeenCalled();
  //  expect(scope.listeners.onUpdateUsers).toHaveBeenCalled();
  //  expect(scope.listeners.onError).toHaveBeenCalled();
  //  expect(scope.listeners.onHide).toHaveBeenCalled();
  //  expect(scope.listeners.onNewEntry).toHaveBeenCalled();
  //  expect(scope.listeners.onEntryUpdated).toHaveBeenCalled();
  //  expect(scope.listeners.onMoveCurrentEntry).toHaveBeenCalled();
  //  expect(scope.listeners.onOpenEntry).toHaveBeenCalled();
  //  expect(scope.listeners.onCloseEntry).toHaveBeenCalled();
  //}));

  it('adds an entry in the corresponding type', function () {
  });

  it('emits new entry event in add funcion', function () {
  });

  it('clears new entry after add an entry', function () {
  });

  it('removes an entry', function () {
  });

  it('opens a modal on edit function', function () {
  });

  it('sets editEntry in edit function', function () {
  });

  it('sets editEntry values in edit function on result promise', function () {
  });

  it('emits update entry on update function', function () {
  });

  it('emits open entry in open entry function', function () {
  });

  it('opens modal and sets edit entry in open entry function', function () {
  });

  it('emits close entry after closing modal in open entry function', function () {
  });

  it('sets copy message in set copy msg function', function () {
  });

  it('change value of entry.read in toggle read function', function () {
  });

  it('calls update function after toggle in toggle read function', function () {
  });

  it('change value of review mode in toggle review mode function', function () {
  });

  it('emits reveal or hide in toggle review mode function', function () {
  });

  it('changes next entry as edit entry in next function', function () {
  });

  it('emits move current entry in next function', function () {
  });

  it('changes previous entry as edit entry in previous function', function () {
  });

  it('emits move current entry in previous function', function () {
  });

});
