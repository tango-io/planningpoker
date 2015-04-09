'use strict';
var config = require('../../server/config/environment');

describe('Session View', function() {
  var page;
  var id;

  beforeEach(function() {
    page = require('./session.po');
    browser.get('/');
    browser.waitForAngular();

    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    browser.waitForAngular();
    page.goBtn.click();
    browser.waitForAngular();
    browser.getCurrentUrl().then(function(url){
      id = url.split('/')[5];
      expect(url).toMatch('#/sessions/');
    });
  });

  it('s able to show data after entering a session', function() {
    expect(page.userList.count()).toEqual(1);
    expect(page.userRow.getText()).toEqual('Arya');
    expect(page.votesList.count()).toEqual(9);
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
    browser.get('/');
    browser.waitForAngular();
    page.usernameInput.sendKeys('Arya');
    page.startBtn.click();
    page.goBtn.click();
    browser.sleep(1000);

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

  it('can close modal if user does not enter username', function(){
    browser.getCurrentUrl().then(function(url){
      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getAllWindowHandles().then(function (handles) {
        var newWindowHandle = handles[1];
        browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
          browser.driver.executeScript('window.focus();');
          browser.get(url);

          expect(page.usernameModalInput.isDisplayed()).toBe(true);

          browser.actions().mouseMove(page.modalBg).click();

          expect(page.usernameModalInput.isDisplayed()).toBe(true);
          expect(page.modalBtn.isEnabled()).toBe(false);

          page.usernameModalInput.sendKeys('Cersei');
          expect(page.modalBtn.isEnabled()).toBe(true);

          browser.driver.close().then(function () {
            browser.switchTo().window(appWindow);
          });
        });
      });
    });
  });

  describe('Session View for players', function() {
   it('s able to vote', function() {
      page.numbers.click();
      expect(page.userRow.element(by.css('.profile')).getText()).toEqual('Arya');
      expect(page.userRow.element(by.css('.vote')).getText()).toEqual('0');
      expect(page.statics.isDisplayed()).toBe(true);
      expect(page.staticsList.count()).toBe(1);
      expect(page.staticsRow.getText()).toEqual("0\n1");
    });

    it('s not able to write description, clear or show votes', function() {
      page.numbers.click();
      expect(page.clearBtn.isPresent()).toBe(false);
      expect(page.descriptionInput.isPresent()).toBe(false);
    });

    it('s not able to vote after show votes', function() {
      page.numbers.click();
      expect(page.number.getAttribute('disabled')).toBe('true');
    });
  });

  describe('Session View for moderators', function() {

    it('s not able to vote or actions related', function(){
      browser.get('/');
      browser.waitForAngular();
      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();
      browser.waitForAngular();

      expect(page.clearBtn.isPresent()).toBe(true);
      expect(page.numbersList.isPresent()).toBe(false);
      expect(page.descriptionInput.isPresent()).toBe(true);
      expect(page.firstModerator.getText()).toBe('Arya');
    });

    it('s able to clear session', function() {
      browser.get('/');
      browser.waitForAngular();

      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();
      browser.waitForAngular();

      page.descriptionInput.sendKeys('This is an story');
      page.clearBtn.click();
      expect(page.descriptionInput.getAttribute('value')).toEqual("");
      expect(page.statics.isDisplayed()).toBe(false);
    });

    it('s able to modify description', function() {
      browser.get('/');
      browser.waitForAngular();
      page.usernameInput.sendKeys('Arya');
      page.moderatorOpt.click();
      page.startBtn.click();
      page.goBtn.click();
      browser.waitForAngular();
      page.descriptionInput.sendKeys('This is an story');

      browser.driver.executeScript('window.open();');
      var appWindow = browser.getWindowHandle();
      browser.getCurrentUrl().then(function(url){
        id = url.split('/')[5];

        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo(newWindowHandle).window(newWindowHandle).then(function () {
            browser.driver.executeScript('window.focus();');
            browser.get('/');

            page.usernameInput_.sendKeys('Cersei');
            page.sessionIdInput.sendKeys(id);
            page.joinBtn.click();
            expect(page.descriptionInput.getAttribute('value')).toEqual("This is an story");
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
      });
    });
  });
});
