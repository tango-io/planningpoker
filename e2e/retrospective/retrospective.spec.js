'use strict';
var config = require('../../server/config/local.env');

describe('Retrospective View', function() {
  var page;
  var id;

  beforeEach(function() {
    page = require('./session.po');
    browser.get('/');
    browser.waitForAngular();

    page.usernameInput.sendKeys('Arya');
    page.retrospectiveOpt.click();
    page.startBtn.click();
    browser.waitForAngular();

    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[5];
      expect(url).toMatch('#/retrospectives/');
    });
  });

  it('s able to show data after entering a session', function() {
  });

  it('s prompts username request if user does not have', function(){
    browser.getCurrentUrl().then(function(url){
      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getAllWindowHandles().then(function (handles) {
        var newWindowHandle = handles[1];
        browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
          browser.driver.executeScript('window.focus();');
          browser.get(url);
          expect(page.usernameModalInput.isDisplayed()).toBe(true);
          page.usernameModalInput.sendKeys('Cersei');
          page.moderatorModalOpt.click();
          page.modalBtn.click();
          expect(page.userRow.getText()).toEqual("Arya");
          expect(page.firstModerator.getText()).toEqual("Cersei");
          browser.driver.close().then(function () {
            browser.switchTo().window(appWindow);
          });
        });
      });
    });
  });

  it('s able to copy link and id to share session', function() {
    browser.getCurrentUrl().then(function(url){
      expect(page.shareUrl.getAttribute('value')).toEqual(url);
      expect(page.shareId.getAttribute('value')).toEqual(id);
      page.shareUrlBtn.click();
      browser.sleep(1000);
      expect(page.shareTooltip.getText()).toEqual('Copied')
      page.shareIdBtn.click();
      browser.sleep(1000);
      expect(page.shareTooltip.getText()).toEqual('Copied')
      expect(page.shareTooltip.getText()).toEqual('Copied')
    });
  });

  it('s able to view moderator and players list', function(){
    expect(page.userList.count()).toBe(1);
    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.moderatorOpt.click();
    page.startBtn.click();
    page.goBtn.click();
    browser.sleep(1000);
    expect(page.moderatorsList.count()).toBe(1);
  });

  it('s able to add entries in all categories', function() {
  });

  it('s able to edit entries in all categories', function() {
  });

  it('s able to remove entries in all categories', function() {
  });

  it('s able to open an entry from all categories', function() {
  });

  it('s able to go to next entry in reveal mode', function() {
  });

  it('s able to go to previous entry in reveal mode', function() {
  });

  it('s able to mark or unmark entry as read', function() {
  });

  describe('Session View for players', function() {
    it('s not able to reveal entries', function() {
    });

    it('s not able select share mode', function() {
    });
  });

  describe('Session View for moderators', function() {

    it('s able to reveal entries', function(){
    });

    it('s able to select share mode', function() {
    });
  });
});
