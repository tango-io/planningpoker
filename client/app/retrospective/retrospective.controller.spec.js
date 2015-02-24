'use strict';

describe('Controller: RetrospectiveCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('modalMock'));
  beforeEach(module('userServiceMock'));

  var RetrospectivesCtrl, scope, $modal;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_socket_, _userService_, $location, $controller, $rootScope, $routeParams, $modal) {
    scope = $rootScope.$new();

    RetrospectivesCtrl = $controller('RetrospectiveCtrl', {
      $scope: scope
    });

    spyOn($modal, 'open').andReturn($modal.fakeResponses.cleanOpen);
  }));

 it('initialize variables on calling init', inject(function ($location, userService, $routeParams) {
    spyOn(userService, 'getUser').andReturn(userService.fakeResponses.getFakeUser());
    $location.path('/retrospectives/sessionId');
    scope.init();
    expect(userService.getUser).toHaveBeenCalled();
    expect(scope.currentUser.username).toEqual(userService.fakeResponses.getFakeUser().username);
    expect(scope.currentUser.type).toEqual(userService.fakeResponses.getFakeUser().type);
    //expect(scope.url).toEqual($location.$$absUrl + "retrospectives/sessionId");
    expect(scope.url).toEqual($location.$$absUrl);
    expect(scope.sessionId).toEqual($routeParams.id);
    expect(scope.inputMode).toEqual({});
    expect(scope.newEntry).toEqual({});
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

  it('emit join session it user have a username', inject(function (socket) {
    spyOn(socket, 'emit');
    scope.init();
    expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
    scope.currentUser.username = 'Tester';
    scope.init();
    expect(socket.emit).not.toHaveBeenCalledWith('joinSession');
  }));

  it('sets username and emits session id after setting username in modal', inject(function ($modal, userService, socket, $location) {
    $modal.open.andReturn($modal.fakeResponses.open);
    spyOn(socket, 'emit');
    scope.init();
    expect($modal.open).toHaveBeenCalled();
    expect(scope.currentUser.username).toBe('tester');
    expect(scope.currentUser.type).toBe('moderator');
    expect(socket.emit).toHaveBeenCalledWith('joinSession', {roomId : undefined, username : 'tester', type : 'moderator', sessionType : 'retrospective'});
  }));

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
    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {};
    scope.currentUser = {username: 'Tester'};

    scope.newEntry.good = "new good entry";
    scope.add('good');

    scope.newEntry.bad = "new bad entry";
    scope.add('bad');

    scope.newEntry.improvements = "new improvements entry";
    scope.add('improvements');

    expect(scope.session.good[0].text).toEqual("new good entry");
    expect(scope.session.bad[0].text).toEqual("new bad entry");
    expect(scope.session.improvements[0].text).toEqual("new improvements entry");
  });

  it('emits new entry event in add funcion',  inject(function (socket) {
    spyOn(socket, 'emit');

    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {};
    scope.currentUser = {username: 'Tester'};
    scope.newEntry.good = "new good entry";
    scope.add('good');

    expect(socket.emit).toHaveBeenCalledWith('newEntry',{id: undefined, entry:{id: 0, text:'new good entry', username:'Tester', userId:undefined }, type:'good'});
  }));

  it('clears new entry after add an entry', function () {
    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {};
    scope.currentUser = {username: 'Tester'};
    scope.newEntry.good = "new good entry";
    scope.add('good');
    expect(scope.newEntry.good).toEqual("");
  });

  it('removes an entry', function () {
    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {};
    scope.currentUser = {username: 'Tester'};
    scope.newEntry.good = "new good entry";
    scope.add('good');

    expect(scope.session.good.length).toEqual(1);
    scope.remove('good', scope.session.good[0]);
    expect(scope.session.good.length).toEqual(0);
  });

  it('opens a modal on edit function', inject(function ($modal) {
    var fakeResponse = $modal.open();
    $modal.open.andReturn(fakeResponse);

    scope.edit('good', {text: "new"});

    expect($modal.open).toHaveBeenCalled();
  }));

  it('sets editEntry in edit function', function () {
    scope.edit('good', {text: "new"});
    expect(scope.editEntry).toEqual("new");
    expect(scope.entryType).toEqual("good");
  });

  it('sets editEntry values in edit function on result promise', inject(function ($modal) {
    spyOn(scope, 'update');
    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {good: "new good entry"};
    scope.currentUser = {username: 'Tester'};
    var fakeResponse = $modal.fakeResponses.editOpen;
    $modal.open.andReturn(fakeResponse);

    scope.add('good');

    scope.edit('good', scope.session.good[0]);

    expect($modal.open).toHaveBeenCalled();
    expect(scope.session.good[0].text).toEqual("entry updated");
    expect(scope.update).toHaveBeenCalledWith(scope.session.good[0]);
  }));

  it('emits update entry on update function', inject(function (socket) {
    scope.sessionId = 'sessionId';
    scope.session = {good: [], bad: [], improvements: []};
    scope.newEntry = {good: "new good entry"};
    scope.currentUser = {username: 'Tester'};
    scope.add('good');

    spyOn(socket, 'emit');
    scope.session.good[0].text = "New text";
    scope.entryType = "good";
    scope.update(scope.session.good[0]);
    expect(socket.emit).toHaveBeenCalledWith('updateEntry', {id:'sessionId', entry:{id:0, text:'New text', username:'Tester', userId:undefined }, entryType:'good' });
  }));

  it('emits open entry in open entry function', inject(function (socket) {
    scope.sessionId = 'sessionId';
    spyOn(socket, 'emit');
    scope.session = {good: [{text: 'text', username: 'Tester'}], bad: [], improvements: []};

    scope.openEntry('good', scope.session.good[0]);
    expect(socket.emit).toHaveBeenCalledWith('openEntry', {id:'sessionId', entry:{ text:'text', username:'Tester'}});
  }));

  it('opens modal and sets edit entry in open entry function', inject(function ($modal) {
    var fakeResponse = $modal.open();
    $modal.open.andReturn(fakeResponse);

    scope.openEntry('good', {text: "new"});

    expect($modal.open).toHaveBeenCalled();
    expect(scope.editEntry.text).toEqual("new");
    expect(scope.entryType).toEqual("good");
  }));

  it('emits close entry after closing modal in open entry function', inject(function ($modal, socket) {
    var fakeResponse = $modal.open();
    $modal.open.andReturn(fakeResponse);
    scope.sessionId = 'sessionId';
    scope.session = {good: [{text: 'text', username: 'Tester'}], bad: [], improvements: []};

    spyOn(socket, 'emit');

    scope.openEntry('good', scope.session.good[0]);

    expect(socket.emit.callCount).toBe(2);
    expect(socket.emit.mostRecentCall.args).toEqual(['closeEntry', {id: 'sessionId'}]);
  }));

  it('sets copy message in set copy msg function', function () {
    scope.setCopyMsg("copied");
    expect(scope.copyMsg).toBe("copied");
  });

  it('change value of entry.read in toggle read function', function () {
    scope.session = {good: [{text: 'text', username: 'Tester'}], bad: [], improvements: []};
    scope.toggleRead(scope.session.good[0]);
    expect(scope.session.good[0].read).toBe(true);
    scope.toggleRead(scope.session.good[0]);
    expect(scope.session.good[0].read).toBe(false);
  });

  it('calls update function after toggle in toggle read function', function () {
    scope.session = {good: [{text: 'text', username: 'Tester'}], bad: [], improvements: []};
    spyOn(scope, 'update');
    scope.toggleRead(scope.session.good[0]);
    expect(scope.update).toHaveBeenCalledWith({text: 'text', username:'Tester', read:true});
  });

  it('change value of review mode in toggle review mode function', function () {
    scope.toggleReviewMode();
    expect(scope.reviewMode).toBe(true);
    scope.toggleReviewMode();
    expect(scope.reviewMode).toBe(false);
  });

  it('emits reveal or hide in toggle review mode function', inject(function (socket) {
    scope.sessionId = 'sessionId';
    spyOn(socket, 'emit');
    scope.toggleReviewMode();

    expect(socket.emit).toHaveBeenCalledWith('reveal', {id: 'sessionId'});
    scope.toggleReviewMode();
    expect(socket.emit.mostRecentCall.args).toEqual(['hide', {id: 'sessionId'}]);
  }));

  it('changes next entry as edit entry in next function', function () {
    scope.session = {good: [{text: 'text', username: 'Tester'}, {text: 'second', username: 'Tester'}], bad: [], improvements: []};
    scope.openEntry('good', scope.session.good[0]);
    expect(scope.editEntry).toBe(scope.session.good[0])
    scope.next(scope.session.good[0]);
    expect(scope.editEntry).toBe(scope.session.good[1])
  });

  it('changes previous entry as edit entry in previous function', function () {
    scope.session = {good: [{text: 'text', username: 'Tester'}, {text: 'second', username: 'Tester'}], bad: [], improvements: []};
    scope.openEntry('good', scope.session.good[0]);
    expect(scope.editEntry).toBe(scope.session.good[0])
    scope.next(scope.session.good[1]);
    expect(scope.editEntry).toBe(scope.session.good[0])
  });

  it('emits move current entry in next and previous function', inject(function (socket) {
    scope.sessionId = 'sessionId';
    scope.session = {good: [{text: 'text', username: 'Tester'}, {text: 'second', username: 'Tester'}], bad: [], improvements: []};
    scope.openEntry('good', scope.session.good[0]);
    spyOn(socket, 'emit');
    scope.next(scope.session.good[0]);
    expect(socket.emit).toHaveBeenCalledWith('moveCurrentEntry', {id: 'sessionId', type:'good', index: 1});
    scope.previous(scope.session.good[1]);
    expect(socket.emit).toHaveBeenCalledWith('moveCurrentEntry', {id: 'sessionId', type:'good', index: 0});
  }));
});
