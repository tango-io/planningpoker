'use strict';

describe('Directive: hideFor', function () {

  // load the directive's module
  beforeEach(module('pokerestimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hide-for></hide-for>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hideFor directive');
  }));
});