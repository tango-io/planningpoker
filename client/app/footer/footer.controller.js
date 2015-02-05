'use strict';

angular.module('pokerestimateApp')
.controller('FooterCtrl', function ($scope, $window) {
  $scope.share = function($event){
    $event.preventDefault();
    var width = 500;
    var height = 450;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;
    var text = encodeURIComponent('Check this awesome planning poker app');
    $window.open('http://twitter.com/share?text=' + text, 'face',' width='+width+', height='+height+', left='+left +', top='+top);
  };
});
