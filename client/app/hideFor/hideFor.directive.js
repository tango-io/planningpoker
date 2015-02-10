'use strict';

angular.module('pokerestimateApp')
.directive('hideFor', ['removeElement', function (removeElement) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var roles = attrs.hideFor.split(' ');

      scope.$watch(attrs.model, function(newVal){

      var hideFor = _.contains(roles, scope[attrs.model]);

      if (hideFor) {
        angular.forEach(element.children(), function (child) {
          removeElement(child);
        });
        removeElement(element);
      }
      })
    }
  };
}]).constant('removeElement', function(element){
  element && element.remove && element.remove();
});
