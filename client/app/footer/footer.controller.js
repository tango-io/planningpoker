'use strict';

angular.module('pokerestimateApp')
.controller('FooterCtrl', function ($scope, $window) {
  $scope.share = function($event){
    $event.preventDefault();
    var width = 500;
    var height = 450;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;
    //url    = $event.currentTarget.href;;
    //var opts   = 'status=1'+',width='+width+',height='+height+',top='+top+',left='+left;
    //var text = 'Check this awesome planning poker app';
    //window.open(url + '&text=' + 'Twitter' + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    //var url = "http://poker-estimate.herokuapp.com";
    //console.log(url);
    //window.open('http://twitter.com/share?url=' + url + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    //$window.open('http://twitter.com/share', 'wth', 'height=450, width=550');
    $window.open('http://twitter.com/share', 'face',' width='+width+', height='+height+', left='+left +', top='+top);
  };
});
