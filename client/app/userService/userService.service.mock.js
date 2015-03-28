'use strict';

angular.module('userServiceMock', [])
.factory('userService', function (){
  var user = {};
  var voteValues = [];

  return {
    getUser: function(){
      return user;
    },
    setUser: function(usr){
      user = usr;
    },
    getVoteValues: function(){
      return voteValues;
    },
    setVoteValues: function(votes){
      voteValues = votes;
    },
    fakeResponses:{
      getFakeUser: function(){
        return {username: 'tester', type:'moderator', id:'socketId'};
      },
      getFakeValues: function(){
        return [
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
      }
    }
  };
});
