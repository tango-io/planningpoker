'use strict';

describe('Directive: hideFor', function () {

  beforeEach(module('pokerestimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('removes an element for certain types of users', inject(function ($compile, userService) {
    scope.userType = "moderator";
    element = angular.element('<div><div hide-for="moderator" model="userType"></div></div>');
    element = $compile(element)(scope);
    element.scope().$apply()
    expect(element.html()).toBe('');
  }));

  it('does not removes an element for certain types of users', inject(function ($compile, userService) {
    scope.userType = "player";
    element = angular.element('<div><div hide-for="moderator" model="userType"></div></div>');
    element = $compile(element)(scope);
    element.scope().$apply()
    expect(element.html()).toBe('<div hide-for="moderator" model="userType"></div>');
  }));
});
