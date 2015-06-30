(function(){
  'use strict';

  angular.module('pokerestimateApp')
  .directive('hideFor', ['removeElement', function (removeElement) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var roles = attrs.hideFor.split(' ');

        // Wait until value is set
        scope.$watch(attrs.model, function(value){
          var hideFor = _.contains(roles, value);

          if (hideFor) {
            angular.forEach(element.children(), function (child) {
              removeElement(child);
            });
            removeElement(element);
          }
        });
      }
    };
  }]).constant('removeElement', function(element){
    if(element && element.remove){ element.remove() };
  });
})();
