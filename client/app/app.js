'use strict';

angular.module('pokerestimateApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'mm.foundation',
  'ngClipboard'
])
.config(function ($routeProvider, ngClipProvider) {
  ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");

  $routeProvider
  .when('/', {
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  })
  .when('/sessions/:id', {
    templateUrl: 'app/session/session.html'
  })
  .when('/retrospectives/:id', {
    templateUrl: 'app/retrospective/retrospective.html'
  })
  .when('/voteValues', {
    templateUrl: 'app/voteValues/voteValues.html'
  });
});

$(document).ready(function(){
  new WOW().init();
});
