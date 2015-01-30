'use strict';

describe('Controller: VoteValuesCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));

  var VoteValuesCtrl, scope;

  var  defaultValues = [
    {label: 0, value: 0},
    {label: 1, value: 1},
    {label: 2, value: 2},
    {label: 3, value: 3},
    {label: 5, value: 5},
    {label: 8, value: 8},
    {label: 13, value: 13}
  ];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VoteValuesCtrl = $controller('VoteValuesCtrl', {
      $scope: scope
    });

  }));

  it('initialize vote values', function () {
    scope.init();
    expect(scope.voteValues).toEqual(defaultValues);
  });

  it('sets listener for session created', function () {
    spyOn(scope, 'redirectToSession');
    scope.init();
    expect(scope.voteValues).toEqual(defaultValues);
  });

  it('emits new session in start session', inject(function (socket) {
    scope.init();
    spyOn(socket.socket, 'emit');
    scope.go();
    expect(socket.socket.emit).toHaveBeenCalledWith('newSession', defaultValues);
  }));

  it('remove values from list', inject(function ($location) {
    scope.init();
    expect(scope.voteValues.length).toBe(7);
    scope.removeValue(0);
    expect(scope.voteValues.length).toBe(6);
  }));

  it('add values from votes list', inject(function ($location) {
    scope.init();
    expect(scope.voteValues.length).toBe(7);
    scope.addValue({label:"this one", value:"4"});
    expect(scope.voteValues.length).toBe(8);
  }));

  it('redirects to session:id on redirect to session function', inject(function ($location) {
    scope.redirectToSession('sessionId');
    expect($location.path()).toMatch('/sessions/sessionId');
  }));

});
