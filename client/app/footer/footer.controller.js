'use strict';

angular.module('pokerestimateApp')
.controller('FooterCtrl', function ($scope, $window) {
  $scope.share = function($event, social){
    $event.preventDefault();

    var description = encodeURIComponent('Best app to point in your sprint planning sessions');
    var text        = encodeURIComponent('Check this awesome planning poker app');
    var encodedPath = encodeURIComponent($event.currentTarget.href);
    var path        = $event.currentTarget.href;
    var url;

    if(social=='facebook'){
      return FB.ui({ method: 'share', href: path}, function(response){});
    }

    if(social == 'twitter'){
      url = 'http://twitter.com/share?url='+ path +'&text=' + text;
    }else{
      url = "http://www.linkedin.com/shareArticle?mini=true&url="+encodedPath+"&title="+text+"&summary="+description+"&source="+encodedPath;
    }

    var width  = 500;
    var height = 450;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;

    $window.open(url, social,'width='+width+', height='+height+', left='+left +', top='+top);
  };
});
