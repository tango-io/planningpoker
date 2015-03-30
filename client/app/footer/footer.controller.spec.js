'use strict';

describe('Controller: FooterCtrl', function () {

  // load the controller's module
  beforeEach(module('pokerestimateApp'));
  beforeEach(module('windowMock'));
  beforeEach(module('FBMock'));

  var FooterCtrl, scope;
  var FB  = {ui: function(){}};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window, _FB_) {
    scope = $rootScope.$new();

    FooterCtrl = $controller('FooterCtrl', {
      $scope: scope,
    });

    spyOn($window, 'open');
  }));

  var event = {currentTarget: {href:'http://test'}, preventDefault: function(){}};
  var description = encodeURIComponent('Best app to point in your sprint planning sessions');
  var text        = encodeURIComponent('Check this awesome planning poker app');
  var encodedPath = encodeURIComponent(event.currentTarget.href);

  it('should call open method with the correct arguments sharing via twitter', inject(function ($window) {
    scope.share(event, 'twitter');
    expect($window.open).toHaveBeenCalledWith('http://twitter.com/share?url='+ event.currentTarget.href +'&text='+ text, 'twitter', jasmine.any(String));
  }));

  it('should call open  method with the correct arguments sharing via linked in', inject(function ($window) {
    scope.share(event, 'linkedin');
    expect($window.open).toHaveBeenCalledWith('http://www.linkedin.com/shareArticle?mini=true&url='+encodedPath+'&title='+text+'&summary='+description+'&source='+encodedPath, 'linkedin', jasmine.any(String));
  }));

  it('should call share method from FB ui method with the correct arguments sharing via facebook', inject(function ($window, FB) {
    window.FB = FB;
    spyOn(window.FB, 'ui');
    scope.share(event, 'facebook');
    expect(FB.ui).toHaveBeenCalledWith({ method : 'share', href : event.currentTarget.href });
  }));
});
