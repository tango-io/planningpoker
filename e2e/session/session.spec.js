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
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toMatch('#/sessions/');
    expect(page.usernameText.getText()).toEqual("Your username: Arya");
    expect(page.userList.count()).toEqual(1);
    expect(page.userRow.getText()).toEqual('Arya');

    browser.getCurrentUrl().then(function(url){
      expect(page.shareLink.getText()).toEqual(url);
    });
  });

});
