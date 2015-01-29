'use strict';

describe('Service: userService', function () {

  // load the service's module
  beforeEach(module('pokerestimateApp'));

  // instantiate service
  var userService;
  beforeEach(inject(function (_userService_) {
    userService = _userService_;
  }));

  it('sets and get user', function () {
    userService.setUser('tester');
    expect(userService.getUser()).toBe('tester');
  });

});
