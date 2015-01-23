'use strict';

var config = require('../../server/config/local.env');

describe('Session View', function() {
  var page;

  beforeEach(function() {
    page = require('./session.po');
    browser.get('/');
    browser.waitForAngular();
  });

  it('s able to show data after entering a session', function() {
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
    expect(page.usernameText.getText()).toEqual("Your username: Arya");
    expect(page.userList.count()).toEqual(1);
    expect(page.userRow.getText()).toEqual('Arya');
    browser.getCurrentUrl().then(function(url){
      expect(page.shareLink.getText()).toEqual(url);
    });
  });

  it('s able to vote', function() {
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
    page.numbers.click();
    expect(page.userRow.getText()).toEqual('Arya 0');
    expect(page.statics.isDisplayed()).toBe(true);
    expect(page.staticsList.count()).toBe(1);
    expect(page.staticsRow.getText()).toEqual("0 1");
  });
});
