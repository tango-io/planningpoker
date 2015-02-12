'use strict';

angular.module('socketMock', [])
.factory('socket', function() {
  var  defaultValues = [
    {label: 0, value: 0},
    {label: 1, value: 1},
    {label: 2, value: 2},
    {label: 3, value: 3},
    {label: 5, value: 5},
    {label: 8, value: 8},
    {label: 13, value: 13},
    { label : ':/', value : '?' },
    { label : 'Break', value : 'need a break' }
  ];

  return {
    connect: function() {},
    on: function() {},
    onFake: function(event, cb) {
      switch(event){
        case 'sessionCreated':
          return cb('sessionId');
        break;
        case 'joinedSession':
          return cb({id: 'socketId', description:'this is a description', voteValues: defaultValues});
        break;
        case 'updateUsers':
          return cb({players: [{username: 'tester', type: 'moderator', id: 'socketId'}] });
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
    receive: function() {},
  }
});
