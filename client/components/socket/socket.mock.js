'use strict';

angular.module('socketMock', [])
  .factory('socket', function() {
    return {
      socket: {
        connect: function() {},
        on: function(event, cb) {
          if(event == 'sessionCreated'){
            return cb('sessionId');
          }
        },
        emit: function() {
        },
        receive: function() {}
      },
    };
  });
