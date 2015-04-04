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
    {label: 13, value: 13},
    { label : ':/', value : '?' },
    { label : 'Break', value : 'need a break' }
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

  it('emits new session in start session', inject(function (socket) {
    scope.init();
    spyOn(socket, 'emit');
    scope.go();
    expect(socket.emit).toHaveBeenCalledWith('newSession', defaultValues);
  }));

  it('remove values from list', inject(function ($location) {
    scope.init();
    expect(scope.voteValues.length).toBe(defaultValues.length);
    scope.removeValue(scope.voteValues[0]);
    expect(scope.voteValues.length).toBe(defaultValues.length - 1);
  }));

  it('add values from votes list', inject(function ($location) {
    scope.init();
    expect(scope.voteValues.length).toBe(defaultValues.length);
    scope.addValue({label:"this one", value:"4"});
    expect(scope.voteValues.length).toBe(defaultValues.length + 1);
  }));
});
