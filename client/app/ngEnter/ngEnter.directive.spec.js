'use strict';

ddescribe('Directive: ngEnter', function () {

  // load the directive's module
  beforeEach(module('pokerestimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.myFunction = function(){};
    spyOn(scope, 'myFunction');
  }));

  it('it should call function on enter', inject(function ($compile) {
    element = angular.element('<input type="text" data-ng-enter="myFunction()" />');
    element = $compile(element)(scope);
    element.scope().$apply();
    var e = jQuery.Event('keypress');
    e.which = 13;
    element.trigger(e);
    expect(scope.myFunction).toHaveBeenCalled();
  }));
});
