'use strict';

angular.module('socketMock', [])
  .factory('socket', function() {
    return {
      socket: {
        connect: function() {},
        on: function(event, cb) {
          switch(event){
            case 'sessionCreated':
              return cb('sessionId');
              break;
            case 'joinedSession':
              return cb({id: 'sessionId', description:'this is a description'});
              break;
            case 'updateUsers':
              return cb({users: [{username: 'sample', socketId: 'socketId'}] });
              break;
            case 'descriptionUpdated':
              return cb('description is updated');
              break;
            case 'updateVotes':
              return cb({});
              break;
            default:
              return cb();
          }
        },
        emit: function() {
        },
        receive: function() {}
      },
    };
  });
