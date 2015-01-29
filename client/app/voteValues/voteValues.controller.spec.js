'use strict';

describe('Controller: VoteValuesCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));

  var VoteValuesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VoteValuesCtrl = $controller('VoteValuesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
