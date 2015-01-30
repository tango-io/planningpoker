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

  it('sets and get voteValues', function () {
    userService.setVoteValues([{label: 'Easy', value: '0'}]);
    expect(userService.getVoteValues().length).toBe(1);
    expect(userService.getVoteValues()[0].label).toBe('Easy');
    expect(userService.getVoteValues()[0].value).toBe('0');
  });

});
