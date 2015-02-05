'use strict';

angular.module('pokerestimateApp')
.controller('FooterCtrl', function ($scope, $window) {
  $scope.share = function($event, social){
    $event.preventDefault();

    var width = 500;
    var height = 450;
    var left   = ($(window).width()  - width)  / 2;
    var top    = ($(window).height() - height) / 2;
    var text = encodeURIComponent('Check this awesome planning poker app');
    var description = encodeURIComponent('Best app to point in your sprint planning sessions');
    var path = $event.currentTarget.href;
    var url;
    if(social == 'twitter'){
      url = 'http://twitter.com/share?text=' + text;
    }else if(social=='facebook'){
      url = 'http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]='+path+'&amp;p[title]='+text+'[summary]='+text;
    }else{
      url = "http://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(path)+"&title="+text+"&summary="+description+"&source="+encodeURIComponent(path);
    }

    $window.open(url, social,'width='+width+', height='+height+', left='+left +', top='+top);
  };
});
