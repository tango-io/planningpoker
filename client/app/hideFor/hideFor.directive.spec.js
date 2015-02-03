'use strict';

ddescribe('Directive: hideFor', function () {

  beforeEach(module('pokerestimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('removes an element from certain types of users', inject(function ($compile, userService) {
    userService.setUser({userType: 'observer'});
    element = angular.element('<div><div hide-for="observer"></div></div>');
    element = $compile(element)(scope);
    expect(element.html()).toBe('');
  }));

  it('does not removes an element from certain types of users', inject(function ($compile, userService) {
    userService.setUser({userType: 'player'});
    element = angular.element('<div><div hide-for="observer"></div></div>');
    element = $compile(element)(scope);
    expect(element.html()).toBe('<div hide-for="observer"></div>');
  }));
});
