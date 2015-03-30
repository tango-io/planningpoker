'use strict';

angular.module('windowMock', [])
  .factory('$window', function() {
    return {
      open: function(){
      }
    };
  });
