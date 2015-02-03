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
        }
      }
  });
