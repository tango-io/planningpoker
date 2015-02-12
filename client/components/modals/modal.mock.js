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
    },

    fakeResponses: {
      open: {
        result: {
          then: function(cb) {
            return cb({username: 'tester', userType: 'moderator'});
          }
        }
      },
      cleanOpen:{
        result: {
          then: function(cb) {
            return cb({username: undefined, dataType: undefined});
          }
        }
      }
    }
  };
});


