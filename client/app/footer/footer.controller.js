'use strict';

angular.module('pokerestimateApp')
.controller('FooterCtrl', function ($scope, $window) {
  $scope.share = function($event, social){
    //Remove default link behaviour
    $event.preventDefault();

    //Prepare parameters
    var description = encodeURIComponent('Best app to point in your sprint planning sessions');
    var text        = encodeURIComponent('Check this awesome planning poker app');
    var encodedPath = encodeURIComponent($event.currentTarget.href);
    var path        = $event.currentTarget.href;
    var url;

    //Using FB SDK to share
    if(social === 'facebook'){ return FB.ui({ method: 'share', href: path}); }

    //Setting url for twitter or facebook
    if(social === 'twitter'){
      url = 'http://twitter.com/share?url='+ path +'&text=' + text;
    }else{
      url= 'http://www.linkedin.com/shareArticle?mini=true&url='+encodedPath+'&title='+text+'&summary='+description+'&source='+encodedPath;
    }

    //Setting dimmensions for pop up window
    var width  = 500;
    var height = 450;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;

    //Open share pop up window
    $window.open(url, social,'width='+width+', height='+height+', left='+left +', top='+top);
  };
});
