'use strict';

describe('Controller: RetrospectiveCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));

  var RetrospectivesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RetrospectivesCtrl = $controller('RetrospectiveCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
