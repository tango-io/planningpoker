'use strict';

describe('Controller: RetrospectivesCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));

  var RetrospectivesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RetrospectivesCtrl = $controller('RetrospectivesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
