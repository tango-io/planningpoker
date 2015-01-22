'use strict';

angular.module('pokerestimateApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'mm.foundation'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/sessions/:id', {
        templateUrl: 'app/session/session.html',
        controller: 'SessionCtrl'
      });

    //$locationProvider.html5Mode(true);
  });


function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}
