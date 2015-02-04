'use strict';

angular.module('pokerestimateApp')
.directive('hideFor', ['userService', 'removeElement', function (userService, removeElement) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var roles = attrs.hideFor.split(' ');
      var hideFor = _.contains(roles, userService.getUser().userType);

      if (hideFor) {
        angular.forEach(element.children(), function (child) {
          removeElement(child);
        });
        removeElement(element);
      }
    }
  };
}]).constant('removeElement', function(element){
  element && element.remove && element.remove();
});
