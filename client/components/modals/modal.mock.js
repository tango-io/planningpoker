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
      editOpen: {
        result: {
          then: function(cb) {
            return cb({currentEntry: {text: 'entry updated'}});
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
