'use strict';

angular.module('pokerestimateApp')
  .factory('userService', function (){
    var user = {};

      return {
        getUser: function(){
          return user;
        },
        setUser: function(usr){
          user = usr;
        }
      }
  });
