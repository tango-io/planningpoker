'use strict';

angular.module('modalMock', [])
.factory('$modal', function() {
  return {
    open: function(data) {
      return {
        result: {
          then: function(cb) {
            return cb();
          }
        },
      }
    }
  };
});


